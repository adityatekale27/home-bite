import React, { useState, useEffect, useMemo } from "react";

// Icons from react-icons/fa
import {
  FaShoppingCart,
  FaInfoCircle,
  FaCreditCard,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaUtensils,
  FaRupeeSign,
  FaPlus,
  FaMinus,
  FaVideo,
  FaTag,
  FaTimesCircle,
  FaCheckCircle,
  FaStar,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUserEdit,
  FaTrashAlt,
  FaMoneyBillWave,
  FaPercent,
  FaGift,
  FaThumbsUp,
  FaRegSmile,
  FaCopy,
  FaEnvelope,
  FaLock,
  FaExclamationTriangle,
  FaCashRegister,
} from "react-icons/fa";

// Extra icon from react-icons/fa6 (new Font Awesome 6 icons)
import { FaShop } from "react-icons/fa6"; // Using FaShop for restaurant icon

// ✅ Correct import for FontAwesomeIcon from @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling } from "@fortawesome/free-solid-svg-icons";

// --- Dummy Data ---
// You would typically fetch this from a backend API
const dummyDishes = [
  {
    id: "d1",
    name: "Spicy Paneer Tikka",
    restaurant: "Curry House",
    description: "Succulent paneer marinated in spicy yogurt and grilled to perfection. Aromatic and flavorful.",
    price: 250,
    image: "https://images.unsplash.com/photo-1626071850785-305f8841459a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    video: "https://www.w3schools.com/html/mov_bbb.mp4", // Placeholder video
    rating: 4.5,
  },
  {
    id: "d2",
    name: "Butter Chicken",
    restaurant: "Mughlai Delights",
    description: "Creamy tomato gravy with tender chicken pieces, a classic Indian dish loved worldwide.",
    price: 380,
    image: "https://images.unsplash.com/photo-1631515277995-1f6e2b6a9f0f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    video: "https://www.w3schools.com/html/mov_bbb.mp4", // Placeholder video
    rating: 4.8,
  },
  {
    id: "d3",
    name: "Vegetable Biryani",
    restaurant: "Biryani Palace",
    description: "Fragrant basmati rice cooked with mixed vegetables and aromatic spices, a wholesome meal.",
    price: 220,
    image: "https://images.unsplash.com/photo-1606513543883-9b8826b528f8?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    video: null, // No video for this one
    rating: 4.2,
  },
  {
    id: "d4",
    name: "Masala Dosa",
    restaurant: "South Indian Cafe",
    description: "Crispy rice crepe filled with spiced potato masala, served with tangy sambar and fresh chutney.",
    price: 150,
    image: "https://images.unsplash.com/photo-1623910600109-158f96e737c3?q=80&w=1968&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    rating: 4.6,
  },
  {
    id: "d5",
    name: "Chicken Korma",
    restaurant: "Mughlai Delights",
    description: "Rich and creamy chicken curry, slow-cooked with nuts and mild spices. A truly royal experience.",
    price: 420,
    image: "https://images.unsplash.com/photo-1632598379685-64906f0e74f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    video: null,
    rating: 4.7,
  },
  {
    id: "d6",
    name: "Chole Bhature",
    restaurant: "Punjabi Dhaba",
    description: "Fluffy fried bread served with spicy chickpea curry, a hearty and satisfying meal.",
    price: 180,
    image: "https://images.unsplash.com/photo-1647891940173-9844f2d72f10?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    rating: 4.3,
  },
];

const dummyOffers = [
  { id: "o1", name: "Flat 20% Off", description: "On orders above ₹500. Limited time offer!", code: "SAVE20", type: "percentage", value: 20, minOrder: 500, icon: FaPercent },
  {
    id: "o2",
    name: "Free Dessert",
    description: "With any main course from Curry House. Indulge your sweet tooth!",
    code: "SWEETREAT",
    type: "item",
    value: "Dessert",
    icon: FaGift,
  },
  { id: "o3", name: "₹100 Off", description: "On your first order. Welcome to the family!", code: "NEWUSER100", type: "flat", value: 100, minOrder: 200, icon: FaMoneyBillWave },
  {
    id: "o4",
    name: "Weekend Bonanza",
    description: "15% Off all orders every Saturday & Sunday. Enjoy!",
    code: "WEEKEND15",
    type: "percentage",
    value: 15,
    minOrder: 300,
    icon: FaThumbsUp,
  },
];

// --- IMPORTANT: Replace with your actual Razorpay Key ID ---
// You would get this from your Razorpay Dashboard.
const RAZORPAY_KEY_ID = "rzp_test_XXXXXXXXXXXXXXXX"; // e.g., 'rzp_test_YOUR_ACTUAL_KEY_ID'

// --- Utility function to load Razorpay script ---
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// --- Components ---

// Sidebar Navigation
const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { name: "My Cart", icon: FaShoppingCart, tab: "myCart" },
    { name: "Add Information", icon: FaInfoCircle, tab: "addInformation" },
    { name: "Payment", icon: FaCreditCard, tab: "payment" },
    { name: "Account Settings", icon: FaCog, tab: "accountSettings" },
    { name: "Offers & Coupons", icon: FaTag, tab: "offersAndCoupons" },
    { name: "Logout", icon: FaSignOutAlt, tab: "logout" },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white flex flex-col p-6 rounded-2xl shadow-2xl mr-8">
      <div className="text-2xl font-extrabold text-center py-2 border-b border-green-800 flex items-center justify-center bg-green-800/20">
        <FontAwesomeIcon icon={faSeedling} className="mr-3 text-green-300" /> HomeCooked{" "}
      </div>

      <nav className="flex-grow">
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.tab}>
              <button
                onClick={() => setActiveTab(item.tab)}
                className={`flex items-center w-full py-3 px-4 rounded-xl transition-all duration-300 ease-in-out transform
                                    ${
                                      activeTab === item.tab
                                        ? "bg-green-600 text-white shadow-lg scale-105 border-r-4 border-green-300"
                                        : "hover:bg-green-700 text-green-100 hover:text-white hover:scale-103"
                                    }`}>
                <item.icon className="mr-4 text-xl" />
                <span className="font-semibold text-lg">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// Dish Card Component
const DishCard = ({ dish, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [showVideo, setShowVideo] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(dish, quantity);
    setQuantity(1); // Reset quantity after adding to cart
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full transform transition-transform duration-300 hover:scale-103 hover:shadow-2xl border border-gray-100">
      <div className="relative">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-48 object-cover object-center rounded-t-2xl"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x300/cccccc/333333?text=Dish+Image";
          }}
        />
        <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-md">
          <FaStar className="mr-1 text-xs" /> {dish.rating}
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{dish.name}</h3>
        <p className="text-sm text-gray-600 flex items-center mb-2">
          <FaShop className="mr-2 text-green-600" /> {dish.restaurant}
        </p>
        <p className="text-gray-700 text-sm mb-3 flex-grow">{dish.description}</p>

        <div className="flex items-center justify-between mb-4 mt-auto pt-3 border-t border-gray-100">
          <span className="text-3xl font-extrabold text-green-700 flex items-center">
            <FaRupeeSign className="text-xl mr-1" />
            {dish.price}
          </span>
          {dish.video && (
            <button
              onClick={() => setShowVideo(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-600 transition duration-200 text-sm shadow-md">
              <FaVideo className="mr-2" /> Watch Video
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-lg transition focus:outline-none">
              <FaMinus />
            </button>
            <span className="px-3 text-lg font-bold text-gray-800">{quantity}</span>
            <button onClick={() => setQuantity((prev) => prev + 1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg transition focus:outline-none">
              <FaPlus />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white py-3 px-6 rounded-lg flex items-center hover:bg-green-700 transition duration-300 shadow-lg text-lg font-semibold">
            <FaShoppingCart className="mr-2 text-xl" /> Add
          </button>
        </div>
      </div>

      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full relative shadow-2xl">
            <h4 className="text-xl font-bold mb-4 text-gray-900">{dish.name} - Preparation Video</h4>
            <button onClick={() => setShowVideo(false)} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl">
              <FaTimesCircle />
            </button>
            <div className="relative" style={{ paddingBottom: "56.25%", height: 0 }}>
              <iframe src={dish.video} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen className="absolute top-0 left-0 w-full h-full rounded-md"></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Home/Menu Display
const MenuDisplay = ({ onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDishes = useMemo(() => {
    if (!searchTerm) {
      return dummyDishes;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return dummyDishes.filter((dish) => dish.name.toLowerCase().includes(lowerCaseSearchTerm) || dish.restaurant.toLowerCase().includes(lowerCaseSearchTerm));
  }, [searchTerm]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 h-full flex flex-col">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-7 border-b-2 border-green-200 pb-4">
        <FaUtensils className="inline-block mr-4 text-green-600" />
        Explore Our Delicious Menu
      </h2>
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for your favorite dishes or restaurants..."
            className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 shadow-sm text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 flex-grow overflow-y-auto custom-scrollbar pr-2">
        {filteredDishes.length > 0 ? (
          filteredDishes.map((dish) => <DishCard key={dish.id} dish={dish} onAddToCart={onAddToCart} />)
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg text-gray-600 text-xl font-medium shadow-inner">
            <FaRegSmile className="text-5xl text-gray-400 mb-4 mx-auto" />
            <p>Oops! No dishes found matching your search. Try a different keyword!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// My Cart Component
const MyCart = ({ cart, setCart }) => {
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const updateQuantity = (dishId, delta) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => (item.id === dishId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item));
      return updatedCart.filter((item) => item.quantity > 0);
    });
  };

  const removeItem = (dishId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== dishId));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 h-full flex flex-col">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-7 border-b-2 border-green-200 pb-4">
        <FaShoppingCart className="inline-block mr-4 text-green-600" />
        Your Shopping Cart
      </h2>
      {cart.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-gray-600 text-xl bg-gray-50 rounded-lg shadow-inner py-12">
          <FaShoppingCart className="text-6xl text-gray-400 mb-4" />
          <p>Your cart is empty. Time to fill it with deliciousness!</p>
          <button
            onClick={() => alert("Navigate to home page")} // In a real app, change activeTab to 'home'
            className="mt-6 bg-indigo-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md">
            Start Shopping!
          </button>
        </div>
      ) : (
        <>
          <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item.id} className="py-5 flex items-center justify-between border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl mr-5 shadow-md" />
                    <div>
                      <p className="font-semibold text-xl text-gray-900 mb-1">{item.name}</p>
                      <p className="text-gray-600 text-base flex items-center">
                        <FaShop className="mr-1 text-green-500" /> {item.restaurant}
                      </p>
                      <p className="text-green-700 font-bold text-lg flex items-center mt-1">
                        <FaRupeeSign className="text-sm mr-1" />
                        {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-3 text-gray-600 hover:bg-gray-100 rounded-l-lg transition focus:outline-none">
                        <FaMinus />
                      </button>
                      <span className="px-4 text-xl font-bold text-gray-800">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-3 text-gray-600 hover:bg-gray-100 rounded-r-lg transition focus:outline-none">
                        <FaPlus />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 transition transform hover:scale-110" title="Remove item">
                      <FaTrashAlt className="text-2xl" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 pt-6 border-t-2 border-green-100 bg-green-50 p-6 rounded-lg shadow-inner">
            <div className="flex justify-between items-center text-3xl font-extrabold text-gray-900 mb-4">
              <span>Subtotal:</span>
              <span className="flex items-center">
                <FaRupeeSign className="text-2xl mr-2" />
                {calculateSubtotal().toFixed(2)}
              </span>
            </div>
            <button className="w-full bg-green-600 text-white py-4 px-8 rounded-xl text-xl font-semibold hover:bg-green-700 transition duration-300 shadow-lg transform hover:scale-105">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Add Information Component
const AddInformation = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8 h-full flex flex-col">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-7 border-b-2 border-green-200 pb-4">
      <FaInfoCircle className="inline-block mr-4 text-green-600" />
      Your Delivery Details
    </h2>
    <form className="space-y-6 flex-grow">
      <div>
        <label htmlFor="fullName" className="block text-lg font-medium text-gray-700 mb-2">
          <FaUserEdit className="inline-block mr-2 text-green-500" /> Full Name
        </label>
        <input
          type="text"
          id="fullName"
          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-4 text-lg focus:ring-green-500 focus:border-green-500"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-700 mb-2">
          <FaPhoneAlt className="inline-block mr-2 text-green-500" /> Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-4 text-lg focus:ring-green-500 focus:border-green-500"
          placeholder="+91 12345 67890"
        />
      </div>
      <div>
        <label htmlFor="deliveryAddress" className="block text-lg font-medium text-gray-700 mb-2">
          <FaMapMarkerAlt className="inline-block mr-2 text-green-500" /> Delivery Address
        </label>
        <textarea
          id="deliveryAddress"
          rows="4"
          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-4 text-lg focus:ring-green-500 focus:border-green-500"
          placeholder="Flat No, Building Name, Street, City, Pincode"></textarea>
      </div>
      <div className="pt-6">
        <button
          type="submit"
          className="w-full py-4 px-8 border border-transparent shadow-lg text-xl font-semibold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105">
          Save Information
        </button>
      </div>
    </form>
  </div>
);

// Payment Component (Updated)
const Payment = ({ cart, offers, setCart }) => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" }); // 'success', 'error'
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card"); // Default to Card/UPI
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script on component mount
  useEffect(() => {
    const load = async () => {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (res) {
        setRazorpayLoaded(true);
      } else {
        console.error("Razorpay SDK failed to load. Check your internet connection or script URL.");
        setMessage({ type: "error", text: "Payment gateway not available. Please try again later." });
      }
    };
    load();
  }, []);

  const subtotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.type === "percentage") {
      return (subtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === "flat") {
      return appliedCoupon.value;
    }
    return 0;
  };

  const discount = calculateDiscount();
  const finalTotal = Math.max(0, subtotal - discount);

  const applyCoupon = () => {
    setMessage({ type: "", text: "" });
    const coupon = offers.find((o) => o.code === couponCode.toUpperCase());
    if (coupon) {
      if (coupon.minOrder && subtotal < coupon.minOrder) {
        setMessage({ type: "error", text: `Minimum order of ₹${coupon.minOrder} required for this coupon.` });
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(coupon);
        setMessage({ type: "success", text: `Coupon "${coupon.name}" applied successfully!` });
      }
    } else {
      setMessage({ type: "error", text: "Invalid coupon code." });
      setAppliedCoupon(null);
    }
  };

  const displayRazorpay = async () => {
    if (!razorpayLoaded) {
      setMessage({ type: "error", text: "Payment gateway not loaded yet. Please wait or refresh." });
      return;
    }
    if (cart.length === 0) {
      setMessage({ type: "error", text: "Your cart is empty. Please add items before proceeding to payment." });
      return;
    }

    // --- Simulate Backend Order Creation ---
    // In a real application, you would make an API call to your backend
    // to create a Razorpay order. The backend would use your KEY_SECRET.
    // Example:
    // const response = await fetch('/api/create-razorpay-order', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ amount: finalTotal * 100, currency: 'INR' })
    // });
    // const order = await response.json();
    // const order_id = order.id;

    // For this frontend-only demo, we'll use a dummy order_id.
    const dummyOrderId = `order_${Math.random().toString(36).substr(2, 9)}`;

    const options = {
      key: RAZORPAY_KEY_ID, // Your Key ID
      amount: Math.round(finalTotal * 100), // Amount in paisa
      currency: "INR",
      name: "Food Ordering App",
      description: "Order Payment",
      order_id: dummyOrderId, // Replace with actual order_id from backend
      handler: function (response) {
        // This function is called when the payment is successful
        console.log("Payment successful:", response);
        setMessage({ type: "success", text: `Payment successful! Payment ID: ${response.razorpay_payment_id}` });
        setCart([]); // Clear cart
        setAppliedCoupon(null);
        setCouponCode("");
        // In a real app, you would verify payment on your backend
      },
      prefill: {
        name: "User Name", // Dynamically fill from user info
        email: "user@example.com", // Dynamically fill from user info
        contact: "9999999999", // Dynamically fill from user info
      },
      notes: {
        address: "Delivery Address", // Dynamically fill from user info
        order_items: JSON.stringify(cart.map((item) => ({ id: item.id, name: item.name, qty: item.quantity }))),
      },
      theme: {
        color: "#10B981", // A shade of green matching your theme
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      setMessage({ type: "error", text: `Payment failed: ${response.error.description}` });
    });
    rzp1.open();
  };

  const handlePayment = () => {
    if (cart.length === 0) {
      setMessage({ type: "error", text: "Your cart is empty. Please add items before proceeding to payment." });
      return;
    }

    if (selectedPaymentMethod === "cod") {
      setMessage({ type: "success", text: "Order placed! Cash on Delivery selected. Please keep cash ready." });
      setCart([]); // Clear cart
      setAppliedCoupon(null);
      setCouponCode("");
    } else {
      // For UPI or Card, trigger Razorpay
      displayRazorpay();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 h-full flex flex-col">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-7 border-b-2 border-green-200 pb-4">
        <FaCreditCard className="inline-block mr-4 text-green-600" />
        Secure Payment & Checkout
      </h2>
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
        {/* Order Summary */}
        <div className="bg-green-50 p-6 rounded-lg shadow-inner mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b border-green-200 pb-2">Order Summary</h3>
          {cart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty. Please add items from the menu to proceed.</p>
          ) : (
            <ul className="divide-y divide-green-100">
              {cart.map((item) => (
                <li key={item.id} className="py-2 flex justify-between items-center text-lg">
                  <span className="text-gray-700">
                    {item.name} (x{item.quantity})
                  </span>
                  <span className="flex items-center font-semibold text-gray-800">
                    <FaRupeeSign className="text-base mr-1" />
                    {(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Coupon Section */}
        <div className="mb-6 bg-blue-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b border-blue-200 pb-2 flex items-center">
            <FaTag className="mr-2 text-blue-600" /> Apply Coupon
          </h3>
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="flex-grow p-4 border border-blue-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm text-lg"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button onClick={applyCoupon} className="bg-blue-600 text-white py-3 px-7 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md text-lg font-semibold">
              Apply
            </button>
          </div>
          {message.text && (
            <p className={`mt-3 text-base font-medium ${message.type === "success" ? "text-green-700" : "text-red-700"} flex items-center`}>
              {message.type === "success" ? <FaCheckCircle className="mr-2 text-xl" /> : <FaTimesCircle className="mr-2 text-xl" />}
              {message.text}
            </p>
          )}
        </div>

        {/* Payment Options */}
        <div className="mb-6 bg-purple-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b border-purple-200 pb-2 flex items-center">
            <FaLock className="mr-2 text-purple-600" /> Choose Payment Method
          </h3>
          <div className="space-y-4">
            <label className="flex items-center p-4 border-2 border-purple-200 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors duration-200">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={selectedPaymentMethod === "card"}
                onChange={() => setSelectedPaymentMethod("card")}
                className="h-5 w-5 text-purple-600 focus:ring-purple-500"
              />
              <FaCreditCard className="ml-4 mr-3 text-2xl text-purple-600" />
              <span className="text-xl font-medium text-gray-800">Card / UPI Payment</span>
            </label>
            <label className="flex items-center p-4 border-2 border-purple-200 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors duration-200">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={selectedPaymentMethod === "cod"}
                onChange={() => setSelectedPaymentMethod("cod")}
                className="h-5 w-5 text-purple-600 focus:ring-purple-500"
              />
              <FaCashRegister className="ml-4 mr-3 text-2xl text-purple-600" />
              <span className="text-xl font-medium text-gray-800">Cash on Delivery (COD)</span>
            </label>
          </div>
        </div>

        {/* Total & Pay Button */}
        <div className="border-t-2 border-gray-100 pt-6 space-y-4 bg-gray-50 p-6 rounded-lg shadow-inner">
          <div className="flex justify-between items-center text-xl text-gray-800">
            <span>Subtotal:</span>
            <span className="flex items-center font-semibold">
              <FaRupeeSign className="text-base mr-1" />
              {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-xl text-red-600">
            <span>Discount:</span>
            <span className="flex items-center font-semibold">
              -<FaRupeeSign className="text-base mr-1" />
              {discount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-4xl font-extrabold text-green-800 pt-4 border-t border-gray-200">
            <span>Total:</span>
            <span className="flex items-center">
              <FaRupeeSign className="text-2xl mr-2" />
              {finalTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t-2 border-green-100">
        <button
          onClick={handlePayment}
          className="w-full bg-green-600 text-white py-4 px-8 rounded-xl text-2xl font-bold hover:bg-green-700 transition duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center"
          disabled={!razorpayLoaded && selectedPaymentMethod !== "cod"} // Disable if Razorpay not loaded and not COD
        >
          {selectedPaymentMethod === "cod" ? (
            <>
              <FaCashRegister className="inline-block mr-3 text-3xl" /> Place COD Order
            </>
          ) : (
            <>
              <FaCreditCard className="inline-block mr-3 text-3xl" /> Pay Now
            </>
          )}
        </button>
        {RAZORPAY_KEY_ID === "rzp_test_XXXXXXXXXXXXXXXX" && selectedPaymentMethod !== "cod" && (
          <p className="mt-4 text-center text-red-500 text-sm font-medium">
            <FaTimesCircle className="inline-block mr-1" /> Please replace `rzp_test_XXXXXXXXXXXXXXXX` with your actual Razorpay Key ID for payments to work.
          </p>
        )}
        {!razorpayLoaded && selectedPaymentMethod !== "cod" && (
          <p className="mt-4 text-center text-yellow-600 text-sm font-medium">
            <FaExclamationTriangle className="inline-block mr-1" /> Loading payment gateway... Please wait.
          </p>
        )}
      </div>
    </div>
  );
};

// Account Settings Component
const AccountSettings = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8 h-full flex flex-col">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-7 border-b-2 border-green-200 pb-4">
      <FaCog className="inline-block mr-4 text-green-600" />
      Your Account Settings
    </h2>
    <form className="space-y-6 flex-grow">
      <div>
        <label htmlFor="userName" className="block text-lg font-medium text-gray-700 mb-2">
          <FaUserEdit className="inline-block mr-2 text-green-500" /> User Name
        </label>
        <input
          type="text"
          id="userName"
          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-4 text-lg focus:ring-green-500 focus:border-green-500"
          placeholder="Your Name"
        />
      </div>
      <div>
        <label htmlFor="userEmail" className="block text-lg font-medium text-gray-700 mb-2">
          <FaEnvelope className="inline-block mr-2 text-green-500" /> Email Address
        </label>
        <input
          type="email"
          id="userEmail"
          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-4 text-lg focus:ring-green-500 focus:border-green-500"
          placeholder="your.email@example.com"
        />
      </div>
      <div>
        <label htmlFor="userPassword" className="block text-lg font-medium text-gray-700 mb-2">
          <FaLock className="inline-block mr-2 text-green-500" /> Password
        </label>
        <input
          type="password"
          id="userPassword"
          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-4 text-lg focus:ring-green-500 focus:border-green-500"
          placeholder="********"
        />
      </div>
      <div className="pt-6">
        <button
          type="submit"
          className="w-full py-4 px-8 border border-transparent shadow-lg text-xl font-semibold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105">
          Save Changes
        </button>
      </div>
    </form>
  </div>
);

// Offers and Coupons Component
const OffersAndCoupons = ({ offers }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8 h-full flex flex-col">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-7 border-b-2 border-green-200 pb-4">
      <FaTag className="inline-block mr-4 text-green-600" />
      Exclusive Offers & Coupons
    </h2>
    <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
      {offers.length === 0 ? (
        <div className="text-gray-600 text-lg text-center py-12 bg-gray-50 rounded-lg shadow-inner">
          <FaRegSmile className="text-5xl text-gray-400 mb-4 mx-auto" />
          <p>No exciting offers available right now. Check back soon for more savings!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-md flex flex-col transform transition-transform duration-300 hover:scale-103 hover:shadow-xl">
              <div className="flex items-center mb-3">
                <div className="p-3 bg-green-600 rounded-full text-white text-2xl mr-4 shadow-lg">
                  <offer.icon />
                </div>
                <h3 className="text-2xl font-bold text-green-800">{offer.name}</h3>
              </div>
              <p className="text-gray-700 mb-4 flex-grow">{offer.description}</p>
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-green-100">
                <div className="bg-green-200 text-green-800 text-base font-extrabold px-4 py-2 rounded-full border-2 border-green-300">
                  Code: <span className="text-green-900">{offer.code}</span>
                </div>
                <button
                  onClick={() => {
                    const el = document.createElement("textarea");
                    el.value = offer.code;
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand("copy");
                    document.body.removeChild(el);
                    alert(`Coupon code "${offer.code}" copied to clipboard!`);
                  }}
                  className="bg-green-600 text-white py-2.5 px-5 rounded-lg text-base font-semibold hover:bg-green-700 transition duration-300 shadow-md flex items-center">
                  <FaCopy className="mr-2" /> Copy Code
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// Main User Dashboard Component
const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [cart, setCart] = useState([]); // Cart state

  const handleAddToCart = (dish, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === dish.id);
      if (existingItem) {
        return prevCart.map((item) => (item.id === dish.id ? { ...item, quantity: item.quantity + quantity } : item));
      } else {
        return [...prevCart, { ...dish, quantity }];
      }
    });
    // You might want to use a more subtle notification here (e.g., a toast)
    console.log(`${quantity} x ${dish.name} added to cart!`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <MenuDisplay onAddToCart={handleAddToCart} />;
      case "myCart":
        return <MyCart cart={cart} setCart={setCart} />;
      case "addInformation":
        return <AddInformation />;
      case "payment":
        return <Payment cart={cart} offers={dummyOffers} setCart={setCart} />;
      case "accountSettings":
        return <AccountSettings />;
      case "offersAndCoupons":
        return <OffersAndCoupons offers={dummyOffers} />;
      case "logout":
        alert("Logged out successfully!");
        // In a real app, this would clear user session and redirect to login page
        // For now, redirecting to home
        setActiveTab("home");
        return null;
      default:
        return <MenuDisplay onAddToCart={handleAddToCart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-10 font-sans flex text-gray-800">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-grow">{renderContent()}</div>

      {/* Custom Scrollbar Style (for overflow-y-auto) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f0fdf4; /* green-50 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #16a34a; /* green-600 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #15803d; /* green-700 */
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
