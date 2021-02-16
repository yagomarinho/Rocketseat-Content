import { Request, Response } from 'express';
import CreateUserService from '@modules/users/services/CreateUserService';
import { container } from 'tsyringe';

import IUpdatedUser from '@modules/users/dtos/UpdateUsersDTO';

export default class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password } = request.body;

      const createUser = container.resolve(CreateUserService);

      const user = await createUser.execute({
        name,
        email,
        password,
      });

      const updateUser: IUpdatedUser = { ...user };

      delete updateUser.password;

      return response.json(updateUser);
    } catch (e) {
      return response.status(400).json({ error: e.message });
    }
  }
}
