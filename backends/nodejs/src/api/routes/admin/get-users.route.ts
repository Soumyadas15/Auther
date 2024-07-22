import express from 'express';


import { getAllUsers } from '../../controllers/admin/get-users.controller';
import { authenticateJWT } from '../../middlewares/auth/auth.middleware';


const router = express.Router();

router.get('/users', authenticateJWT, getAllUsers);

export default router;