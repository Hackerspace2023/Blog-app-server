import express from 'express';
import connectDB from './Utils/db.js';
import dotenv from 'dotenv';

dotenv.config();

//importing routea
import userRoutes from './Routes/userRoutes.js';

const app = express();

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

app.use(express.json());
app.use('/api/users', userRoutes);