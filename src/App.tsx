import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useFederatedComponent } from "./useFederatedComponent";
import { registerRemotes } from "@module-federation/runtime";
import { useLocation } from "react-router-dom";

registerRemotes([
  {
    name: "error_reports",
    entry: "http://localhost:3002/remoteEntry.js",
    type: "var",
  },
]);

function App() {
  const [count, setCount] = useState(0);
  const { pathname } = useLocation();

  const FederatedComponent = useFederatedComponent({
    scope: "error_reports",
    module: "App",
  });

  React.useEffect(() => {
    setCount((count) => count + 1);
  }, []);

  return (
    <>
      {FederatedComponent ? <FederatedComponent /> : null}
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => console.log("location", pathname)}>
          Click Me
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
