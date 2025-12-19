import OpenAI from 'openai';
import { conversationRepository } from '../repositories/converstaion.respository';

// Implementation detail: OpenAI client setup
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

type ChatResponse = {
   id: string;
   message: string;
};

// Export public interface for chat service
export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         input: prompt,
         //temperature: 0.2,
         max_output_tokens: 150,
         previous_response_id:
            conversationRepository.getLastResponseId(conversationId),
      });

      conversationRepository.setLastResponseId(conversationId, response.id);

      return {
         id: response.id,
         message: response.output_text, // output_text is the field that contains the generated text for openai responses
      };
   },
};
