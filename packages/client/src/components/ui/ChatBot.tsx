import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa';
import { useRef } from 'react';

type FormData = {
   promptInput: string;
};

const ChatBot = () => {
   const guidConversationId = useRef(crypto.randomUUID()); // create a ref to hold a unique conversation ID (could have use stateHook if needed to change it later)
   const { register, handleSubmit, reset, formState } = useForm<FormData>(); // destructure the useForm hook to get register, handleSubmit, reset, and formState objects

   const onSubmitCustom = async (data: FormData) => {
      reset(); // reset the form after submission

      const response = await axios.post('/api/chat', {
         prompt: data.promptInput,
         conversationId: guidConversationId.current,
      }); // send a POST request to the /api/chat endpoint with the form data

      console.log('Form submitted:', response.data);
   };

   const onKeyDownCustom = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmitCustom)(); // invoke handleSubmit immediately to trigger form submission when Enter key is pressed
      }
   };

   return (
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
         <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
            <FaArrowUp />
         </Button>
      </form>
   );
};

export default ChatBot;
