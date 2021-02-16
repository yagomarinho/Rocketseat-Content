import express from 'express';
import routes from './routes';

const port = process.env.PORT || 3333;
const app = express();

app.use(express.json());
app.use(routes);

app.get('/', (request, response) => response.json({ message: 'Hello World!' }));

app.listen(port, () => {
  console.log(`Server Started at Port ${port}`);
});
