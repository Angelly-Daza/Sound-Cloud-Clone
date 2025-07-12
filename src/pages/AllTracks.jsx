import Header from "../components/Header";
import NavBar from "../components/NavBar";
import SongList from "../components/SongList";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

const AllTracks = () => {
    const navigate = useNavigate();
    const [selectedSong, setSelectedSong] = useState(null); 

    return (
        <>
            <div className="relative w-full min-h-screen px-0 py-2 gap-2 m-0 bg-[#121212] text-white overflow-x-hidden">
                <main className="[grid-area:main] p-4">
                    <h1 className="text-3xl font-bold mb-4">All Available Tracks</h1>
                    
                    <SongList onSelectSong={setSelectedSong} />
                </main>
                <footer className="[grid-area:player] ">
                    <NavBar />
                </footer>
            </div>
        </>
    );
};

export default AllTracks;