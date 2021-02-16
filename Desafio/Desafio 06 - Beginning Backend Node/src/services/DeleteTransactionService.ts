import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction ID not found!');
    }
    await transactionsRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id: transaction.id })
      .execute();
  }
}

export default DeleteTransactionService;
