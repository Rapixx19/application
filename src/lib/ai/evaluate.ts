import Anthropic from "@anthropic-ai/sdk";
import type { AIEvaluation, ApplicationForEvaluation } from "./types";

const SYSTEM_PROMPT = `You are an expert recruiter evaluating applications for Sentavita, an early-stage equine health technology company founded by Olympic-level equestrians.

Sentavita is building the first continuous health monitoring wearable platform for horses. The founding team has competed at the highest levels of international equestrian sport and is looking for exceptional contributors across engineering, design, and technology.

The company values:
- Real, hands-on experience over credentials
- Technical depth in relevant domains
- Understanding of hardware/wearables challenges
- Mission alignment with equine welfare
- Clear communication and self-awareness

Available roles:
1. Mechanical engineering - Wearable form factor, stress analysis, material selection, CAD
2. Industrial / product design - Form, ergonomics, materials, animal-centred design
3. Data science / ML - Biometric signal processing, anomaly detection, time-series
4. Software / mobile dev - Cross-platform apps, real-time dashboards

Evaluate candidates objectively. Be honest about weaknesses - the admin needs accurate assessments to make decisions. Do not inflate scores to be polite.`;

const EVALUATION_PROMPT = `Evaluate this application and respond with ONLY a valid JSON object (no markdown, no explanation):

CANDIDATE:
Name: {{full_name}}
Country: {{country}}
Institution: {{institution}}
Background: {{background}}
Roles applied for: {{roles}}
Portfolio: {{portfolio_url}}

Role-specific answers:
{{role_details}}

Motivation:
{{motivation}}

---

Respond with this exact JSON structure:
{
  "role_match_score": <0-100>,
  "overall_rating": <1-5>,
  "summary": "<2-3 sentence executive summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "role_fit": {
    "<role name>": { "score": <0-100>, "reasoning": "<1 sentence>" }
  },
  "red_flags": ["<flag>" or empty array],
  "recommendation": "<strong_yes|yes|maybe|no>"
}

Scoring guide:
- role_match_score: 0-40 poor fit, 41-60 potential, 61-80 good fit, 81-100 excellent fit
- overall_rating: 1=reject, 2=weak, 3=average, 4=strong, 5=exceptional
- recommendation: strong_yes (top 10%), yes (top 30%), maybe (worth discussing), no (not a fit)`;

function buildPrompt(app: ApplicationForEvaluation): string {
  const roleDetails = Object.entries(app.role_details || {})
    .map(([role, answers]) => {
      if (typeof answers === "string") {
        return `${role}: ${answers}`;
      }
      if (typeof answers === "object" && answers !== null) {
        return `${role}:\n${Object.entries(answers)
          .map(([q, a]) => `  - ${q}: ${a}`)
          .join("\n")}`;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n") || "No role-specific answers provided";

  return EVALUATION_PROMPT
    .replace("{{full_name}}", app.full_name)
    .replace("{{country}}", app.country || "Not specified")
    .replace("{{institution}}", app.institution || "Not specified")
    .replace("{{background}}", app.background || "Not specified")
    .replace("{{roles}}", app.roles?.join(", ") || "None selected")
    .replace("{{portfolio_url}}", app.portfolio_url || "Not provided")
    .replace("{{role_details}}", roleDetails)
    .replace("{{motivation}}", app.motivation || "Not provided");
}

let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

export async function evaluateApplication(
  app: ApplicationForEvaluation
): Promise<AIEvaluation> {
  const client = getAnthropicClient();
  const prompt = buildPrompt(app);

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    system: SYSTEM_PROMPT,
  });

  const textContent = message.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude");
  }

  let jsonStr = textContent.text.trim();

  // Handle potential markdown code blocks
  if (jsonStr.startsWith("```")) {
    const lines = jsonStr.split("\n");
    jsonStr = lines.slice(1, -1).join("\n");
  }

  const parsed = JSON.parse(jsonStr);

  return {
    version: "1.0",
    generated_at: new Date().toISOString(),
    role_match_score: parsed.role_match_score,
    overall_rating: parsed.overall_rating,
    summary: parsed.summary,
    strengths: parsed.strengths,
    weaknesses: parsed.weaknesses,
    role_fit: parsed.role_fit,
    red_flags: parsed.red_flags || [],
    recommendation: parsed.recommendation,
  };
}
