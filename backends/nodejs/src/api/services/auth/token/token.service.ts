import { randomBytes } from "crypto";

import { ITokenService } from "./ITokenService";
import { prisma } from "../../../../utils/prisma"
import { EmailService } from "../email/mail.service";
import { v4 as uuidv4 } from "uuid";


const emailService = new EmailService();

export class TokenService implements ITokenService{
    private generateRandomCode(): string {
        const characters = '0123456789';
        const codeLength = 6;
        let code = '';

        for (let i = 0; i < codeLength; i++) {
            const randomIndex = Math.floor(randomBytes(1).readUInt8(0) / 256 * characters.length);
            code += characters[randomIndex];
        }

        return code;
    }

    public async getVerificationTokenByEmail(email: string){
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                email: email
            }
        })

        return verificationToken;
    }

    public async getVerificationTokenByToken(token: string){
        const verificationToken = await prisma.verificationToken.findUnique({
            where: {
                token: token
            }
        })

        return verificationToken;
    }

    public async getPasswordResetTokenByToken(token: string){
        try{
            const verificationToken = await prisma.passwordResetToken.findUnique({
                where: {
                    token: token
                }
            })

            return verificationToken;
        }
        catch (error) {
            throw new Error('Token does not exist');
        }
    }

    private async getPasswordResetTokenByEmail(email: string){
        try{
            const verificationToken = await prisma.passwordResetToken.findFirst({
                where: {
                    email: email
                }
            })
            return verificationToken;
        }
        catch (error) {
            throw new Error('Token does not exist');
        }
    }

    public async getTwoFactorTokenByEmail(email: string){
        try{
            const twoFactorToken = await prisma.twoFactorToken.findFirst({
                where: {
                    email: email
                }
            })

            return twoFactorToken;
        } catch (error) {
            throw new Error('Token does not exist');
        }
    }

    private async deleteExistingToken(email: string, tokenType: 'verification' | 'passwordReset' | 'twoFactor') {
        let existingToken;
        try {
            
            if (tokenType === 'verification') {
                existingToken = await this.getVerificationTokenByEmail(email);
                if (existingToken) {
                    await prisma.verificationToken.delete({ 
                        where: { id: existingToken.id } 
                    });
                }

            } else if (tokenType === 'twoFactor') {
                existingToken = await this.getTwoFactorTokenByEmail(email);
                if (existingToken) {
                    await prisma.twoFactorToken.delete({ 
                        where: { id: existingToken.id } 
                    });
                }
            } 
            else if (tokenType === 'passwordReset') {
                existingToken = await this.getPasswordResetTokenByEmail(email);
                if (existingToken) {
                    await prisma.passwordResetToken.delete({ 
                        where: { id: existingToken.id } 
                    });
                }
            }
            // else if (tokenType === 'twoFactor') {
            //     existingToken = await this.getTwoFactorTokenByEmail(email);
            // }

            // existingToken = await this.getVerificationTokenByEmail(email);
            
            // if (existingToken) {
            //     await prisma.verificationToken.delete({ 
            //         where: { id: existingToken.id } 
            //     });
            // }
        } catch (error) {
            console.error(`Error deleting existing ${tokenType} token for ${email}:`, error);
            throw new Error('Failed to delete existing token');
        }
    }


    public async generateVerificationToken(email: string): Promise<any> {
        const token = this.generateRandomCode();
        const expires = new Date(Date.now() + 10 * 60 * 1000);

        try {
    
            await this.deleteExistingToken(email, 'verification');

            const verificationToken = await prisma.verificationToken.create({
                data: { 
                    email: email,
                    token: token,
                    expires: expires 
                },
            });

            await emailService.sendVerificationEmail(
                    verificationToken.email, 
                    verificationToken.token
                );

            return verificationToken;
            
        } catch (error) {
            console.error(`Error generating verification token for ${email}:`, error);
            throw new Error('Failed to generate verification token');
        }
    }

    public async generatePasswordResetToken(email: string): Promise<any> {
        const token = uuidv4();
        const expires = new Date(Date.now() + 10 * 60 * 1000);

        try {
            await this.deleteExistingToken(email, 'passwordReset');

            const passwordResetToken = await prisma.passwordResetToken.create({
                data: { 
                    email, 
                    token, 
                    expires 
                },
            });

            return passwordResetToken;

        } catch (error) {
            console.error(`Error generating password reset token for ${email}:`, error);
            throw new Error('Failed to generate password reset token');
        }
    }

    public async generateTwoFactorToken(email: string): Promise<any> {
        const token = this.generateRandomCode();
        const expires = new Date(Date.now() + 10 * 60 * 1000);

        try {
            await this.deleteExistingToken(email, 'twoFactor');

            return await prisma.twoFactorToken.create({
                data: { email, token, expires },
            });


        } catch (error) {
            throw new Error('Failed to generate two-factor token');
        }
    }

}