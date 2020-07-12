import express from 'express';

const PORT: number = 3001;
const app: express.Application = express();

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
