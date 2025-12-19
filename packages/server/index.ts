import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import z, { set } from 'zod';
import { chatService } from './services/chat.service';
import { Chat } from 'openai/resources';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send('Hello, World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello from the API!' });
});

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt cannot be empty')
      .max(1000, 'Prompt is too long (max 1000 characters)'),

   conversationId: z.string().uuid('Invalid conversation ID'),
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = chatSchema.safeParse(req.body);

   if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.format() });
   }

   try {
      //const prompt = req.body.prompt;
      //const conversationId = req.body.conversationId;
      const { prompt, conversationId } = req.body;

      const response = await chatService.sendMessage(prompt, conversationId);

      res.json({ message: response.message });
   } catch (error) {
      res.status(500).json({ error: 'Failed to generate a response.' });
   }
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
