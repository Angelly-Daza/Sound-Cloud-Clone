import { useNavigate } from "react-router-dom";

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-4 bg-neutral-800 hover:bg-neutral-700 p-3 rounded-md cursor-pointer transition"
      onClick={() => navigate(`/mix/${playlist.id}`)}
    >
      <img
        src={playlist.cover_url}
        alt={playlist.name}
        className="w-16 h-16 rounded-md object-cover flex-shrink-0"
      />
      <div className="flex flex-col overflow-hidden">
        <p className="text-white font-semibold truncate">{playlist.name}</p>
      </div>
    </div>
  );
};

export default PlaylistCard;
