import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import NavBar from "../components/NavBar";
import PlaylistHeader from "../components/PlaylistHeader";
import SongCard from "../components/SongCard";
import PlaylistsOthers from "../components/PlaylistsOthers";

const DeveloperPlaylist = ({ onSelectSong, selectedSong, isPlaying }) => {
  const { id } = useParams();
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylistAndSongs = async () => {
      const { data: playlistData, error: playlistError } = await supabase
        .from("developer_playlists")
        .select("*")
        .eq("id", id)
        .single();

      if (playlistError) {
        console.error("Error al obtener playlist:", playlistError);
        return;
      }

      setPlaylist(playlistData);

      const { data: songsData, error: songsError } = await supabase
        .from("developer_palylists_songs")
        .select("song_id, developer_palylists_songs_song_id_fkey(*)")
        .eq("playlist_id", id);

      if (songsError) {
        console.error("Error al obtener canciones:", songsError);
        return;
      }

      const canciones = songsData.map(
        (item) => item.developer_palylists_songs_song_id_fkey
      );
      setSongs(canciones);
    };

    fetchPlaylistAndSongs();
  }, [id]);

  return (
    <div className="min-h-screen overflow-x-hidden p-4 bg-[#121212] text-white flex justify-center flex-col items-center">
      {playlist && (
        <PlaylistHeader
          coverUrl={playlist.cover_url}
          name={playlist.name}
          description={playlist.description}
        />
      )}

      <div className="flex w-[80%] justify-between">
        <div className="mt-4 w-full lg:w-[70%]">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onSelect={onSelectSong}
              currentSong={selectedSong}
              isPlaying={isPlaying}
            />
          ))}
        </div>
        <div className="lg:flex hidden w-[30%]">
          <PlaylistsOthers category="trending_by_genre" title="Other Playlists" />
        </div>
      </div>

      <NavBar className="left-0" />
    </div>
  );
};

export default DeveloperPlaylist;
