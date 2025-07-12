import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import DeveloperPlaylist from "./pages/DeveloperPlaylist";
import { useEffect, useState } from "react";
import { supabase } from "./supabase/supabaseClient";
import Player from "./components/Player";
import SongPage from "./pages/SongPage";
import Upload from "./pages/Upload";
import Search from "./pages/Search";
import LikedSongs from "./pages/LikedSongs";
import Profile from "./pages/Profile";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import AllTracks from "./pages/AllTracks";
import Header from "./components/Header";

function App() {
  const navigate = useNavigate();
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentPath = window.location.pathname;
        if (!session && currentPath !== "/login" && currentPath !== "/signup") {
          navigate("/login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <>
      <SessionContextProvider supabaseClient={supabase}>
        <div className="pb-10 bg-[#121212]">
          <div className="fixed top-0 left-0 w-full z-50">
            <Header />
          </div>
          <div className="mb-5"></div>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="*" element={<NotFound />}></Route>
            <Route
              path="/mix/:id"
              element={
                <DeveloperPlaylist
                  onSelectSong={(song) => {
                    setSelectedSong(song);
                    setIsPlaying(true); //
                  }}
                  selectedSong={selectedSong}
                  isPlaying={isPlaying}
                />
              }
            />
            <Route path="/song/:id" element={<SongPage />} />
            <Route path="/upload" element={<Upload />} />
            <Route
              path="/search"
              element={
                <Search
                  onSelectSong={(song) => {
                    setSelectedSong(song);
                    setIsPlaying(true);
                  }}
                  selectedSong={selectedSong}
                  isPlaying={isPlaying}
                />
              }
            />
            <Route path="/likes" element={<LikedSongs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/alltracks" element={<AllTracks />} />
          </Routes>

          <div className="fixed bottom-14 md:bottom-0 left-0 w-full z-50">
            <Player
              song={selectedSong}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          </div>
        </div>
      </SessionContextProvider>
    </>
  );
}

export default App;
