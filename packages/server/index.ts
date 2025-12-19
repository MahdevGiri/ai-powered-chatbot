import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z, { set } from 'zod';
import { conversationRepository } from './repositories/converstaion.respository';

// Load environment variables from .env file
dotenv.config();

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

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

      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         input: prompt,
         //temperature: 0.2,
         max_output_tokens: 150,
         previous_response_id:
            conversationRepository.getLastResponseId(conversationId),
      });

      conversationRepository.setLastResponseId(conversationId, response.id);

      res.json({ message: response.output_text }); // output_text is the field that contains the generated text for openai responses
   } catch (error) {
      res.status(500).json({ error: 'Failed to generate a response.' });
   }
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
