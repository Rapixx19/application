import { Text, Section, Link } from "@react-email/components";
import { EmailLayout } from "./layout";

interface NdaInvitationProps {
  name: string;
  ndaUrl: string;
}

export function NdaInvitationEmail({ name, ndaUrl }: NdaInvitationProps) {
  return (
    <EmailLayout preview="You've been selected — sign your NDA">
      <Text style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
        You&apos;ve been selected.
      </Text>
      <Text style={{ fontSize: 15, color: "#4b5563", lineHeight: "24px" }}>
        Hi {name}, the founding team has reviewed your application and we&apos;d like
        to move forward. Before we can share project details, we need you to review
        and sign a confidentiality agreement.
      </Text>
      <Section style={{ marginTop: 24 }}>
        <Link href={ndaUrl} style={{ display: "inline-block", padding: "14px 28px", backgroundColor: "#2d8a5e", color: "white", borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
          Review &amp; sign NDA &rarr;
        </Link>
      </Section>
      <Text style={{ fontSize: 13, color: "#9ca3af", marginTop: 24, lineHeight: "20px" }}>
        This link expires in 30 days. Your project folder will be released
        automatically the moment you sign.
      </Text>
    </EmailLayout>
  );
}
