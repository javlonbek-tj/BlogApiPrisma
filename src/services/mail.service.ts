import nodemailer from 'nodemailer';
import 'dotenv/config';
import config from 'config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.get<string>('NODEMAILER_USER'),
    pass: config.get<string>('NODEMAILER_PASS'),
  },
});

export const sendMail = (to: string, subject: string, html: string) => {
  transporter.sendMail({
    from: config.get<string>('NODEMAILER_USER'),
    to,
    subject,
    html,
  });
};
