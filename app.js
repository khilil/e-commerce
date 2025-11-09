import express from 'express';
import userRouter from './src/router/user.route.js';
import cookieParser from 'cookie-parser';
import productRouter from './src/router/product.route.js'
import categoryRouter from './src/router/category.route.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser())
app.use("/uploads", express.static("public/uploads"));


app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', productRouter);
app.use("/api/v1/category", categoryRouter);


export { app };