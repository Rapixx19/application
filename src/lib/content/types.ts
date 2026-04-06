export interface SplashContent {
  wordmark: string;
  tagline: string;
  duration: number;
  video_url: string;
  music_url: string;
  music_volume: number;
}

export interface HeroContent {
  eyebrow: string;
  headline: string;
  body: string;
  cta_text: string;
  cta_link: string;
}

export interface StatCard {
  value: string;
  label: string;
}

export interface RoleCard {
  title: string;
  description: string;
  icon: string;
}

export interface OfferCard {
  title: string;
  description: string;
  icon: string;
}

export interface CalloutContent {
  tag: string;
  text: string;
}

export interface SectionHeadings {
  who_we_are: string;
  who_we_are_body: string;
  who_we_are_body_2: string;
  what_we_build: string;
  what_we_build_body: string;
  who_we_seek: string;
  who_we_seek_body: string;
  what_we_offer: string;
  what_we_offer_body: string;
  commitment: string;
}

export interface CommitmentContent {
  body: string;
  cta_text: string;
  cta_link: string;
}

export interface LandingContent {
  hero: HeroContent;
  stats: StatCard[];
  callout: CalloutContent;
  roles: RoleCard[];
  offers: OfferCard[];
  sections: SectionHeadings;
  commitment: CommitmentContent;
}

export interface RoleQuestion {
  label: string;
  placeholder: string;
  type: "text" | "textarea";
}

export interface ApplyContent {
  headline: string;
  subheadline: string;
  steps: { title: string; description: string }[];
  countries: string[];
  backgrounds: string[];
  role_options: string[];
  role_questions: Record<string, RoleQuestion[]>;
}

export interface SubmittedContent {
  headline: string;
  body: string;
  next_steps: string[];
}

export interface StatusContent {
  headline: string;
  body: string;
}

export interface NdaContent {
  eyebrow: string;
  headline: string;
  body: string;
  nda_text: string;
  signature_note: string;
}

export interface WelcomeContent {
  eyebrow: string;
  headline: string;
  body: string;
  scheduling_url: string;
  scheduling_enabled: boolean;
}

export interface BrandingContent {
  primary_color: string;
  accent_color: string;
  logo_path: string;
}

export type PageKey =
  | "splash"
  | "landing"
  | "apply"
  | "submitted"
  | "status"
  | "nda"
  | "welcome"
  | "branding";

export type ContentMap = {
  splash: SplashContent;
  landing: LandingContent;
  apply: ApplyContent;
  submitted: SubmittedContent;
  status: StatusContent;
  nda: NdaContent;
  welcome: WelcomeContent;
  branding: BrandingContent;
};
