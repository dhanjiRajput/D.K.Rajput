import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.send('Hello TypeScript + Node.js!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});