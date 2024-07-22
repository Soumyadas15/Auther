import express from 'express';
import { protectedRoute } from '../../controllers/test/protected.controller';
import { authenticateJWT } from '../../middlewares/auth/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /test/protected:
 *   get:
 *     summary: Protected route
 *     description: Access a protected route with a valid JWT token.
 *     tags: 
 *       - Test
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: 'Bearer token for authorization'
 *         schema:
 *           type: string
 *           example: 'Bearer your_token_here'
 *     responses:
 *       200:
 *         description: Access granted to the protected route.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: This is a protected route
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     name:
 *                       type: string
 *                       example: User Name
 *                     role:
 *                       type: string
 *                       example: user
 *       403:
 *         description: Forbidden. Invalid or missing token.
 */
router.get('/protected', authenticateJWT, protectedRoute);

export default router;