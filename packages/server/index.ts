import express from 'express';
import dotenv from 'dotenv';
import router from './routes';

// Load environment variables from .env file
dotenv.config();

const app = express(); // Create Express app instance
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(router); // Use the defined routes

const port = process.env.PORT || 3000;

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
