/* eslint-disable @typescript-eslint/restrict-template-expressions */
import 'dotenv/config';

import { createTransport, getTestMessageUrl } from 'nodemailer';
// import { Address } from 'nodemailer/lib/mailer';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeANiceEmail(text: string): string {
  return `
    <div className="email" style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello There!</h2>
      <p>${text}</p>
      <p>Cheers, Darko</p>
    </div>
  `;
}

// export interface MailResponse {
//   accepted: (string)[] | null;
//   rejected: (null)[] | null;
//   envelopeTime: number;
//   messageTime: number;
//   messageSize: number;
//   response: string;
//   envelope: Envelope;
//   messageId: string;
//   pending: (string | Address)[];
// }
// export interface Envelope {
//   from: string;
//   to: (string)[] | null;
// }

export async function sendPasswordResetEmail(resetToken: string, to: string): Promise<void> {
  // email the user a token
  const info = await transport.sendMail({
    to,
    from: 'sick@fits.com',
    subject: 'Your password reset token!',
    html: makeANiceEmail(`Your Password Reset Token is here!
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to reset</a>
    `),
  });

  if (process.env.MAIL_USER.includes('ethereal.email')) {
    console.log(`💌 Message Sent!  Preview it at ${getTestMessageUrl(info)}`);
  }
}
