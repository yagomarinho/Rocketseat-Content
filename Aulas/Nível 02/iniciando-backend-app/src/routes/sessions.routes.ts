import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const SessionsRouter = Router();

interface UpdatedUser {
  id: string;
  name: string;
  password?: string;
  avatar: string;
  created_at: Date;
  updated_at: Date;
}

SessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const authenticateUser = new AuthenticateUserService();

  const { user, token } = await authenticateUser.execute({
    email,
    password,
  });

  const updateUser: UpdatedUser = { ...user };

  delete updateUser.password;

  return response.json({ user: updateUser, token });
});

export default SessionsRouter;
