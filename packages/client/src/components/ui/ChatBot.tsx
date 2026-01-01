import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa';
import { useRef, useState } from 'react';

type FormData = {
   promptInput: string;
};

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<string[]>([]); // state hook to hold chat messages
   const guidConversationId = useRef(crypto.randomUUID()); // create a ref hook to hold a unique conversation ID (didn't use state hook becoz we don't want it to re-generate on every render)
   const { register, handleSubmit, reset, formState } = useForm<FormData>(); // destructure the useForm hook to get register, handleSubmit, reset, and formState objects

   const onSubmitCustom = async (data: FormData) => {
      setMessages((prev) => [...prev, data.promptInput]); // add the user's prompt to the messages state

      reset(); // reset the form input field

      const response = await axios.post<ChatResponse>('/api/chat', {
         prompt: data.promptInput,
         conversationId: guidConversationId.current,
      }); // send a POST request to the /api/chat endpoint with the form data

      setMessages((prev) => [...prev, response.data.message]); // update messages state with the response from the server
   };

   const onKeyDownCustom = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmitCustom)(); // invoke handleSubmit immediately to trigger form submission when Enter key is pressed
      }
   };

   return (
      <div>
         <div>
            {messages.map((message, index) => (
               <p key={index}>{message}</p>
            ))}
         </div>
         <form
            onSubmit={handleSubmit(onSubmitCustom)} // handleSubmit() returns a function that React will invoke on form submission with validated data
            onKeyDown={onKeyDownCustom}
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
