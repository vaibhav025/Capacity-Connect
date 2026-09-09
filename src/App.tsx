import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "./components/layout/Shell";
import { Login } from "./pages/Login";
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/*" element={<Shell role="admin" />} />
      <Route path="/trainer/*" element={<Shell role="trainer" />} />
      <Route path="/trainee/*" element={<Shell role="trainee" />} />
    </Routes>
  );
}
