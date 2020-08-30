import express from 'express';
import cors from "cors"
import calenderRouter from './routes/calender';
// rest of the code remains same
const app = express();
const PORT = 8000;

app.use(cors());
app.use('/api/calender', calenderRouter);


app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
