import type { ContentMap } from "./types";
import { NDA_TEXT } from "./nda-text";

export const defaults: ContentMap = {
  splash: {
    wordmark: "Sentavita",
    tagline: "Equine Health Technology",
    duration: 5000,
  },
  landing: {
    hero: {
      eyebrow: "Open Application \u00b7 Limited Cohort",
      headline: "Built by riders.\nEngineered for horses.",
      body: "Sentavita is an early-stage hardware and technology company building a continuous health monitoring platform for horses. Founded by a team with decades of experience at the highest levels of international equestrian sport, we are developing the first wearable device of its kind \u2014 designed for everyday use, across every discipline, at every level of the sport. We are not ready to share the full details publicly, but we are ready to bring the right people in. We are looking for driven, experienced individuals across engineering, design, and technology to join a small, focused team at an early stage.",
      cta_text: "Apply to collaborate \u2192",
      cta_link: "/apply",
    },
    sections: {
      who_we_are: "Who we are",
      who_we_are_body: "Our founding team has competed and operated at the pinnacle of international equestrian sport \u2014 from the stables and training grounds to the Olympic arena. We have managed, trained, and partnered with horses that have stood on podiums at the world\u2019s most prestigious competitions, working alongside elite athletes and veterinary professionals with the highest standards in the sport.",
      who_we_are_body_2: "That experience taught us one thing: the horse cannot speak. Every decision depends on human intuition and reactive care. We believe that is no longer good enough.",
      what_we_build: "What we\u2019re building",
      what_we_build_body: "Sentavita is developing a wearable health technology platform for horses \u2014 tackling equine health from a perspective the industry has not seen before. We are not ready to share full details publicly, but we are ready to bring the right people in.",
      who_we_seek: "Who we are looking for",
      who_we_seek_body: "Exceptional individuals with real, hands-on experience. Not limited to students \u2014 if you have the skills and the drive, we want to hear from you.",
      what_we_offer: "What we offer",
      what_we_offer_body: "This is an opportunity to position yourself as an early contributor to a groundbreaking product that does not yet exist in the market \u2014 one with the potential to fundamentally change how equine health is managed across the sport.",
      commitment: "The commitment",
    },
    stats: [
      { value: "Olympic", label: "Level pedigree" },
      { value: "10+", label: "Nations & circuits" },
      { value: "Phase I", label: "Design cohort" },
    ],
    callout: {
      tag: "For selected collaborators only",
      text: "Full access to project architecture, design documentation, and engineering brief \u2014 released after review and a confidentiality agreement.",
    },
    roles: [
      { title: "Mechanical engineering", description: "Wearable form factor, stress analysis, material selection. CAD experience essential.", icon: "\u2699\ufe0f" },
      { title: "Industrial / product design", description: "Form, ergonomics, materials for wearable hardware. Animal-centred design thinking a plus.", icon: "\ud83c\udfa8" },
      { title: "Data science / ML", description: "Biometric signal processing, anomaly detection, time-series modelling.", icon: "\ud83d\udcca" },
      { title: "Software / mobile dev", description: "Cross-platform apps, real-time dashboards. React Native or Flutter preferred.", icon: "\ud83d\udcbb" },
    ],
    offers: [
      { title: "Named credit", description: "In the product, every investor deck, and all press from launch.", icon: "\u2b50" },
      { title: "Portfolio ownership", description: "Full rights to showcase every piece of real, shippable work.", icon: "\ud83d\udcc1" },
      { title: "Direct reference", description: "From founders with an Olympic-level track record.", icon: "\ud83c\udfc5" },
      { title: "Path to equity", description: "Early contributors are the first conversation when funding is secured.", icon: "\ud83d\udcc8" },
    ],
    commitment: {
      body: "Long-term collaboration, not a one-off project. Selected collaborators are treated as founding contributors \u2014 your work shapes the product in ways that remain visible long after the first version launches.",
      cta_text: "Apply to collaborate \u2192",
      cta_link: "/apply",
    },
  },
  apply: {
    headline: "Apply to Sentavita",
    subheadline: "All applications are reviewed personally by the founding team. Please keep your responses concise and focused on your relevant experience and what you can contribute to this project.",
    steps: [
      { title: "Let\u2019s start with the basics", description: "Who are you?" },
      { title: "Where are you based?", description: "This helps us understand your timezone and context." },
      { title: "Your background", description: "Tell us about your experience, what role interests you, and answer a few questions based on your selection." },
      { title: "Almost there", description: "Share your work, tell us why this project matters to you, and optionally upload your CV." },
    ],
    countries: ["Switzerland", "Germany", "United Kingdom", "Spain", "France", "Italy", "Netherlands", "Austria", "Other"],
    backgrounds: ["Student", "Recent graduate", "Working professional", "Academic", "Freelance"],
    role_options: ["Mechanical engineering", "Industrial / product design", "Data science / ML", "Software / mobile development"],
    role_questions: {
      "Mechanical engineering": [
        { label: "What CAD tools do you use?", placeholder: "e.g., SolidWorks, Fusion 360, CATIA...", type: "text" },
        { label: "Describe your mechanical design experience", placeholder: "Have you designed wearable or small-form-factor devices? What materials and manufacturing methods have you worked with?", type: "textarea" },
      ],
      "Industrial / product design": [
        { label: "What design tools do you use?", placeholder: "e.g., Fusion 360, SolidWorks, Rhino, Figma...", type: "text" },
        { label: "Describe your physical product design experience", placeholder: "Have you designed physical products before? What materials, processes, or manufacturing methods have you worked with?", type: "textarea" },
      ],
      "Data science / ML": [
        { label: "What ML frameworks and tools do you use?", placeholder: "e.g., Python, TensorFlow, PyTorch, scikit-learn...", type: "text" },
        { label: "Describe your signal processing or time-series experience", placeholder: "Have you worked with biometric data, anomaly detection, or real-time data pipelines?", type: "textarea" },
      ],
      "Software / mobile development": [
        { label: "What is your primary tech stack?", placeholder: "e.g., React Native, Flutter, Swift, Kotlin...", type: "text" },
        { label: "Describe your mobile or dashboard development experience", placeholder: "Have you built cross-platform apps or real-time dashboards? What frameworks and tools did you use?", type: "textarea" },
      ],
    },
  },
  submitted: {
    headline: "We\u2019ll be in touch.",
    body: "Your application has been submitted and will be reviewed personally. If your profile is a fit, we will reach out by email with a confidentiality agreement and full project access.",
    next_steps: [
      "Review \u2014 Expect a response within 5\u201310 business days.",
      "NDA \u2014 If selected, you\u2019ll receive a confidentiality agreement to sign digitally.",
      "Project access \u2014 Once signed, the full project folder is released automatically.",
    ],
  },
  status: {
    headline: "Check Your Application Status",
    body: "Enter the email you used to apply and we\u2019ll show you where things stand.",
  },
  nda: {
    eyebrow: "Step 2 of 2 \u00b7 Confidentiality agreement",
    headline: "You\u2019ve been selected.",
    body: "Please read and sign the NDA below. Your project folder will be released automatically the moment you sign.",
    nda_text: NDA_TEXT,
    signature_note: "By typing your name you agree to the full terms. Date and timestamp are recorded. Project files are released immediately on signing.",
  },
  welcome: {
    eyebrow: "NDA signed \u00b7 Files released",
    headline: "Welcome to the team.",
    body: "Your NDA has been recorded and your project folder is available below. The founding team will be in touch within 48 hours to schedule your onboarding call.",
    scheduling_url: "",
    scheduling_enabled: false,
  },
  branding: {
    primary_color: "#1a1a2e",
    accent_color: "#2d8a5e",
    logo_path: "",
  },
};
