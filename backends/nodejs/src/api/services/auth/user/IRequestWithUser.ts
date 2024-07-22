import { User } from '@prisma/client';
import { Request } from 'express';

interface IRequestWithUser extends Request {
  user: User;
}

export default IRequestWithUser;