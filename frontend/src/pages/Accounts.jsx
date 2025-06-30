import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaHistory,
  FaCreditCard,
  FaMotorcycle,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaCashRegister,
  FaUtensils,
  FaCheckCircle,
  FaClock,
  FaPhoneAlt,
  FaPlusCircle,
} from "react-icons/fa";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// --- Custom Man with Bike Icon (SVG) ---
// Keeping this as a custom SVG. If you wanted to replace it with a react-icon,
// you'd typically choose FaMotorcycle or FaBicycle from 'react-icons/fa'.
const ManWithBikeIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M10 8h4v8" />
    <path d="M12 4v4" />
    <path d="M12 16v4" />
    <path d="M16 12h4" />
    <path d="M4 12h4" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 15v3" />
    <path d="M12 9v-3" />
    <path d="M15 12h3" />
    <path d="M9 12h-3" />
  </svg>
);

// Define map container style and default center for Agra, India
const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 27.1767, // Agra Latitude
  lng: 78.0078, // Agra Longitude
};

// **IMPORTANT**: Replace 'YOUR_Maps_API_KEY' with your actual API key
// Make sure your API key has the Maps JavaScript API enabled.
const Maps_API_KEY = "YOUR_Maps_API_KEY";

// --- Chef Profile Settings Component ---
const ChefProfileSettings = () => (
  <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
    <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
      <FaUser className="inline-block mr-3 text-indigo-600" />
      Chef Profile
    </h3>
    <form className="space-y-5 flex-grow">
      <div>
        <label htmlFor="chefName" className="block text-sm font-medium text-gray-700">
          Chef Full Name
        </label>
        <input
          type="text"
          id="chefName"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Chef Gordon Ramsay"
        />
      </div>
      <div>
        <label htmlFor="chefEmail" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="chefEmail"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="chef.ramsay@example.com"
        />
      </div>
      <div>
        <label htmlFor="chefPhone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="chefPhone"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="+91 98765 43210"
        />
      </div>
      <div>
        <label htmlFor="chefRestaurant" className="block text-sm font-medium text-gray-700">
          Restaurant Name
        </label>
        <input
          type="text"
          id="chefRestaurant"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="The Fiery Fork"
        />
      </div>
      <div className="pt-4">
        <button
          type="submit"
          className="w-full py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
          Save Chef Profile
        </button>
      </div>
    </form>
  </div>
);

// --- Order Management Component ---
const ChefOrderManagement = () => {
  // Dummy data for orders
  const [orders, setOrders] = useState([
    {
      id: "12345",
      date: "June 1, 2025",
      status: "Delivered",
      payment: "Prepaid",
      deliveryType: "Home Delivery",
      assignedDeliveryMan: "Rajesh",
      deliveryManLocation: { lat: 27.185, lng: 78.015 },
    },
    { id: "12344", date: "May 28, 2025", status: "Pending", payment: "Cash on Delivery", deliveryType: "Take Away", assignedDeliveryMan: null, deliveryManLocation: null },
    { id: "12343", date: "May 25, 2025", status: "Cancelled", payment: "Prepaid", deliveryType: "Home Delivery", assignedDeliveryMan: "Amit", deliveryManLocation: null },
    { id: "12342", date: "May 20, 2025", status: "Delivered", payment: "Prepaid", deliveryType: "Take Away", assignedDeliveryMan: null, deliveryManLocation: null },
    { id: "12341", date: "May 19, 2025", status: "Pending", payment: "Prepaid", deliveryType: "Home Delivery", assignedDeliveryMan: null, deliveryManLocation: null },
  ]);

  // Dummy data for delivery persons
  const deliveryPersons = [
    { id: "dp1", name: "Rajesh Kumar", phone: "+91 99887 76655", location: { lat: 27.19, lng: 78.02 } },
    { id: "dp2", name: "Priya Sharma", phone: "+91 99112 23344", location: { lat: 27.17, lng: 77.99 } },
    { id: "dp3", name: "Sanjay Singh", phone: "+91 98765 12345", location: { lat: 27.16, lng: 78.03 } },
  ];

  const assignDeliveryMan = (orderId, dpId) => {
    const selectedDeliveryMan = deliveryPersons.find((dp) => dp.id === dpId);
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              assignedDeliveryMan: selectedDeliveryMan ? selectedDeliveryMan.name : null,
              deliveryManLocation: selectedDeliveryMan ? selectedDeliveryMan.location : null,
            }
          : order
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        <FaHistory className="inline-block mr-3 text-indigo-600" />
        Order Management
      </h3>
      <ul className="divide-y divide-gray-200 flex-grow overflow-y-auto custom-scrollbar">
        {" "}
        {/* Added custom-scrollbar class */}
        {orders.map((order) => (
          <li key={order.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="font-medium text-lg">Order #{order.id}</p>
              <p className="text-sm text-gray-600">
                {order.date} -
                <span className={`font-semibold ml-1 ${order.status === "Delivered" ? "text-green-600" : order.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>
                  {order.status}
                </span>
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                {order.payment === "Prepaid" ? <FaCreditCard className="mr-1 text-gray-500" /> : <FaCashRegister className="mr-1 text-gray-500" />}
                {order.payment}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                {order.deliveryType === "Home Delivery" ? <FaMotorcycle className="mr-1 text-gray-500" /> : <FaUtensils className="mr-1 text-gray-500" />}
                {order.deliveryType}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mt-3 sm:mt-0">
              {order.deliveryType === "Home Delivery" && order.status === "Pending" && (
                <select
                  className="block w-full sm:w-48 border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={order.assignedDeliveryMan ? deliveryPersons.find((dp) => dp.name === order.assignedDeliveryMan)?.id : ""}
                  onChange={(e) => assignDeliveryMan(order.id, e.target.value)}>
                  <option value="">Assign Delivery Man</option>
                  {deliveryPersons.map((dp) => (
                    <option key={dp.id} value={dp.id}>
                      {dp.name}
                    </option>
                  ))}
                </select>
              )}
              {order.assignedDeliveryMan && (
                <span className="text-sm text-gray-700 flex items-center font-medium mt-2 sm:mt-0">
                  <ManWithBikeIcon className="h-5 w-5 mr-1 text-green-600" /> {order.assignedDeliveryMan}
                </span>
              )}
              {order.status === "Delivered" && <FaCheckCircle className="text-green-600 text-2xl mt-2 sm:mt-0" title="Delivered" />}
              {order.status === "Cancelled" && <FaClock className="text-red-600 text-2xl mt-2 sm:mt-0" title="Cancelled" />}
            </div>
          </li>
        ))}
      </ul>
      <div className="pt-4">
        <button className="w-full py-3 px-6 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
          Load More Orders
        </button>
      </div>
    </div>
  );
};

// --- Delivery Tracking Map Component ---
const DeliveryTrackingMap = () => {
  // Dummy data for delivery persons with their current (simulated) locations
  // In a real application, these locations would come from a real-time API
  const [deliveryPersonsLive, setDeliveryPersonsLive] = useState([
    { id: "dp1", name: "Rajesh Kumar", phone: "+91 99887 76655", location: { lat: 27.185, lng: 78.015 }, status: "Delivering Order #12345" },
    { id: "dp2", name: "Priya Sharma", phone: "+91 99112 23344", location: { lat: 27.17, lng: 77.995 }, status: "Available" },
    { id: "dp3", name: "Sanjay Singh", phone: "+91 98765 12345", location: { lat: 27.165, lng: 78.025 }, status: "On Break" },
  ]);

  // Simulate location updates (optional, for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveryPersonsLive((prev) =>
        prev.map((dp) => {
          // Simulate movement for Rajesh
          if (dp.id === "dp1") {
            return {
              ...dp,
              location: {
                lat: dp.location.lat + (Math.random() - 0.5) * 0.002, // Small random change
                lng: dp.location.lng + (Math.random() - 0.5) * 0.002,
              },
            };
          }
          return dp;
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        <FaMapMarkerAlt className="inline-block mr-3 text-indigo-600" />
        Live Delivery Tracking
      </h3>
      <div className="flex-grow rounded-lg overflow-hidden mb-4">
        {Maps_API_KEY === "YOUR_Maps_API_KEY" ? (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-600 text-center p-4 rounded-md">
            <FaExclamationTriangle className="text-yellow-600 text-3xl mr-3" />
            Please replace 'YOUR_Maps_API_KEY' with your actual API key to view the map.
          </div>
        ) : (
          <LoadScript googleMapsApiKey={Maps_API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={defaultCenter}
              zoom={13}
              options={{ disableDefaultUI: true, zoomControl: true }} // Basic UI controls
            >
              {deliveryPersonsLive.map((dp) => (
                <Marker
                  key={dp.id}
                  position={dp.location}
                  title={`${dp.name} (${dp.status})`}
                  icon={{
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z", // A simple pin icon (can be customized)
                    fillColor: dp.status === "Delivering Order #12345" ? "#10B981" : "#6366F1", // Green for delivering, indigo for others
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 1.5,
                    anchor: new window.google.maps.Point(12, 24), // Center of the marker
                  }}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        )}
      </div>
      <div className="mt-2">
        <h4 className="text-lg font-semibold mb-3 text-gray-800">Delivery Personnel Status:</h4>
        <ul className="space-y-2">
          {deliveryPersonsLive.map((dp) => (
            <li key={dp.id} className="flex items-center text-gray-700">
              <ManWithBikeIcon className="h-5 w-5 mr-2 text-indigo-500" />
              <span className="font-medium">{dp.name}:</span>
              <span className={`ml-2 text-sm font-medium ${dp.status.includes("Delivering") ? "text-green-600" : "text-gray-500"}`}>{dp.status}</span>
              <FaPhoneAlt className="ml-auto mr-2 text-gray-500" />
              {dp.phone}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// --- Main Chef Account Settings Component ---
const ChefAccountSettings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center drop-shadow-sm">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Chef Dashboard</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Column 1: Chef Profile */}
          <div className="min-h-[500px]">
            {" "}
            {/* Ensure consistent height */}
            <ChefProfileSettings />
          </div>

          {/* Column 2: Order Management */}
          <div className="min-h-[500px]">
            {" "}
            {/* Ensure consistent height */}
            <ChefOrderManagement />
          </div>

          {/* Column 3: Delivery Tracking Map */}
          <div className="min-h-[500px]">
            {" "}
            {/* Ensure consistent height */}
            <DeliveryTrackingMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefAccountSettings;
