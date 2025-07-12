import { FiSearch } from "react-icons/fi";

const SearchInput = ({ value, onChange }) => {
  const handleCancel = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex items-center justify-between w-full px-2">
      <div className="flex items-center bg-neutral-800 rounded-xl px-3 py-2 flex-grow mr-2">
        <FiSearch className="text-gray-400 text-xl mr-2" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          autoFocus
          placeholder="Search"
          className="bg-transparent outline-none text-white placeholder-gray-400 w-full"
        />
      </div>

      <button
        onClick={handleCancel}
        className="text-gray-400 text-sm font-medium hover:text-white transition"
      >
        Cancel
      </button>
    </div>
  );
};

export default SearchInput;
