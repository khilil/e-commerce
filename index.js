import dotenv from 'dotenv'
import {connectDB} from "./src/db/dbConnection.js"
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log('MongoDB connect FILED : ', error);
    })