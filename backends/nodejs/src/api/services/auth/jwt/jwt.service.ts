import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { IJwtService } from './IJwtService';


dotenv.config();

export class JwtService implements IJwtService {
    private secret: string;
    private expiration: string;

    constructor() {
        this.secret = process.env.JWT_SECRET;
        this.expiration = '1h';
    }

    generateToken(userId: string): string {
        return jwt.sign({ id: userId }, this.secret, { expiresIn: this.expiration });
    }

    async verifyToken(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secret, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });
    }
}
