import nodemailer from 'nodemailer';
import 'dotenv/config';
import config from 'config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.get<string>('nodemailerUser'),
    pass: config.get<string>('nodemailerPass'),
  },
});

export const sendMail = (to: string, subject: string, html: string) => {
  transporter.sendMail({
    from: config.get<string>('nodemailerUser'),
    to,
    subject,
    html,
  });
};
