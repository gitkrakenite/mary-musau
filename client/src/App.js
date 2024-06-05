import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Saved from "./pages/Saved";
import Create from "./pages/Create";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpecificIssue from "./pages/SpecificIssue";
import Account from "./pages/Account";
import EditIssue from "./pages/EditIssue";
import Notifications from "./pages/Notifications";
import Resolved from "./pages/Resolved";

function App() {
  return (
    <div className="bg-zinc-200 text-pink-600 min-h-[100vh]">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/new-issue" element={<Create />} />
          <Route path="/issue/:id" element={<SpecificIssue />} />
          <Route path="/edit-issue/:id" element={<EditIssue />} />
          <Route path="/account" element={<Account />} />
          <Route path="/resolved" element={<Resolved />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
