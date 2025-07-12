import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import SongCard from "../components/SongCard";
import SearchInput from "../components/SearchInput";
import PlaylistCard from "../components/PlaylistCard";
import { FaSoundcloud } from "react-icons/fa6";

const tabs = ["All", "Tracks", "Playlists"];

const Search = ({ onSelectSong, selectedSong, isPlaying }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.trim() === "") {
        setSongs([]);
        setPlaylists([]);
        return;
      }

      const [songsRes, playlistsRes] = await Promise.all([
        supabase.from("songs").select("*").ilike("title", `%${searchTerm}%`),
        supabase
          .from("developer_playlists")
          .select("*")
          .ilike("name", `%${searchTerm}%`),
      ]);

      if (songsRes.error)
        console.error("Error al buscar canciones:", songsRes.error);
      if (playlistsRes.error)
        console.error("Error al buscar playlists:", playlistsRes.error);

      setSongs(songsRes.data || []);
      setPlaylists(playlistsRes.data || []);
    };

    const delay = setTimeout(fetchResults, 400);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const showPlaceholder =
    searchTerm.trim() === "" && songs.length === 0 && playlists.length === 0;

  const filteredResults = {
    All: [
      ...playlists.map((p) => ({ type: "playlist", data: p })),
      ...songs.map((s) => ({ type: "song", data: s })),
    ],
    Tracks: songs.map((s) => ({ type: "song", data: s })),
    Playlists: playlists.map((p) => ({ type: "playlist", data: p })),
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white mt-11 pt-3">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      <div className="flex mt-4 mb-4 border-b border-neutral-700">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-semibold px-3 pb-2 border-b-2 ${
              activeTab === tab
                ? "border-white text-white"
                : "border-transparent text-neutral-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {showPlaceholder && (
        <div className="flex flex-col items-center justify-center text-center mt-20 px-4">
          <FaSoundcloud className="text-6xl text-neutral-600 mb-4" />
          <p className="text-neutral-400 font-semibold">
            Search SoundCloud for tracks, artists, podcasts, and playlists.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-4 bg-white text-black px-4 py-1 rounded font-bold cursor-pointer hover:scale-105 transform transition"
          >
            Go back to Home
          </button>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {filteredResults[activeTab].map(({ type, data }) =>
          type === "song" ? (
            <SongCard
              key={data.id}
              song={data}
              onSelect={onSelectSong}
              currentSong={selectedSong}
              isPlaying={isPlaying}
            />
          ) : (
            <PlaylistCard key={data.id} playlist={data} />
          )
        )}
      </div>

      <NavBar />
    </div>
  );
};

export default Search;
