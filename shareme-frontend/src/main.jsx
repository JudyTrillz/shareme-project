import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* CHANGE CLIENT ID TO .env */}
    <GoogleOAuthProvider clientId={process.env.REACT_APP_SHAREME_CLIENT_ID}>
      <Router>
        <Routes>
          <Route
            path="*"
            element={<App />}
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
