import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';

import { UserRepository } from '../../user/user.repository';
import { FacebookOauthHelper } from './facebook.oauth.helper';
import { JwtService } from '../../jwt/jwt.service';

dotenv.config();

const jwtService = new JwtService();
const userRepository = new UserRepository();
const facebookAuthHelper = new FacebookOauthHelper(userRepository, jwtService);

export class FacebookAuthService {
    private clientID: string;
    private clientSecret: string;
    private callbackURL: string;

    constructor() {
        this.clientID = process.env.FACEBOOK_CLIENT_ID as string;
        this.clientSecret = process.env.FACEBOOK_CLIENT_SECRET as string;
        this.callbackURL = process.env.FACEBOOK_CALLBACK_URL as string;

        this.initializeStrategy();
    }

    private initializeStrategy() {
        passport.serializeUser((user: any, done) => {
            done(null, user);
        });

        passport.deserializeUser((user: any, done) => {
            done(null, user);
        });

        passport.use(new FacebookStrategy({
            clientID: this.clientID,
            clientSecret: this.clientSecret,
            callbackURL: this.callbackURL,
            profileFields: ['id', 'displayName', 'photos', 'email', 'gender', 'name']
        }, this.verifyCallback));
    }

    private async verifyCallback(accessToken: string, refreshToken: string, profile: any, done: Function) {
        try {
            const user = await facebookAuthHelper.handleFacebookLogin(profile, accessToken);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
}

export default FacebookAuthService;
