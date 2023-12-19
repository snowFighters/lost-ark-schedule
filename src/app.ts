import express, { Express, Request, Response , Application } from 'express';
import userRouter from "./router/user.js"
//For env File

const app: Application = express();
const port =  8080;

app.use('/user', userRouter);
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});


app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});