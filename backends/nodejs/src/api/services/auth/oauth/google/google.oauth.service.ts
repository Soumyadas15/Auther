import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import dotenv from 'dotenv';


import { UserRepository } from '../../user/user.repository';
import { GoogleAuthHelper } from './google.oauth.helper';
import { JwtService } from '../../jwt/jwt.service';

dotenv.config();

const jwtService = new JwtService();
const userRepository = new UserRepository();
const googleAuthHelper = new GoogleAuthHelper(userRepository, jwtService);

export class GoogleAuthService {
    private clientID: string;
    private clientSecret: string;
    private callbackURL: string;

    constructor() {
        this.clientID = process.env.GOOGLE_CLIENT_ID as string;
        this.clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
        this.callbackURL = process.env.GOOGLE_CALLBACK_URL as string;

        this.initializeStrategy();
    }

    private initializeStrategy() {
        passport.serializeUser((user: any, done) => {
            done(null, user);
        });

        passport.deserializeUser((user: any, done) => {
            done(null, user);
        });

        passport.use(new GoogleStrategy({
            clientID: this.clientID,
            clientSecret: this.clientSecret,
            callbackURL: this.callbackURL,
        }, this.verifyCallback));
    }

    private async verifyCallback(accessToken: string, refreshToken: string, profile: any, done: Function) {
        try {
            const user = await googleAuthHelper.handleGoogleLogin(profile, accessToken);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
}

export default GoogleAuthService;
