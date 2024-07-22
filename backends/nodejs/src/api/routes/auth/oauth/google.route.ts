import express from 'express';
import passport from 'passport';
import { Router, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * @swagger
 * /auth/login/google:
 *   get:
 *     summary: Initiates Google authentication
 *     tags: [OAuth]
 *     description: |
 *       This endpoint initiates the OAuth flow by redirecting the user to Google for authentication. 
 *       Users will be prompted to log in and authorize access to their email and profile information.
 *     produces:
 *       - application/json
 *     parameters: []
 *     responses:
 *       200:
 *         description: Redirects to Google for authentication
 *         schema:
 *           type: string
 *           example: Redirecting to Google...
 *       302:
 *         description: Redirecting to Google for authentication
 *         headers:
 *           Location:
 *             type: string
 *             example: "https://accounts.google.com/o/oauth2/auth?scope=email%20profile&...&response_type=code"
 */
router.get('/login/google', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
});

/**
 * @swagger
 * /auth/callback/google:
 *   get:
 *     summary: Google callback URL
 *     tags: [OAuth]
 *     description: |
 *       This endpoint is called by Google after the user has authenticated. 
 *       It processes the authentication response, retrieves the user information, 
 *       and sets cookies for the current user and JWT tokens.
 *     produces:
 *       - application/json
 *     parameters: []
 *     responses:
 *       302:
 *         description: Redirects after successful authentication
 *         headers:
 *           Location:
 *             type: string
 *             example: "https://yourfrontendurl.com/home"
 *       401:
 *         description: Unknown Error
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: "OAuthAccountNotLinked"
 */
router.get('/callback/google', 
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { 
        failureRedirect: '/auth/error?message=Authentication Failed' 
    })(req, res, (err: any) => {
      if (err) {
        return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=OAuthAccountNotLinked`);
      }
      next();
    });
  },
  (req: Request, res: Response) => {
    //@ts-ignore
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=OAuthAccountNotLinked`);
    }
    //@ts-ignore
    res.cookie('currentUserToken', JSON.stringify(req.user.user), { httpOnly: true });
    //@ts-ignore
    res.cookie('jwtToken', req.user.token, { httpOnly: true });
    res.redirect(`${process.env.FRONTEND_URL}/home`);
  }
);

/**
 * @swagger
 * /auth/error:
 *   get:
 *     summary: Handles authentication errors
 *     tags: [OAuth]
 *     description: |
 *       This endpoint handles any authentication errors that occur during the OAuth process. 
 *       It redirects the user to the login page with an error message.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: message
 *         in: query
 *         description: Error message to display
 *         required: false
 *         type: string
 *         example: "Authentication Failed"
 *     responses:
 *       200:
 *         description: Returns an error message
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Authentication Failed"
 */
router.get(`/error`, (req: Request, res: Response) => {
    const message = (req.query.message as string) || 'Unknown Error';
    res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=${encodeURIComponent(message)}`);
});

export default router;