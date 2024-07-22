import { loginUser } from '../../controllers/auth/login.controller';
import express from 'express';
import RateLimiter from '../../middlewares/rate-limiter.middleware';

const router = express.Router();

// 5 requests per minutes based on IP address
const limiter = new RateLimiter(6, 1 * 60 * 1000);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User Login
 *     description: Allows users to log in to their account using email and password. Supports two-factor authentication and returns a JSON Web Token (JWT). Restricted to 5 requests per minute based on IP.
 *     tags: [Credentials Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 example: "userpassword"
 *                 description: The user's password.
 *               code:
 *                 type: string
 *                 example: "123456"
 *                 description: The two-factor authentication code (if enabled).
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                       description: The user's email address.
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                       description: The user's name.
 *                     role:
 *                       type: string
 *                       example: "user"
 *                       description: The user's role.
 *                     image:
 *                       type: string
 *                       example: "https://example.com/image.jpg"
 *                       description: The URL to the user's profile image.
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *                   description: The JSON Web Token for the authenticated user.
 *       400:
 *         description: Bad Request. Validation errors or missing parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request parameters."
 *       401:
 *         description: Unauthorized. Incorrect password or invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Incorrect password"
 *       404:
 *         description: Not Found. User does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User does not exist"
 *       409:
 *         description: Conflict. Email is in use with another provider.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is in use with another provider"
 *       500:
 *         description: Internal Server Error. Something went wrong.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 */

router.post('/login', (req, res, next) => limiter.apply(req, res, next), loginUser);

export default router;