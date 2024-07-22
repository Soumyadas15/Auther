import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import { swaggerUi, swaggerDocs } from './docs/swagger';
import passport from "passport";
import session from "express-session";
import helmet from 'helmet';

import router from './router'
import { GitHubAuthService } from './api/services/auth/oauth/github/github.ouath.service';
import { GoogleAuthService } from './api/services/auth/oauth/google/google.oauth.service';
import { FacebookAuthService } from './api/services/auth/oauth/facebook/facebook.oauth.service';

class App {
    public app: express.Application;
    private gitHubAuthService: GitHubAuthService;
    private googleAuthService: GoogleAuthService;
    private facebookAuthService: FacebookAuthService;

    constructor() {
        this.app = express();
        this.gitHubAuthService = new GitHubAuthService();
        this.googleAuthService = new GoogleAuthService();
        this.facebookAuthService = new FacebookAuthService();
        this.configureMiddleware();
        this.configureRoutes();
    }

    private configureMiddleware() {
        this.app.use(cors({ credentials: true }));
        this.app.use(compression());
        this.app.use(session({
            secret: 'your_secret_key',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                maxAge: 24 * 60 * 60 * 1000
            }
        }));
        this.app.use(cookieParser());
        this.app.use(bodyParser.json());
        this.app.use(passport.initialize());
        this.app.use(passport.session()); 
    }
    

    private configureRoutes() {
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
        this.app.use('/api', router);
    }
}

export default new App().app;