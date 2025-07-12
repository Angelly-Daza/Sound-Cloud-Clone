import { useEffect } from "react";
import { FaPlay, FaPause, FaHeart, FaRegHeart } from "react-icons/fa";
import { useLikes } from "../hooks/useLikes";

const SongCard = ({ song, onSelect, currentSong, isPlaying }) => {
  const { liked, toggleLike } = useLikes(song.id);

  const handleLike = async (e) => {
    e.stopPropagation();
    await toggleLike();
  };

  const isCurrent = currentSong && currentSong.id === song.id;

  return (
    <div
      onClick={() => onSelect(song)}
      className="flex items-center justify-between hover:bg-neutral-800 rounded-md transition px-2 py-2  cursor-pointer"
    >
      <div className="flex items-center flex-row gap-4">
        <img
          src={song.image_path}
          alt={song.title}
          className="w-12 h-12  object-cover"
        />
        <div className="flex justify-center items-center gap-2">
          <span className="text-neutral-400  font-semibold text-xs">{song.artist}</span>
          <p className="text-white font-semibold text-base">{song.title}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleLike}>
          {liked ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-white text-lg" />
          )}
        </button>
        {isCurrent && isPlaying ? (
          <FaPause className="text-white text-lg" />
        ) : (
          <FaPlay className="text-white text-lg" />
        )}
      </div>
    </div>
  );
};

export default SongCard;
