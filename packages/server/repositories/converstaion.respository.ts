// Implementation detial: conversationId to lastResponseId mapping
const conversations = new Map<string, string>();

// Export public interface for conversation repository

export const conversationRepository = {
   getLastResponseId(conversationId: string): string | undefined {
      return conversations.get(conversationId);
   },

   setLastResponseId(conversationId: string, responseId: string): void {
      conversations.set(conversationId, responseId);
   },
};
