import { getCustomRepository, getRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);

    const balance = await transactionsRepository.getBalance();
    if (type === 'outcome' && value > balance.total) {
      throw new AppError('This Transactions Was Denied');
    }
    const categoryFinded = await categoriesRepository.findOne({
      where: { title: category },
    });
    let category_id = '';
    if (categoryFinded) {
      category_id = categoryFinded.id;
    } else {
      const newCategory = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(newCategory);

      category_id = newCategory.id;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
