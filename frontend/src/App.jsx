import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AdminAllAds } from "./pages/AdminAllAds";
import { AdminAllUser } from "./pages/AdminAllUser";
import { AddAd } from "./pages/AddAd";
import { MyLikedAds } from "./pages/MyLikedAds";
import { Dashboard } from "./pages/Dashboard";
import { MyPostedAds } from "./pages/MyPostedAds";
import { HomePage } from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";

import "./app.css";

function App() {
  return (
    <div className="app-container">
      <Router>
        <Navigation />
        <div className="main-content">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/all-ads" element={<AdminAllAds />} />
            <Route path="/admin/all-users" element={<AdminAllUser />} />
            <Route path="/add-ad" element={<AddAd />} />
            <Route path="/my-liked-ads?" element={<MyLikedAds />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-posted-ads" element={<MyPostedAds />} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
      <Footer />
    </div>
  );
}

export default App;
