import { useState } from "react";
import Login from "./Login";
import Climbs from "./Climbs";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <div data-theme="emerald" className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-md px-6">
        <div className="flex-1">
          <span className="text-2xl font-bold">🧗 Climb Logger</span>
        </div>

        {token && (
          <button
            className="btn btn-sm btn-outline"
            onClick={() => {
              localStorage.removeItem("token");
              setToken(null);
            }}
          >
            Logout
          </button>
        )}
      </div>

      <div className="p-6">
        {!token ? (
          <Login setToken={setToken} />
        ) : (
          <Climbs token={token} />
        )}
      </div>
    </div>
  );
}

export default App;
