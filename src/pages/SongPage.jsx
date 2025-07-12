import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { FaPlay } from "react-icons/fa";
import Header from "../components/Header";
import NavBar from "../components/NavBar";

const SongPage = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);

  useEffect(() => {
    const fetchSong = async () => {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al cargar canción:", error);
      } else {
        setSong(data);
      }
    };

    fetchSong();
  }, [id]);

  if (!song) return <div className="text-white">Cargando...</div>;

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4">

      <div className="flex flex-col items-center mt-6">
        <img
          src={song.image_path}
          alt={song.title}
          className="w-64 h-64 object-cover rounded-lg mb-4 shadow-lg"
        />
        <h1 className="text-3xl font-bold mb-1">{song.title}</h1>
        <p className="text-neutral-400 text-lg mb-4">{song.artist}</p>

        <button
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full text-white font-medium"
          onClick={() => {
     
            console.log("Reproducir", song.title);
          }}
        >
          <FaPlay />
          Reproducir
        </button>
      </div>

      <NavBar className="mt-6" />
    </div>
  );
};

export default SongPage;
