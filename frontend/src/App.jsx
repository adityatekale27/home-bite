import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import RegisterPage from "./pages/Register";
import OrdersPage from "./pages/Orders";
import MyMenuPage from "./pages/MyMenu";
import ChefAccountSettings from "./pages/Accounts";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* This line ensures DashboardPage is rendered when navigating to /chef-dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/Mymenu" element={<MyMenuPage />} />
        <Route path="/accounts" element={<ChefAccountSettings />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
