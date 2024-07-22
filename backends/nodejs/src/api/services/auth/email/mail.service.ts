import nodemailer, { SendMailOptions } from "nodemailer";
import dotenv from "dotenv";

import { IEmailService } from "./IEmailService";


dotenv.config();

export class EmailService implements IEmailService {
    private transporter;

    constructor() {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      });
    }

    private async sendMail(mailOptions: SendMailOptions): Promise<void> {
      await this.transporter.sendMail(mailOptions);
    }

    public async sendVerificationEmail(email: string, token: string): Promise<void> {
      const mailOptions: SendMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "Welcome to Tasks.io!",
        html: `<p>Your verification code is ${token}</p>`,
      };

      await this.sendMail(mailOptions);
    }

  public async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const domain = process.env.FRONTEND_URL;
    const resetLink = `${domain}/auth/new-password?token=${token}`;

    const mailOptions: SendMailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
    };

    await this.sendMail(mailOptions);
  }

    public async sendTwoFactorEmail(email: string, token: string): Promise<void> {
      const mailOptions: SendMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "Two factor code",
        html: `<p>Your two factor code is ${token}</p>`,
      };

      await this.sendMail(mailOptions);
    }
}
