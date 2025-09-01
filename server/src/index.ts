import app from './app';

const port = 3000;

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});