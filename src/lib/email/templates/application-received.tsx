import { Text, Section } from "@react-email/components";
import { EmailLayout } from "./layout";

export function ApplicationReceivedEmail({ name }: { name: string }) {
  return (
    <EmailLayout preview="We've received your application">
      <Text style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
        We&apos;ve received your application.
      </Text>
      <Text style={{ fontSize: 15, color: "#4b5563", lineHeight: "24px" }}>
        Hi {name}, thank you for applying to collaborate with Sentavita.
        Your application will be reviewed personally by the founding team.
      </Text>
      <Section style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 4 }}>
          What happens next:
        </Text>
        <Text style={{ fontSize: 14, color: "#4b5563", lineHeight: "22px", margin: 0 }}>
          1. We review your application (5&ndash;10 business days){"\n"}
          2. If selected, you&apos;ll receive an NDA to sign digitally{"\n"}
          3. Once signed, your project folder is released automatically
        </Text>
      </Section>
    </EmailLayout>
  );
}
