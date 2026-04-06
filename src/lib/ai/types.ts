export interface AIEvaluation {
  version: string;
  generated_at: string;
  role_match_score: number;
  overall_rating: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  role_fit: Record<string, { score: number; reasoning: string }>;
  red_flags: string[];
  recommendation: "strong_yes" | "yes" | "maybe" | "no";
}

export interface ApplicationForEvaluation {
  full_name: string;
  country: string;
  institution: string;
  background: string;
  roles: string[];
  role_details: Record<string, string>;
  motivation: string;
  portfolio_url: string | null;
}
