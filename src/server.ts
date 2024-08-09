import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routes';
import { errorHandler } from './middleware';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', router);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});