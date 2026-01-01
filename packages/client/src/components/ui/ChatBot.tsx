import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { set, useForm } from 'react-hook-form';
import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';

type FormData = {
   promptInput: string;
};

type ChatResponse = {
   message: string;
};

type Message = {
   content: string;
   role: 'user' | 'bot';
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]); // state to hold chat messages
   const [isBotTyping, setIsBotTyping] = useState(false); // state to indicate if the bot is typing
   const formRef = useRef<HTMLFormElement | null>(null); // create a ref hook to reference the form element
   const guidConversationId = useRef(crypto.randomUUID()); // create a ref hook to hold a unique conversation ID (didn't use state hook becoz we don't want it to re-generate on every render)
   const { register, handleSubmit, reset, formState } = useForm<FormData>(); // destructure the useForm hook to get register, handleSubmit, reset, and formState objects

   useEffect(() => {
      // scroll to bottom of chat messages when a new message is added to messages array
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
   }, [messages]);

   const onSubmitCustom = async (data: FormData) => {
      setMessages((prev) => [
         ...prev,
         { content: data.promptInput, role: 'user' },
      ]); // update messages state with the user input

      setIsBotTyping(true); // set bot typing state to true

      reset(); // reset the form input field

      const response = await axios.post<ChatResponse>('/api/chat', {
         prompt: data.promptInput,
         conversationId: guidConversationId.current,
      }); // send a POST request to the /api/chat endpoint with the form data

      setMessages((prev) => [
         ...prev,
         { content: response.data.message, role: 'bot' },
      ]); // update messages state with the response from the server

      setIsBotTyping(false); // set bot typing state to false
   };

   const onKeyDownCustom = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmitCustom)(); // invoke handleSubmit immediately to trigger form submission when Enter key is pressed
      }
   };

   return (
      <div>
         <div className="flex flex-col gap-2 mb-10">
            {messages.map((message, index) => (
               <p
                  key={index}
                  className={`px-3 py-1 rounded-xl ${
                     message.role === 'user'
                        ? 'bg-blue-600 text-white self-end'
                        : 'bg-gray-100 text-black self-start'
                  }`}
               >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
               </p>
            ))}
            {isBotTyping && (
               <div className="flex self-start gap-1 px-3 py-3 bg-gray-200 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
               </div>
            )}
         </div>
         <form
            onSubmit={handleSubmit(onSubmitCustom)} // handleSubmit() returns a function that React will invoke on form submission with validated data
            onKeyDown={onKeyDownCustom}
            ref={formRef}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         >
            <textarea
               {...register('promptInput', {
                  // spread the  register object to get all the props(properties) like onChange, onBlur, maxLength, & more
                  required: true,
                  validate: (value) => value.trim().length > 0,
               })}
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="Ask anything"
               maxLength={1000}
            />
            <Button
               disabled={!formState.isValid}
               className="rounded-full w-9 h-9"
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default ChatBot;
