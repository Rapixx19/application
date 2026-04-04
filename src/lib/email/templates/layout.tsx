import {
  Html, Head, Body, Container, Section, Text, Hr, Img,
} from "@react-email/components";

export function EmailLayout({
  children,
  preview,
}: {
  children: React.ReactNode;
  preview?: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#fafafa", fontFamily: "Inter, Arial, sans-serif", margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 520, margin: "0 auto", padding: "40px 24px" }}>
          {/* Header */}
          <Section style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 20, fontWeight: 600, color: "#1a1a2e", margin: 0 }}>
              Sentavita
            </Text>
          </Section>

          {/* Content */}
          {children}

          {/* Footer */}
          <Hr style={{ borderColor: "#e5e7eb", margin: "32px 0" }} />
          <Text style={{ fontSize: 12, color: "#9ca3af", lineHeight: "18px" }}>
            Sentavita &mdash; Equine Health Technology
          </Text>
          <Text style={{ fontSize: 12, color: "#9ca3af" }}>
            This is an automated message. Please do not reply directly.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
