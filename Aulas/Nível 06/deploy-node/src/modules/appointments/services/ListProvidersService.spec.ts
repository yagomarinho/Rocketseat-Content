import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/fakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'user 1',
      email: 'meu@email.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'user 2',
      email: 'seu@email.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'user 3',
      email: 'teu@email.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
