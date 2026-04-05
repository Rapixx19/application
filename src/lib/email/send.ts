import { Resend } from "resend";

const FROM = "Sentavita <noreply@sentavita.com>";
const ADMINS = ["fstraehuber@sentavita.com", "lmanning@sentavita.com"];

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === "your-resend-key-here") {
    console.log(`[Email skipped] To: ${to}, Subject: ${subject}`);
    return;
  }

  const resend = new Resend(key);
  await resend.emails.send({
    from: FROM,
    to: Array.isArray(to) ? to : [to],
    subject,
    react,
  });
}

export { ADMINS };
