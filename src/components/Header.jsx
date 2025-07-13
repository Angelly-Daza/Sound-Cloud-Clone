import { FaSoundcloud } from "react-icons/fa6";
import { supabase } from "../supabase/supabaseClient";
import { NavLink, useNavigate } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { BsSearch } from "react-icons/bs";
import { IoCloudUploadSharp } from "react-icons/io5";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error.message);
      return;
    }
    navigate("/login");
  };

  return (
    <header className="flex gap-5 justify-between items-center bg-[#121212] px-3 md:px-52">
      <div className="flex gap-6 items-center font-semibold text-gray-400">
        <NavLink
          to="/"
          className="flex flex-col items-center text-mb hover:text-white transform transition hover:scale-105"
        >
          <FaSoundcloud className="w-11 h-auto text-white transform transition scale-105" />
        </NavLink>

        <NavLink
          to="/"
          className="hidden md:flex items-center text-mb hover:text-white transform transition"
        >
          Home
        </NavLink>

        <NavLink
          to="/search"
          className="hidden md:flex flex-col items-center text-mb hover:text-white transform transition"
        >
          Search
        </NavLink>

        <NavLink
          to="/likes"
          className="hidden md:flex items-center text-mb hover:text-white transform transition"
        >
          Likes
        </NavLink>

      </div>

      <div className="flex gap-6 items-center font-semibold text-gray-400">
        <NavLink
          to="/upload"
          className="hidden md:flex flex-col items-center text-mb hover:text-white transform transition"
        >
          Upload
        </NavLink>
        <NavLink
          to="/profile"
          className="hidden md:flex flex-col items-center text-mb hover:text-white transform transition "
        >
          Profile
        </NavLink>

        <button
          onClick={handleLogout}
          className="bg-white text-black font-semibold px-3 py-1 rounded-lg border border-black hover:bg-black hover:text-white hover:transition-all duration-300 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
