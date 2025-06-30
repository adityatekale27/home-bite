import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling, faTachometerAlt, faClipboardList, faBookOpen, faUserCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

// Accept activePath prop to highlight the current page
const Sidebar = ({ activePath }) => {
  return (
    <aside className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white flex flex-col p-6 rounded-2xl shadow-2xl mr-8">
      {" "}
      <div className="text-2xl font-extrabold text-center py-2 border-b border-green-800 flex items-center justify-center bg-green-800/20">
        <FontAwesomeIcon icon={faSeedling} className="mr-3 text-green-300" /> HomeCooked{" "}
      </div>{" "}
      <div className="p-4 border-b border-green-800 flex items-center">
        <img src="https://placehold.co/40x40/a7f3d0/065f46?text=JD" alt="User Avatar" className="w-12 h-12 rounded-full border-2 border-green-300 shadow-md mr-4" />{" "}
        <div>
          <p className="font-semibold text-lg text-green-100">Chef John Doe</p> <p className="text-sm text-green-200">Cook ID: #HC789</p>{" "}
        </div>{" "}
      </div>
      <nav className="flex-1 px-2 py-1">
        <ul className="space-y-0">
          <li>
            {/* Dashboard Link - active class applied if current path matches */}{" "}
            <Link
              to="/dashboard"
              className={`flex items-center px-1 py-1 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 group ${
                activePath === "/dashboard" ? "bg-green-600 shadow-md" : "hover:bg-green-600"
              }`}>
              {" "}
              <FontAwesomeIcon
                icon={faTachometerAlt}
                className={`mr-2 ${activePath === "/dashboard" ? "text-green-100" : "text-green-200"} group-hover:text-white`}
              /> Dashboard{" "}
            </Link>{" "}
          </li>{" "}
          <li>
            {/* Orders Link - active class applied if current path matches */}{" "}
            <Link
              to="/orders"
              className={`flex items-center px-1 py-1 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 group ${
                activePath === "/dashboard/orders" ? "bg-green-600 shadow-md" : "hover:bg-green-600"
              }`}>
              <FontAwesomeIcon icon={faClipboardList} className={`mr-2 ${activePath === "/orders" ? "text-green-100" : "text-green-200"} group-hover:text-white`} /> Orders{" "}
            </Link>{" "}
          </li>{" "}
          <li>
            {/* My Menu Link - active class applied if current path matches */}{" "}
            <Link
              to="/Mymenu"
              className={`flex items-center px-1 py-1 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 group ${
                activePath === "/Mymenu" ? "bg-green-600 shadow-md" : "hover:bg-green-600"
              }`}>
              <FontAwesomeIcon icon={faBookOpen} className={`mr-2 ${activePath === "Mymenu" ? "text-green-100" : "text-green-200"} group-hover:text-white`} /> My Menu{" "}
            </Link>{" "}
          </li>{" "}
          <li>
            {/* Account Settings Link - active class applied if current path matches */}{" "}
            <Link
              to="/accounts"
              className={`flex items-center px-1 py-1 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 group ${
                activePath === "/accounts" ? "bg-green-600 shadow-md" : "hover:bg-green-600"
              }`}>
              <FontAwesomeIcon icon={faUserCog} className={`mr-4 ${activePath === "/accounts" ? "text-green-100" : "text-green-200"} group-hover:text-white`} /> Account Settings{" "}
            </Link>{" "}
          </li>{" "}
          <li>
            {/* Logout Link */}{" "}
            <Link
              to="/login" // Assuming /login is your login page route
              className="flex items-center px-1 py-1 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 group">
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-green-200 group-hover:text-white" /> Logout{" "}
            </Link>{" "}
          </li>{" "}
        </ul>{" "}
      </nav>{" "}
      <div className="p-1 text-sm text-center text-green-200 border-t border-green-800">
        <p>© 2025 HomeCooked</p> <p className="mt-1">All rights reserved.</p>{" "}
      </div>{" "}
    </aside>
  );
};

export default Sidebar;
