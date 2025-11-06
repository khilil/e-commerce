import express from 'express';
import  userRouter  from './src/router/user.route.js';
import  adminRouter  from './src/router/admin/admin.route.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use(cookieParser())
 
app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', adminRouter);


export { app };