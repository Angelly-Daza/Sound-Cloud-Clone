import { FaHome, FaSearch, FaBook, FaDownload, FaListUl } from 'react-icons/fa';
import { BsSearch } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { IoCloudUploadSharp } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import { FaHeart } from "react-icons/fa";

const NavBar = () => {
    return (
        <nav className="fixed bottom-0 w-full bg-[#121212] border-t border-gray-300 md:hidden flex justify-around items-center py-2 z-50 ">
            <NavLink to="/" className="flex flex-col items-center text-xs text-white hover:text-gray-600">
                <GoHomeFill className="w-6 h-6" />
                Home
            </NavLink>

            <NavLink to="/profile" className="flex flex-col items-center text-xs text-white hover:text-gray-600">
                <CgProfile className="w-6 h-6" />
                Profile
            </NavLink>

            <NavLink to="/search" className="flex flex-col items-center text-xs text-white hover:text-gray-600">
                <BsSearch className="w-6 h-6" />
                Search
            </NavLink>

            <NavLink to="/likes" className="flex flex-col items-center text-xs text-white hover:text-gray-600">
                <FaHeart className="w-6 h-6" />
                Likes
            </NavLink>

            <NavLink to="/upload" className="flex flex-col items-center text-xs text-white hover:text-gray-600">
                <IoCloudUploadSharp className="w-6 h-6" />
                Upload
            </NavLink>
        </nav>
    );
};

export default NavBar;
