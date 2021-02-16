import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'user 1',
      email: 'meu@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'user 2',
      email: 'meu 2@example.com',
    });

    expect(updatedUser.name).toBe('user 2');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'user 1',
      email: 'meu@email.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'user 2',
      email: 'meu2@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'user 2',
        email: 'meu@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'user 1',
      email: 'meu@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'user 1',
      email: 'meu@email.com',
      old_password: '123456',
      password: '212121',
    });

    expect(updatedUser.password).toBe('212121');
  });

  it('should not be able to update password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'user 1',
      email: 'meu@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'user 2',
        email: 'meu2@example.com',
        password: '212121',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'user 1',
      email: 'meu@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'user 2',
        email: 'meu2@example.com',
        old_password: 'different-old-password',
        password: '212121',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update profile from non existing user ', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existring-user-id',
        name: 'non',
        email: 'non@example.com',
        old_password: '111111',
        password: '222222',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
