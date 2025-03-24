import express from 'express';
import cors from 'cors';
import "dotenv/config"

import connectDB from './config/mongodb.js';
import userRouter from './routes/user.routes.js';
import imageRouter from './routes/image.routes.js';

const PORT = process.env.PORT || 4000
const app = express();
await connectDB();

app.use(express.json());
app.use(cors());

app.use("/user", userRouter)
app.use("/image", imageRouter)
app.get('/', (req, res) => {
  res.send('Api woking well!!!');
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})