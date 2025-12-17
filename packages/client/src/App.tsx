import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';

function App() {
   const [response, setResponse] = useState<string>('');

   useEffect(() => {
      fetch('/api/hello')
         .then((res) => res.json())
         .then((data) => {
            setResponse(data.message);
         });
   }, []);

   return (
      <div className="p-4">
         <p className="font-bold text-3xl">{response}</p>
         <Button>Click Me</Button>
      </div>
   );
}

export default App;
