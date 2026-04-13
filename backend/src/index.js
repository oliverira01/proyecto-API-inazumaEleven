import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import playersRouter from './routes/playersRoutes.js';
import teamsRouter from './routes/teamsRoutes.js';
import techniquesRouter from './routes/techniquesRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, '../../images')));

app.use('/sounds', express.static(path.join(__dirname, '../../sounds')));

app.use('/api/players', playersRouter);
app.use('/api/teams',   teamsRouter);
app.use('/api/techniques', techniquesRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});