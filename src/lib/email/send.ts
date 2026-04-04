import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
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
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "your-resend-key-here") {
    console.log(`[Email skipped] To: ${to}, Subject: ${subject}`);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: Array.isArray(to) ? to : [to],
    subject,
    react,
  });
}

export { ADMINS };
