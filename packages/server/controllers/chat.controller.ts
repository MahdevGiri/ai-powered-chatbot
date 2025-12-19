import z from 'zod';
import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';

//Implementation detail
const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt cannot be empty')
      .max(1000, 'Prompt is too long (max 1000 characters)'),

   conversationId: z.string().uuid('Invalid conversation ID'),
});

// Export public interface for chat controller
export const chatController = {
   async sendMessage(req: Request, res: Response) {
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
   },
};
