import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';

export class PassportConfig {
//   private userService: UserService;

  constructor() {
    // this.userService = new UserService();
    this.initialize();
  }

  private initialize() {
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: '/auth/github/callback',
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      try {
        // const user = await this.userService.findOrCreateUser(profile);
        done(null, null);
      } catch (err) {
        done(err);
      }
    }));

    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
    //   const user = await this.userService.findUserById(id);
      done(null, null);
    });
  }
}
