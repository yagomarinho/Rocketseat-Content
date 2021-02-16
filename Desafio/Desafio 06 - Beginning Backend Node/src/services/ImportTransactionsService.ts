import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

async function loadCSV(filePath: string): Promise<CSVTransaction[]> {
  const readCSVStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: CSVTransaction[] = [];

  parseCSV.on('data', line => {
    const [title, type, value, category] = line.map((cell: string) =>
      cell.trim(),
    );
    if (!title || !type || !value) return;
    lines.push({ title, type, value, category });
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const data = await loadCSV(filePath);
    const transactions: Transaction[] = [];
    for await (const info of data) {
      const createTransaction = new CreateTransactionService();
      const transaction = await createTransaction.execute(info);
      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
