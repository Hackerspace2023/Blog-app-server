import express from 'express';
import connectDB from './Utils/db.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//importing routea
import userRoutes from './Routes/userRoutes.js';
import blogRoutes from './Routes/blogRoutes.js';
import uploadRoutes from './Routes/uploadRoutes.js';

const PORT = process.env.PORT || 8000;

connectDB()
.then(()=>{
    app.listen(PORT , ()=>{
        console.log('Server is running on port ', PORT);
        
    })
})
.catch((error)=>{
    console.log('Connection failed',error);
})

app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));