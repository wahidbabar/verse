import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import useCartStore from "@/store/cart-store";

const navigation = [
  { name: "Dashboard", href: "/user-dashboard" },
  { name: "Orders", href: "/orders" },
  { name: "Cart Page", href: "/cart" },
  { name: "Check Out", href: "/checkout" },
];

const Navbar = () => {
  const { cartItems } = useCartStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { currentUser, logout } = useAuth();

  const handleLogOut = () => {
    logout();
  };

  const token = localStorage.getItem("token");

  return (
    <header className="w-full max-w-screen-4xl mx-auto px-10 py-6">
      <nav className="flex justify-between items-center space-x-8">
        {/* Logo and Search bar */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="font-extrabold text-2xl tracking-widest text-primary"
          >
            VERSE
          </Link>

          <div className="sm:w-80 w-52 px-4 py-2 flex items-center bg-gray-200 rounded-md shadow-md">
            <IoSearchOutline className="text-lg text-gray-600" />
            <input
              type="text"
              placeholder="Search here"
              className="w-full py-1 px-4 focus:outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right section (Profile, Heart, Cart) */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            {currentUser ? (
              <>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <img
                    src="/assets/avatar.png"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full ring-2 ring-blue-500"
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-40">
                    <ul className="py-2">
                      {navigation.map((item) => (
                        <li
                          key={item.name}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Link
                            to={item.href}
                            className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={handleLogOut}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : token ? (
              <Link to="/dashboard" className="text-primary font-semibold">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="text-primary">
                <HiOutlineUser className="text-xl" />
              </Link>
            )}
          </div>

          {/* Heart icon */}
          <button className="hidden sm:block">
            <HiOutlineHeart className="text-xl text-gray-600" />
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="bg-primary text-white py-2 px-4 flex items-center rounded-md hover:bg-primary-dark"
          >
            <HiOutlineShoppingCart className="text-xl" />
            <span className="ml-1 text-sm font-semibold">
              {cartItems.length > 0 ? cartItems.length : 0}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
