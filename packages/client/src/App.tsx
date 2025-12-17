import { useEffect, useState } from "react"

function App() {
  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => {
        setResponse(data.message);
      });
  }, []);

  return <p className='font-bold p-4 text-3xl'>{response}</p>

}

export default App
