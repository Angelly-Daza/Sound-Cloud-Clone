import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

const PlaylistsOthers = ({ category, title }) => {
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      const { data, error } = await supabase
        .from("developer_playlists")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(`Error fetching playlists for ${category}:`, error);
      } else {
        setPlaylists(data);
      }
    };

    fetchPlaylists();
  }, [category]);

  if (playlists.length === 0) return null;

  return (
    <div className="w-full cursor-pointer p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <button
          onClick={() => navigate("/alltracks")}
          className="bg-white text-black font-semibold px-3 py-1 rounded-lg border border-black hover:bg-black text-xs xl:text-base lg:text-xs hover:text-white hover:transition-all duration-300 cursor-pointer"
        >
          All Tracks
        </button>
      </div>

      <div className="">
        {playlists.slice(0, 7).map((playlist) => (
          <div
            key={playlist.id}
            className="flex gap-2 p-2 rounded hover:bg-neutral-700 "
            onClick={() => navigate(`/mix/${playlist.id}`)}
          >
            <img
              src={playlist.cover_url}
              alt={playlist.name}
              className="w-12 h-auto aspect-square object-cover rounded-lg"
            />
            <h2 className="text-base font-semibold text-white truncate">
              {playlist.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsOthers;
