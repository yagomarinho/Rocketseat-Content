import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/fakeCacheProvider';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 8, 24, 15).getTime());
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 8, 25, 8),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider');
  });

  it('should not be able to create two appointments on the same time', async () => {
    await createAppointment.execute({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 8, 25, 8),
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2020, 8, 25, 8),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments on a past date', async () => {
    await expect(
      createAppointment.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2020, 8, 23, 8),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments with same user as provider', async () => {
    await expect(
      createAppointment.execute({
        provider_id: 'user',
        user_id: 'user',
        date: new Date(2020, 8, 25, 8),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments before 8am and after 5pm', async () => {
    await expect(
      createAppointment.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2020, 8, 25, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2020, 8, 25, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
