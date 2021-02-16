import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns'; //eslint-disable-line

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import Appointment from '../../infra/typeorm/entities/Appointment';

class AppointmentRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async create(data: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(
      appointment,
      {
        id: uuid(),
      },
      data,
    );

    this.appointments.push(appointment);

    return appointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id && // eslint-disable-line
        getMonth(appointment.date) + 1 === month && // eslint-disable-line
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id && // eslint-disable-line
        getDate(appointment.date) === day && // eslint-disable-line
        getMonth(appointment.date) + 1 === month && // eslint-disable-line
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppoiment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) && // eslint-disable-line
        appointment.provider_id === provider_id,
    );

    return findAppoiment;
  }
}

export default AppointmentRepository;
