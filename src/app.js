import cors from 'cors';
import express from 'express';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/v1', routes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

app.use(errorHandler);

export default app;
