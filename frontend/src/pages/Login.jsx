import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "../index.css"; // Assuming you have a login.css for custom styles

// Simple Modal Component (replaces alert)
const Modal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Login Status</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <button onClick={onClose} className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
          OK
        </button>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [modalMessage, setModalMessage] = useState(""); // State for modal message
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogin = (event) => {
    event.preventDefault();
    const selectedRole = role;

    // Simulate authentication logic
    // In a real application, you would send credentials to a backend
    // and handle the response (success/failure).
    if (email && password) {
      // Basic check for non-empty fields
      setModalMessage(`Login successful as ${selectedRole}. Redirecting...`);
      setTimeout(() => {
        setModalMessage(""); // Clear message after a short delay
        if (selectedRole === "chef") {
          navigate("/dashboard"); // Navigate to chef dashboard
        } else {
          navigate("/userdashboard"); // Navigate to user dashboard or general home
        }
      }, 1500); // Give user a moment to read the message
    } else {
      setModalMessage("Please enter both email and password.");
    }
  };

  const closeModal = () => {
    setModalMessage("");
  };

  return (
    <div className="bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center min-h-screen font-sans">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border-t-4 border-green-600">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-green-700">Welcome Back</h2>
          <p className="text-gray-500 mt-2 text-sm">Log in to access your HomeCooked dashboard</p>
        </div>
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Login As
            </label>
            <select
              id="role"
              name="role"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={role}
              onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="chef">Chef</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
            Log In
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-5">
          Don't have an account?
          <Link to="/register" className="text-green-600 font-semibold hover:underline">
            Sign up here
          </Link>
        </p>
      </div>

      {/* Custom Modal */}
      <Modal message={modalMessage} onClose={closeModal} />
    </div>
  );
};

export default LoginPage;
