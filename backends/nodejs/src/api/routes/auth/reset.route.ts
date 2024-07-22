import { resetEmail } from '../../controllers/auth/reset.controller';
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /auth/reset:
 *   post:
 *     summary: Request a password reset email
 *     description: Sends an email to reset password
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
 *                 format: email
 *                 description: The email address of the user requesting a password reset.
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reset email sent successfully."
 *       201:
 *         description: Verification code sent again
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Verification code resent."
 *       400:
 *         description: Bad request, invalid email format or missing email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to generate token."
 *       409:
 *         description: Conflict, user registered with a different provider
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User is registered with a different provider."
 *       404:
 *         description: Not found, user does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User does not exist."
 *       500:
 *         description: Internal server error, something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong."
 */
router.post('/reset', resetEmail);

export default router;