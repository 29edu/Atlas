import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js';

const app = express();
app.use(cors())
app.use(express.json())
const PORT = 5082


// Connect to Mongodb
await connectDB();

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})


