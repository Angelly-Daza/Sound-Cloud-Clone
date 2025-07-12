import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import NavBar from "../components/NavBar";
import SongCard from "../components/SongCard";
import { useUser } from "@supabase/auth-helpers-react";
import { FaHeart } from "react-icons/fa"; 
import { FaSoundcloud } from "react-icons/fa6";

const LikedSongs = ({ onSelectSong, selectedSong, isPlaying }) => {
  const user = useUser();
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      if (!user) {
        console.log("No user found, returning from fetchLikedSongs");
        setLikedSongs([]);
        return;
      }

      console.log("Fetching likes for user:", user.id);

      const { data: likes, error } = await supabase
        .from("Likes")
        .select("song_id"); 

      if (error) {
        console.error("Error fetching likes:", error);
        setLikedSongs([]);
        return;
      }

      if (!likes || likes.length === 0) {
        console.log("No likes found for user.");
        setLikedSongs([]);
        return;
      }

      const songIds = likes.map((like) => like.song_id);
      console.log("Found liked song IDs:", songIds);

    
      const { data: songs, error: songsError } = await supabase
        .from("songs") 
        .select("*")
        .in("id", songIds);

      if (songsError) {
        console.error("Error fetching liked songs details:", songsError);
        setLikedSongs([]);
      } else {
        console.log("Successfully fetched liked songs:", songs);
        setLikedSongs(songs);
      }
    };

    fetchLikedSongs();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-neutral-900 to-[#121212] text-white p-4 pb-28">

      <div className="flex flex-col md:flex-row items-center gap-x-5 py-8 md:py-16 px-4">
        <div className="relative aspect-square w-full md:w-56 h-auto rounded-md overflow-hidden bg-gradient-to-br from-red-600 to-purple-600 shadow-xl">
          
          <FaHeart className="absolute inset-0 m-auto text-white text-7xl md:text-8xl opacity-80" />
        </div>
        <div className="mt-6 md:mt-0">
          <p className="hidden md:block font-semibold text-sm text-white">Playlist</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mt-2">
            Liked Songs
          </h1>
          <p className="text-neutral-400 text-sm mt-2">
            {likedSongs.length} {likedSongs.length === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>

      {likedSongs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20 px-4">
          <FaHeart className="text-6xl text-neutral-600 mb-4" /> 
          <p className="text-neutral-400 mt-10 text-lg">
            You haven't liked any songs yet. Start adding some!
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-3 px-2"> 
          {likedSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onSelect={onSelectSong}
              currentSong={selectedSong}
              isPlaying={isPlaying}
            />
          ))}
        </div>
      )}

      <NavBar />
    </div>
  );
};

export default LikedSongs;