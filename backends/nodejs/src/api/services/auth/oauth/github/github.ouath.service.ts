import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';

import { UserRepository } from '../../user/user.repository';
import { GitHubAuthHelper } from './github.oauth.helper';
import { JwtService } from '../../jwt/jwt.service';

dotenv.config();

const jwtService = new JwtService();
const userRepository = new UserRepository();
const gitHubAuthHelper = new GitHubAuthHelper(userRepository, jwtService);

export class GitHubAuthService {
    private clientID: string;
    private clientSecret: string;
    private callbackURL: string;

    constructor() {
        this.clientID = process.env.GITHUB_CLIENT_ID as string;
        this.clientSecret = process.env.GITHUB_CLIENT_SECRET as string;
        this.callbackURL = process.env.GITHUB_CALLBACK_URL as string;

        this.initializeStrategy();
    }

    private initializeStrategy() {
        passport.serializeUser((user: any, done) => {
            done(null, user);
        });

        passport.deserializeUser((user: any, done) => {
            done(null, user);
        });

        passport.use(new GitHubStrategy({
            clientID: this.clientID,
            clientSecret: this.clientSecret,
            callbackURL: this.callbackURL,
        }, this.verifyCallback));
    }

    private async verifyCallback(accessToken: string, refreshToken: string, profile: any, done: Function) {
        try {
            const user = await gitHubAuthHelper.handleGitHubLogin(profile, accessToken);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
}

export default GitHubAuthService;
