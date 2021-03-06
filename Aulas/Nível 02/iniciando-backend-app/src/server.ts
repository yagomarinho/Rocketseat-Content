import 'reflect-metadata';

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import 'express-async-errors';
import routes from './routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

import './database';

const port = process.env.PORT || 3333;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/file', express.static(uploadConfig.directory));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`Server Started at Port ${port}`);
});
