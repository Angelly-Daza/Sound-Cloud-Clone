import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

const PlaylistRow = ({ category, title }) => {
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
    <div className="p-4">
      <h2 className="lg:text-5xl text-2xl font-bold mb-4 text-white">{title}</h2>

     
      <div className="flex lg:grid lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-x-auto lg:overflow-visible scroll-smooth snap-x lg:snap-none">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            
            className="snap-start flex-shrink-0 hover:bg-neutral-700 cursor-pointer rounded-xl p-3 transition w-[260px] lg:w-full"
            onClick={() => navigate(`/mix/${playlist.id}`)}
          >
            <img
              src={playlist.cover_url}
              alt={playlist.name}
              className="w-full h-auto aspect-square object-cover rounded-lg mb-2"
            />
            <h2 className="text-lg font-semibold text-white truncate">
              {playlist.name}
            </h2>
            <p className="text-sm text-neutral-400 truncate ">
              {playlist.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistRow;