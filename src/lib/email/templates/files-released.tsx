import { Text, Section, Link } from "@react-email/components";
import { EmailLayout } from "./layout";

interface FilesReleasedProps {
  name: string;
  welcomeUrl: string;
}

export function FilesReleasedEmail({ name, welcomeUrl }: FilesReleasedProps) {
  return (
    <EmailLayout preview="Your project files are ready">
      <Text style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
        Welcome to the team.
      </Text>
      <Text style={{ fontSize: 15, color: "#4b5563", lineHeight: "24px" }}>
        Hi {name}, your NDA has been recorded and your project folder is now available.
        The founding team will be in touch within 48 hours to schedule your onboarding call.
      </Text>
      <Section style={{ marginTop: 24 }}>
        <Link href={welcomeUrl} style={{ display: "inline-block", padding: "14px 28px", backgroundColor: "#2d8a5e", color: "white", borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
          Access project files &rarr;
        </Link>
      </Section>
      <Text style={{ fontSize: 13, color: "#9ca3af", marginTop: 24, lineHeight: "20px" }}>
        Keep this link safe &mdash; it&apos;s your personal access to the project folder.
      </Text>
    </EmailLayout>
  );
}
