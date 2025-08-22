import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState("login");

  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) {
    return page === "login" ? (
      <Login onLogin={() => window.location.reload()} />
    ) : (
      <Register onRegister={() => setPage("login")} />
    );
  }

  return <Dashboard />;
}
