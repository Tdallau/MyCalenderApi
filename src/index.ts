import express from 'express';
// import cors from "cors"
import calenderRouter from './routes/calender';
import authRouter from './routes/auth';
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload';

// rest of the code remains same
const app = express();
const PORT = 8000;

app.use(function (req, res, next) {
  const allowedOrigins = ['http://localhost:4200', 'https://calenders.dallau.com', 'https://kalenders.dallau.com'];
  // Website you wish to allow to connect
  const origin = req.headers.origin as string;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, authorization');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // @ts-ignore
  // res.setHeader('Access-Control-Allow-Credentials', true);
  // console.log(res.getHeaders())

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));


app.use('/api/calender', calenderRouter);
app.use('/authorization', authRouter);


app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
