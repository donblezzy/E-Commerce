import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import productRoutes from './routes/products.js'
import authRoutes from './routes/auth.js'
import orderRoutes from './routes/order.js'
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/error.js";


dotenv.config({ path: "backend/config/config.env" });
const app = express();
// Connecting Database
connectDatabase()

app.use(express.json())
app.use(cookieParser())

// Importing ProductRoutes
app.use('/api', productRoutes)
// Importing authRoutes
app.use('/api', authRoutes)
// Importing orderRoutes
app.use('/api', orderRoutes)

// Using error Middleware
app.use(errorMiddleware)

app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
     });




//Handle Unhandled Promise Rejection

// const server = app.listen(process.env.PORT, () => {
//     console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
// });

// process.on("unhandledRejection", (err) => {
//     console.log(`ERROR: ${err}`);
//     console.log(`Shutting down server due to unhandled Promise Rejection`);
//     server.close(() => {
//         process.exit(1)
//     })
// })

