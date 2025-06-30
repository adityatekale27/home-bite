// src/pages/MyMenuPage.jsx
import React, { useState, useEffect } from "react";
import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// src/pages/MyMenuPage.jsx
import {
  faBookOpen,
  faPlus,
  faPlusCircle,
  faUtensils,
  faDollarSign,
  faTag,
  faChevronDown,
  faCheck,
  faTimes,
  faEdit,
  faTrashAlt,
  faCheckCircle,
  faTimesCircle,
  faSave,
  faClipboardList, // <--- ADD THIS LINE
} from "@fortawesome/free-solid-svg-icons";

// ... rest of your component code

const initialMenuItems = [
  {
    id: 1,
    name: "Rajma Chawal",
    description: "Traditional North Indian kidney beans with rice, served with a side of salad.",
    price: 6.0,
    offerPrice: null,
    availability: "Available",
    isHotSelling: false,
    imageUrl: "https://placehold.co/400x300/4CAF50/white?text=Rajma+Chawal",
  },
  {
    id: 2,
    name: "Masala Dosa",
    description: "Crispy South Indian crepe filled with spicy mashed potatoes, served with sambar and chutney.",
    price: 5.0,
    offerPrice: 4.5,
    availability: "Sold Out",
    isHotSelling: true,
    imageUrl: "https://placehold.co/400x300/FFC107/white?text=Masala+Dosa",
  },
  {
    id: 3,
    name: "Chicken Biryani",
    description: "Fragrant basmati rice cooked with succulent chicken pieces and aromatic spices.",
    price: 10.5,
    offerPrice: null,
    availability: "Available",
    isHotSelling: false,
    imageUrl: "https://placehold.co/400x300/FF5722/white?text=Chicken+Biryani",
  },
  {
    id: 4,
    name: "Veg Thali",
    description: "A wholesome meal with seasonal vegetables, dal, rice, roti, and sweet.",
    price: 8.0,
    offerPrice: 7.0,
    availability: "Available",
    isHotSelling: true,
    imageUrl: "https://placehold.co/400x300/2196F3/white?text=Veg+Thali",
  },
];

const MyMenuPage = () => {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [nextMealId, setNextMealId] = useState(initialMenuItems.length > 0 ? Math.max(...initialMenuItems.map((item) => item.id)) + 1 : 1);
  const [editingMealId, setEditingMealId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    availability: "Available",
    isHotSelling: false,
    imageUrl: "",
  });

  // Effect to scroll to top when entering edit mode
  useEffect(() => {
    if (editingMealId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [editingMealId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMealData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      // Set offerPrice to null if empty string or 0
      offerPrice: formData.offerPrice ? parseFloat(formData.offerPrice) : null,
      availability: formData.availability,
      isHotSelling: formData.isHotSelling,
      imageUrl: formData.imageUrl || `https://placehold.co/400x300/CCCCCC/white?text=${formData.name || "Meal"}`, // Default image if blank
    };

    if (editingMealId) {
      // Editing existing meal
      setMenuItems((prevItems) => prevItems.map((item) => (item.id === editingMealId ? { ...item, ...newMealData } : item)));
      alert("Meal updated successfully!");
    } else {
      // Adding new meal
      setMenuItems((prevItems) => [...prevItems, { id: nextMealId, ...newMealData }]);
      setNextMealId((prevId) => prevId + 1);
      alert("Meal added to menu successfully!");
    }

    // Reset form and editing state
    resetForm();
  };

  const editMeal = (id) => {
    const mealToEdit = menuItems.find((meal) => meal.id === id);
    if (mealToEdit) {
      setEditingMealId(id);
      setFormData({
        name: mealToEdit.name,
        description: mealToEdit.description,
        price: mealToEdit.price,
        offerPrice: mealToEdit.offerPrice || "", // Set to empty string for input
        availability: mealToEdit.availability,
        isHotSelling: mealToEdit.isHotSelling,
        imageUrl: mealToEdit.imageUrl,
      });
    }
  };

  const cancelEdit = () => {
    resetForm();
  };

  const deleteMeal = (id) => {
    if (window.confirm("Are you sure you want to delete this meal from the menu?")) {
      setMenuItems((prevItems) => prevItems.filter((meal) => meal.id !== id));
      alert("Meal deleted successfully!");
    }
  };

  const resetForm = () => {
    setEditingMealId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      offerPrice: "",
      availability: "Available",
      isHotSelling: false,
      imageUrl: "",
    });
  };

  return (
    // The main content area of the dashboard
    <div className="flex-1 p-8 lg:p-12 bg-gray-50">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 flex items-center mb-2">
            <FontAwesomeIcon icon={faBookOpen} className="mr-4 text-green-600" /> My Daily Menu
          </h1>
          <p className="text-gray-600 text-lg">Manage your homemade meals, hot sellings, and special offers.</p>
        </div>
        <button
          className="btn-primary px-6 py-3 rounded-full flex items-center text-lg mt-6 md:mt-0"
          onClick={() => {
            resetForm();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}>
          <FontAwesomeIcon icon={faPlus} className="mr-3" /> Add New Meal
        </button>
      </div>

      <div className="mb-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FontAwesomeIcon icon={faPlusCircle} className="mr-3 text-green-600" /> {editingMealId ? "Edit Meal Details" : "Add New Meal Details"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="mealName" className="block text-sm font-medium text-gray-700 mb-1">
              Meal Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="mealName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700 shadow-sm"
                placeholder="e.g. Paneer Butter Masala with Rice"
              />
              <FontAwesomeIcon icon={faUtensils} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="mealDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="mealDescription"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700 shadow-sm"
              placeholder="Describe the meal, ingredients, and any special notes"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mealPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Original Price ($)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="mealPrice"
                  name="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700 shadow-sm"
                  placeholder="e.g. 12.50"
                />
                <FontAwesomeIcon icon={faDollarSign} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label htmlFor="mealOfferPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Offer Price ($) <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="mealOfferPrice"
                  name="offerPrice"
                  step="0.01"
                  value={formData.offerPrice}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700 shadow-sm"
                  placeholder="e.g. 9.99"
                />
                <FontAwesomeIcon icon={faTag} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mealAvailability" className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <div className="relative">
                <select
                  id="mealAvailability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700 shadow-sm">
                  <option value="Available">Available</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center mt-6 md:mt-0">
              <input
                type="checkbox"
                id="isHotSelling"
                name="isHotSelling"
                checked={formData.isHotSelling}
                onChange={handleChange}
                className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="isHotSelling" className="ml-2 block text-sm font-medium text-gray-700">
                Mark as Hot Selling
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="mealImage" className="block text-sm font-medium text-gray-700 mb-1">
              Meal Image (URL)
            </label>
            <input
              type="text"
              id="mealImage"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700 shadow-sm"
              placeholder="e.g. https://placehold.co/400x300/green/white?text=Meal"
            />
            <p className="text-xs text-gray-500 mt-1">Provide a URL for the meal image. If left blank, a default placeholder will be used.</p>
          </div>
          <button type="submit" className="btn-primary px-6 py-3 rounded-lg flex items-center text-lg">
            <FontAwesomeIcon icon={editingMealId ? faSave : faPlus} className="mr-3" /> {editingMealId ? "Save Changes" : "Add Meal to Menu"}
          </button>
          {editingMealId && (
            <button type="button" onClick={cancelEdit} className="btn-secondary px-6 py-3 rounded-lg flex items-center text-lg ml-4">
              <FontAwesomeIcon icon={faTimes} className="mr-3" /> Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FontAwesomeIcon icon={faClipboardList} className="mr-3 text-green-600" /> My Current Menu Items
        </h2>
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-600">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tl-xl">Meal</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-white uppercase tracking-wider">Description</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-white uppercase tracking-wider">Price</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-white uppercase tracking-wider">Offer Price</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-white uppercase tracking-wider">Availability</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-white uppercase tracking-wider">Hot Selling</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {menuItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-500">
                    No menu items added yet. Add a new meal above!
                  </td>
                </tr>
              ) : (
                menuItems.map((meal) => (
                  <tr key={meal.id} className="border-b border-gray-100 hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="py-4 px-6 text-gray-800 font-medium flex items-center">
                      <img src={meal.imageUrl} alt={meal.name} className="w-10 h-10 rounded-lg mr-3 object-cover" />
                      {meal.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{meal.description}</td>
                    <td className="py-4 px-6 text-gray-700 font-medium">${meal.price.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      {meal.offerPrice ? <span className="text-red-600 font-semibold">${meal.offerPrice.toFixed(2)}</span> : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`status-badge ${meal.availability === "Available" ? "status-available" : "status-sold-out"}`}>
                        <FontAwesomeIcon icon={meal.availability === "Available" ? faCheckCircle : faTimesCircle} /> {meal.availability}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {meal.isHotSelling ? <FontAwesomeIcon icon={faCheck} className="text-green-500" /> : <FontAwesomeIcon icon={faTimes} className="text-gray-400" />}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => editMeal(meal.id)}
                        className="text-white bg-yellow-500 px-3 py-1 rounded-lg btn-action hover:bg-yellow-600 mr-2 text-sm flex items-center">
                        <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
                      </button>
                      <button onClick={() => deleteMeal(meal.id)} className="text-white bg-red-500 px-3 py-1 rounded-lg btn-action hover:bg-red-600 text-sm flex items-center">
                        <FontAwesomeIcon icon={faTrashAlt} className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyMenuPage;
