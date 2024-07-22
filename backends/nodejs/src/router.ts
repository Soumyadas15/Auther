import { Router } from "express";

import registerRoute from "./api/routes/auth/register.route"
import newVerificationRoute from "./api/routes/auth/new-verification.route"
import loginRoute from "./api/routes/auth/login.route"
import resetRoute from "./api/routes/auth/reset.route"
import resetPassword from "./api/routes/auth/new-password.route"

import githubRoute from "./api/routes/auth/oauth/github.route"
import googleRoute from "./api/routes/auth/oauth/google.route"
import facebookRoute from "./api/routes/auth/oauth/facebook.route"

import getAllUsers from './api/routes/admin/get-users.route'

const router = Router();

const authRoute = '/auth';
const adminRoute = '/admin';

//Auth routes
router.use(authRoute, registerRoute);
router.use(authRoute, newVerificationRoute);
router.use(authRoute, loginRoute);
router.use(authRoute, resetRoute);
router.use(authRoute, resetPassword);

//Oauth routes
router.use(authRoute, githubRoute);
router.use(authRoute, googleRoute);
router.use(authRoute, facebookRoute);

//Admin routes
router.use(adminRoute, getAllUsers);

export default router;