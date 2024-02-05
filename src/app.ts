import express, { Express, Request, Response , Application } from 'express';
import morgan from "morgan";
import 'dotenv/config';

import userRouter from "./router/user.js"
import guildRouter from "./router/guild.js"
import {TspecDocsMiddleware} from "tspec";

const app: Application =  express();
const port =  process.env.PORT;

app.use(morgan("dev"));
app.use(express.json());

app.use('/users', userRouter);
app.use('/guilds', guildRouter);
app.use('/docs', await TspecDocsMiddleware());

app.get('/', (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});