import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import useAuthStore from "./store/authStore";
import './App.css';
export default function App() {
  const auth = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/chat"
          element={auth.token ? <ChatPage /> : <Navigate to="/auth" />}
        />
        <Route path="*" element={<Navigate to={auth.token ? "/chat" : "/auth"} />} />
      </Routes>
    </Router>
  );
}
