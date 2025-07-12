import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Player from "../components/Player";
import PlaylistRow from "../components/PlaylistsRow";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div
        id="Home"
        className="relative w-full min-h-screen px-0 gap-2 m-0 bg-[#121212] text-white overflow-x-hidden"
      >
        <main className="[grid-area:main]">
          <PlaylistRow category="trending_by_genre" title="Trending by genre" />
          <PlaylistRow category="top_artists" title="Top Artists" />
          <div className="flex items-center justify-center mt-8">
            <button
              onClick={() => navigate("/alltracks")}
              className="cursor-pointer bg-[#FF6500] text-white rounded-full py-3 px-6 font-bold text-lg shadow-lg hover:bg-[#FFB88B] hover:text-black transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#FFB88B] focus:ring-opacity-50"
            >
              All Tracks
            </button>
          </div>
        </main>

        <footer className="[grid-area:player]">
          <div>
            <NavBar/>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
