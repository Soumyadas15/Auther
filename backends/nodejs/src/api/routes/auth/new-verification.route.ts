import { newVerification } from '../../controllers/auth/verification.controller';
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /auth/new-verification:
 *   post:
 *     summary: Verify user email with OTP
 *     description: Verifies a token sent by the register route.
 *     tags: [Credentials Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The verification code sent to the user's email
 *             required:
 *               - code
 *     responses:
 *       '200':
 *         description: Successfully verified the email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully verified
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid token
 *       '401':
 *         description: Unauthorized (token expired)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid token
 *       '404':
 *         description: Not found (user or token not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email does not exist
 *       '409':
 *         description: Conflict (custom application error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Custom error message
 */
router.post('/new-verification', newVerification);

export default router;