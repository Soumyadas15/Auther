import express from 'express';

import { newPassword } from '../../controllers/auth/new-password.controller';


const router = express.Router();

/**
 * @swagger
 * /auth/new-password:
 *   post:
 *     summary: Reset Password
 *     description: Allows a user to reset their password using a valid password reset token and a new password. The token must be sent as a query parameter.
 *     tags: [Credentials Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: The new password the user wants to set. It must meet the required complexity.
 *             example:
 *               password: "securePassword123"
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         description: The password reset token received by the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       201:
 *         description: Verification code sent again
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Verification code sent again"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password is missing"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid token"
 *       404:
 *         description: User does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User does not exist"
 *       500:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 *     security:
 *       - apiKey: []
 *     deprecated: false
 */
router.post('/new-password', newPassword);

export default router;
