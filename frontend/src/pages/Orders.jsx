import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReceipt,
  faHourglassHalf,
  faTruckMoving,
  faEye,
  faInfoCircle,
  faMapMarkerAlt,
  faUtensils,
  faCheckCircle,
  faTimesCircle,
  faMoneyBillWave,
  faListAlt,
  faClipboardList,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";

// Define a simple Modal component to replace alert/confirm
const MessageBox = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <p className="text-gray-800 text-lg font-semibold mb-4">{message}</p>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

// Dummy data for placed orders (simulating data from userdashboard.html)
const initialOrders = [
  {
    id: 10001,
    customerName: "Aarav Sharma",
    items: [
      {
        name: "Rajma Chawal",
        quantity: 1,
        price: 6.0,
        imageUrl:
          "https://images.unsplash.com/photo-1616785600378-00a454d4f8f4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    total: 6.0,
    deliveryType: "delivery",
    deliveryAddress: "123 MG Road, Connaught Place, New Delhi",
    deliveryLat: 28.6324,
    deliveryLng: 77.2187,
    status: "Pending",
    paymentMethod: "card",
  },
  {
    id: 10002,
    customerName: "Sneha Patel",
    items: [
      {
        name: "Masala Dosa",
        quantity: 2,
        price: 4.5,
        imageUrl:
          "https://images.unsplash.com/photo-1626074464117-644917578051?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    total: 9.0,
    deliveryType: "takeaway",
    deliveryAddress: "",
    deliveryLat: null,
    deliveryLng: null,
    status: "Preparing",
    paymentMethod: "upi",
  },
  {
    id: 10003,
    customerName: "Rahul Singh",
    items: [
      {
        name: "Chicken Biryani",
        quantity: 1,
        price: 10.5,
        imageUrl:
          "https://images.unsplash.com/photo-1631526435777-62547b749d21?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        name: "Veg Thali",
        quantity: 1,
        price: 7.0,
        imageUrl:
          "https://images.unsplash.com/photo-1626804475176-f40445d58d84?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    total: 17.5,
    deliveryType: "delivery",
    deliveryAddress: "456 Sector 18, Noida",
    deliveryLat: 28.57,
    deliveryLng: 77.32,
    status: "Out for Delivery",
    paymentMethod: "cod",
  },
  {
    id: 10004,
    customerName: "Priya Devi",
    items: [
      {
        name: "Aloo Paratha",
        quantity: 2,
        price: 4.0,
        imageUrl:
          "https://images.unsplash.com/photo-1616785600378-00a454d4f8f4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    total: 8.0,
    deliveryType: "takeaway",
    deliveryAddress: "",
    deliveryLat: null,
    deliveryLng: null,
    status: "Delivered",
    paymentMethod: "card",
  },
  {
    id: 10005,
    customerName: "Amit Kumar",
    items: [
      {
        name: "Chole Bhature",
        quantity: 1,
        price: 7.5,
        imageUrl:
          "https://images.unsplash.com/photo-1626804475176-f40445d58d84?q=80&w=2940&auto=format&fit=fit&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    total: 7.5,
    deliveryType: "delivery",
    deliveryAddress: "789 DLF Phase 1, Gurgaon",
    deliveryLat: 28.46,
    deliveryLng: 77.08,
    status: "Cancelled",
    paymentMethod: "card",
  },
];

const OrdersPage = () => {
  // State for managing orders, modal visibility, and selected order
  const [orders, setOrders] = useState(initialOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [messageBox, setMessageBox] = useState(""); // State for custom message box

  // Ref for the Google Map div
  const mapRef = useRef(null);
  // Google Maps API key placeholder - REPLACE WITH YOUR ACTUAL KEY
  const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

  // Function to get status badge classes and icon
  const getStatusBadge = (status) => {
    let statusClass = "";
    let statusIcon = null;
    switch (status) {
      case "Pending":
        statusClass = "status-pending-order";
        statusIcon = faHourglassHalf;
        break;
      case "Preparing":
        statusClass = "status-preparing-order";
        statusIcon = faUtensils;
        break;
      case "Out for Delivery":
        statusClass = "status-out-for-delivery";
        statusIcon = faTruckMoving;
        break;
      case "Delivered":
        statusClass = "status-delivered-order";
        statusIcon = faCheckCircle;
        break;
      case "Cancelled":
        statusClass = "status-cancelled-order";
        statusIcon = faTimesCircle;
        break;
      default:
        statusClass = "bg-gray-100 text-gray-700";
        statusIcon = faInfoCircle;
    }
    return { statusClass, statusIcon };
  };

  // Function to get payment status badge classes and icon
  const getPaymentStatusBadge = (method) => {
    let paymentStatusClass = "";
    let paymentStatusText = "";
    let paymentStatusIcon = null;
    if (method === "cod") {
      paymentStatusClass = "status-pending-payment";
      paymentStatusText = "Pending (COD)";
      paymentStatusIcon = faMoneyBillWave;
    } else {
      paymentStatusClass = "status-paid";
      paymentStatusText = "Paid";
      paymentStatusIcon = faCheckCircle;
    }
    return { paymentStatusClass, paymentStatusText, paymentStatusIcon };
  };

  // Function to update order summary counts
  const updateOrderSummaryCards = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((order) => order.status === "Pending" || order.status === "Preparing").length;
    const outForDeliveryOrders = orders.filter((order) => order.status === "Out for Delivery").length;

    // These values would typically be passed as props to MetricCard components
    // For now, we'll just log them or assume MetricCard handles its own value.
    // In a real app, you'd likely lift this state up or pass it down.
    // Since MetricCard is a separate component, its value prop will be updated automatically.
    // We'll return these values to be used in the JSX below.
    return { totalOrders, pendingOrders, outForDeliveryOrders };
  };

  // Function to open order details modal
  const viewOrderDetails = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      setMessageBox("Order details not found.");
      return;
    }
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Function to close order details modal
  const closeOrderDetailsModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null); // Clear selected order
  };

  // Function to update order status from modal
  const updateOrderStatusFromModal = (newStatus) => {
    if (selectedOrder) {
      const updatedOrders = orders.map((order) => (order.id === selectedOrder.id ? { ...order, status: newStatus } : order));
      setOrders(updatedOrders); // Update the orders state
      setSelectedOrder((prev) => ({ ...prev, status: newStatus })); // Update selected order in modal
      setMessageBox(`Order #${selectedOrder.id} status updated to: ${newStatus}`);
      if (newStatus === "Delivered" || newStatus === "Cancelled") {
        setTimeout(closeOrderDetailsModal, 1000); // Close modal after a short delay
      }
    }
  };

  // Google Maps initialization
  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if google.maps is already loaded
      if (window.google && window.google.maps) {
        if (selectedOrder && selectedOrder.deliveryType === "delivery" && selectedOrder.deliveryLat && selectedOrder.deliveryLng && mapRef.current) {
          const location = { lat: selectedOrder.deliveryLat, lng: selectedOrder.deliveryLng };
          const map = new window.google.maps.Map(mapRef.current, {
            zoom: 15,
            center: location,
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: true,
          });
          new window.google.maps.Marker({
            position: location,
            map: map,
            title: "Customer Location",
          });
        }
      } else {
        // If not loaded, inject the script
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMaps`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
          console.error("Failed to load Google Maps API. Check your internet connection and API key.");
          if (mapRef.current) {
            mapRef.current.innerHTML = '<p class="text-center text-red-500 py-10">Map failed to load. Please check your internet connection and Google Maps API key.</p>';
          }
        };
        // Define the global callback function if it doesn't exist
        if (!window.initMaps) {
          window.initMaps = () => {
            // This function will be called by Google Maps script once loaded
            // It will trigger a re-render or state update to initialize the map
            // For simplicity, we'll just rely on the useEffect dependency on selectedOrder
            console.log("Google Maps API loaded.");
          };
        }
        document.head.appendChild(script);
      }
    };

    // Load maps only when modal is open and order is selected
    if (isModalOpen && selectedOrder && selectedOrder.deliveryType === "delivery") {
      loadGoogleMaps();
    }
  }, [isModalOpen, selectedOrder]); // Re-run when modal state or selected order changes

  const { totalOrders, pendingOrders, outForDeliveryOrders } = updateOrderSummaryCards();

  return (
    <div className="flex-1 p-8 lg:p-12 bg-gray-50 font-sans">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 flex items-center mb-2">
            <FontAwesomeIcon icon={faClipboardList} className="mr-4 text-green-600" /> Customer Orders
          </h1>
          <p className="text-gray-600 text-lg">View and manage all incoming customer orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Metric Card: Total Orders */}
        <div className="bg-white p-7 rounded-xl shadow-lg flex items-center justify-between transform hover:scale-105 transition duration-300 ease-in-out border border-gray-100">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Orders</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">{totalOrders}</p>
          </div>
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full flex-shrink-0">
            <FontAwesomeIcon icon={faReceipt} className="text-3xl" />
          </div>
        </div>
        {/* Metric Card: Pending Orders */}
        <div className="bg-white p-7 rounded-xl shadow-lg flex items-center justify-between transform hover:scale-105 transition duration-300 ease-in-out border border-gray-100">
          <div>
            <p className="text-gray-500 text-sm font-medium">Pending Orders</p>
            <p className="text-4xl font-bold text-yellow-600 mt-1">{pendingOrders}</p>
          </div>
          <div className="bg-yellow-100 text-yellow-600 p-4 rounded-full flex-shrink-0">
            <FontAwesomeIcon icon={faHourglassHalf} className="text-3xl" />
          </div>
        </div>
        {/* Metric Card: Out for Delivery */}
        <div className="bg-white p-7 rounded-xl shadow-lg flex items-center justify-between transform hover:scale-105 transition duration-300 ease-in-out border border-gray-100">
          <div>
            <p className="text-gray-500 text-sm font-medium">Out for Delivery</p>
            <p className="text-4xl font-bold text-sky-600 mt-1">{outForDeliveryOrders}</p>
          </div>
          <div className="bg-sky-100 text-sky-600 p-4 rounded-full flex-shrink-0">
            <FontAwesomeIcon icon={faTruckMoving} className="text-3xl" />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FontAwesomeIcon icon={faListAlt} className="mr-3 text-green-600" /> All Orders
        </h2>
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider rounded-tl-xl">Order ID</th>
                <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider">Customer</th>
                <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider">Items</th>
                <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider">Total</th>
                <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider">Payment</th>
                <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-gray-500">
                    No orders to display.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const { statusClass, statusIcon } = getStatusBadge(order.status);
                  const { paymentStatusClass, paymentStatusText, paymentStatusIcon } = getPaymentStatusBadge(order.paymentMethod);
                  const itemsSummary = order.items.map((item) => `${item.name} (x${item.quantity})`).join(", ");

                  return (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="py-4 px-6 text-gray-800 font-medium">#{order.id}</td>
                      <td className="py-4 px-6 text-gray-600">{order.customerName}</td>
                      <td className="py-4 px-6 text-gray-600 text-sm">{itemsSummary}</td>
                      <td className="py-4 px-6 text-gray-700 font-medium">${order.total.toFixed(2)}</td>
                      <td className="py-4 px-6 text-gray-600">{order.deliveryType === "delivery" ? "Home Delivery" : "Takeaway"}</td>
                      <td className="py-4 px-6">
                        <span className={`status-badge ${paymentStatusClass}`}>
                          <FontAwesomeIcon icon={paymentStatusIcon} className="mr-1" /> {paymentStatusText}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`status-badge ${statusClass}`}>
                          <FontAwesomeIcon icon={statusIcon} className="mr-1" /> {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => viewOrderDetails(order.id)}
                          className="text-white bg-blue-500 px-3 py-1 rounded-lg btn-action hover:bg-blue-600 text-sm flex items-center">
                          <FontAwesomeIcon icon={faEye} className="mr-1" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="modal flex" style={{ display: isModalOpen ? "flex" : "none" }}>
          <div className="modal-content">
            <span className="close-button" onClick={closeOrderDetailsModal}>
              &times;
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-3 text-blue-600" /> Order Details: <span id="modalOrderId">#{selectedOrder.id}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Customer:</span> <span id="modalCustomerName">{selectedOrder.customerName}</span>
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Order Type:</span> <span id="modalOrderType">{selectedOrder.deliveryType === "delivery" ? "Home Delivery" : "Takeaway"}</span>
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Payment:</span> <span id="modalPaymentStatus">{getPaymentStatusBadge(selectedOrder.paymentMethod).paymentStatusText}</span>
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Current Status:</span> <span id="modalOrderStatus">{selectedOrder.status}</span>
                </p>
                {selectedOrder.deliveryType === "delivery" && (
                  <p id="modalDeliveryAddressContainer" className="text-gray-600 mb-2">
                    <span className="font-semibold">Delivery Address:</span> <span id="modalDeliveryAddress">{selectedOrder.deliveryAddress || "Location on map"}</span>
                  </p>
                )}
              </div>
              <div>
                <p className="text-gray-600 mb-2 font-semibold">Items:</p>
                <ul id="modalOrderItems" className="list-disc list-inside bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-32 overflow-y-auto">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index}>
                      {item.name} (x{item.quantity}) - ${(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
                <p className="text-xl font-bold text-gray-800 mt-4 text-right">
                  Total: <span id="modalOrderTotal">${selectedOrder.total.toFixed(2)}</span>
                </p>
              </div>
            </div>

            {selectedOrder.deliveryType === "delivery" && selectedOrder.deliveryLat && selectedOrder.deliveryLng && (
              <div id="modalMapSection" className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-500" /> Delivery Location
                </h3>
                <div id="orderDetailMap" ref={mapRef} className="h-300px w-full rounded-xl shadow-md"></div>
              </div>
            )}

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <FontAwesomeIcon icon={faSyncAlt} className="mr-2 text-green-600" /> Update Order Status
              </h3>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => updateOrderStatusFromModal("Pending")} className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center">
                  <FontAwesomeIcon icon={faHourglassHalf} className="mr-2" /> Pending
                </button>
                <button onClick={() => updateOrderStatusFromModal("Preparing")} className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center">
                  <FontAwesomeIcon icon={faUtensils} className="mr-2" /> Preparing
                </button>
                <button onClick={() => updateOrderStatusFromModal("Out for Delivery")} className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center">
                  <FontAwesomeIcon icon={faTruckMoving} className="mr-2" /> Out for Delivery
                </button>
                <button onClick={() => updateOrderStatusFromModal("Delivered")} className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> Delivered
                </button>
                <button
                  onClick={() => updateOrderStatusFromModal("Cancelled")}
                  className="text-white bg-red-500 px-4 py-2 rounded-lg btn-action hover:bg-red-600 text-sm flex items-center">
                  <FontAwesomeIcon icon={faTimesCircle} className="mr-2" /> Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Message Box */}
      <MessageBox message={messageBox} onClose={() => setMessageBox("")} />
    </div>
  );
};

export default OrdersPage;
