import express from 'express';
import indexRouter from './routes/index.route';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/v1",indexRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});