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

  return <p>{response}</p>

}

export default App
