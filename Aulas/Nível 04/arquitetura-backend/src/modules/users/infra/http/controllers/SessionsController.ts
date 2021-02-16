import { Request, Response } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import { container } from 'tsyringe';

import IUpdatedUser from '@modules/users/dtos/UpdateUsersDTO';

export default class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    const updateUser: IUpdatedUser = { ...user };

    delete updateUser.password;

    return response.json({ user: updateUser, token });
  }
}
