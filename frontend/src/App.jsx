import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import TasksDashboard from "./components/TasksDashboard";

function App() {
  const isAuthenticated = () => {
    // Simple check: you can call a backend endpoint to verify JWT
    return localStorage.getItem("authenticated") === "true";
  };

  return (
    // <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/tasks"
          element={isAuthenticated() ? <TasksDashboard /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    // </Router>
  );
}

export default App;
