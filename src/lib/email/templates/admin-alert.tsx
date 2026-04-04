import { Text, Section, Link } from "@react-email/components";
import { EmailLayout } from "./layout";

interface AdminAlertProps {
  name: string;
  email: string;
  roles: string[];
  country: string;
  adminUrl: string;
}

export function AdminAlertEmail({ name, email, roles, country, adminUrl }: AdminAlertProps) {
  return (
    <EmailLayout preview={`New application from ${name}`}>
      <Text style={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
        New application received
      </Text>
      <Section style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginTop: 16 }}>
        <Text style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 4px" }}>Applicant</Text>
        <Text style={{ fontSize: 15, fontWeight: 600, color: "#1a1a2e", margin: 0 }}>{name}</Text>
        <Text style={{ fontSize: 13, color: "#6b7280", margin: "2px 0 12px" }}>{email}</Text>

        <Text style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 4px" }}>Role interest</Text>
        <Text style={{ fontSize: 14, color: "#1a1a2e", margin: "0 0 12px" }}>{roles.join(", ")}</Text>

        <Text style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 4px" }}>Country</Text>
        <Text style={{ fontSize: 14, color: "#1a1a2e", margin: 0 }}>{country}</Text>
      </Section>
      <Section style={{ marginTop: 24 }}>
        <Link href={adminUrl} style={{ display: "inline-block", padding: "12px 24px", backgroundColor: "#1a1a2e", color: "white", borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
          Review application &rarr;
        </Link>
      </Section>
    </EmailLayout>
  );
}
