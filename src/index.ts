import express from 'express';
import cors from "cors"
import calenderRouter from './routes/calender';
import authRouter from './routes/auth';
import bodyParser from 'body-parser'

// rest of the code remains same
const app = express();
const PORT = 8000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


app.use('/api/calender', calenderRouter);
app.use('/authorization', authRouter);


app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
