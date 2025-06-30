// src/RegisterPage.jsx
import { useState, useEffect } from "react";
import "../index.css";
import { Link } from "react-router-dom"; // Corrected: Removed extra space

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("Fetching location...");

  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setLocation(`Lat: ${lat.toFixed(3)}, Lon: ${lon.toFixed(3)}`);
          },
          (error) => {
            console.error("Error fetching location:", error);
            setLocation("Unable to fetch location");
          },
          {
            timeout: 10000,
            enableHighAccuracy: true,
            maximumAge: 0,
          }
        );
      } else {
        setLocation("Geolocation not supported");
      }
    };

    fetchLocation();
  }, []);

  const handleRegister = (event) => {
    event.preventDefault();
    console.log("Registering with:", { fullName, email, password, location });
    alert("Account created successfully!");
  };

  return (
    <div className="bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center min-h-screen">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-green-600">
        <div className="text-center mb-6">
          <img src="https://img.icons8.com/fluency/96/meal.png" alt="meal icon" className="mx-auto mb-2" />
          <h2 className="text-3xl font-bold text-green-700">Sign Up to HomeCooked</h2>
          <p className="text-gray-500 mt-2 text-sm">Fresh meals made with love by home chefs</p>
        </div>
        <form className="space-y-5" onSubmit={handleRegister}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="flex items-center border rounded-lg px-3">
              <i className="bi bi-person text-gray-400 mr-2"></i>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full py-2 focus:outline-none"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="flex items-center border rounded-lg px-3">
              <i className="bi bi-envelope text-gray-400 mr-2"></i>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full py-2 focus:outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center border rounded-lg px-3">
              <i className="bi bi-lock text-gray-400 mr-2"></i>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full py-2 focus:outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <div className="flex items-center border rounded-lg px-3">
              <i className="bi bi-geo-alt text-gray-400 mr-2"></i>
              <input type="text" id="location" name="location" required className="w-full py-2 focus:outline-none" placeholder="Fetching location..." readOnly value={location} />
            </div>
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?
          <Link to="/login" className="text-green-600 font-semibold hover:underline ml-1">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
