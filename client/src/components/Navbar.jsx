import { useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import PropTypes from "prop-types";

import logo from "../../images/logo.png";

const NavbarItems = ({ title, classProps }) => {
  return <li className={`mx-4 cursor-pointer ${classProps}`}>{title}</li>;
};

// Define PropTypes for the component
NavbarItems.propTypes = {
  title: PropTypes.string.isRequired,
  classProps: PropTypes.string,
};

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <nav className="w-full flex items-center p-4 justify-between">
      {/* Logo Section */}
      <div className="flex-initial justify-center items-center">
        <img src={logo} alt="Logo" className="w-32 cursor-pointer" />
      </div>

      {/* Navbar Items */}
      <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {["Market", "Exchange", "Tutorial", "Wallets"].map((item, index) => (
          <NavbarItems key={item + index} title={item} />
        ))}
        <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
          Login
        </li>
      </ul>

      {/* Toggle Menu Icon */}
      <div className="md:hidden flex items-center">
        {toggleMenu ? (
          <AiOutlineClose
            fontSize={28}
            className="text-white cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <HiMenuAlt4
            fontSize={28}
            className="text-white cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
      </div>

      {/* Mobile Menu */}
      {toggleMenu && (
        <ul className="z-10 fixed top-0 right-0 p-3 w-[70vw] h-screen shadow-2-xl md:hidden text-white list-none flex flex-col justify-start items-start rounded-md blue-glassmorphism animate-slide-in">
          <li className="text-xl w-full my-2">
            <AiOutlineClose onClick={() => setToggleMenu(false)} className="cursor-pointer" />
          </li>
          {["Market", "Exchange", "Tutorial", "Wallets"].map((item, index) => (
            <NavbarItems key={item + index} title={item} classProps="my-2 text-lg cursor-pointer" />
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;