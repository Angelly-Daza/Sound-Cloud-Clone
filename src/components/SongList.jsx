import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';

const SongList = ({ onSelectSong }) => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const { data, error } = await supabase.from('songs').select('*');
      if (error) {
        console.error('Error al obtener canciones:', error.message);
      } else {
        setSongs(data);
      }
    };

    fetchSongs();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10"> 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"> 
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex flex-col items-center p-4 bg-neutral-800 rounded-xl shadow-lg hover:bg-neutral-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 cursor-pointer relative group"
            onClick={() => onSelectSong && onSelectSong(song)}
          >
    
            <img
              src={song.image_path}
              alt={song.title}
              className="w-full h-auto aspect-square object-cover rounded-lg mb-4 shadow-md group-hover:shadow-xl transition-shadow duration-300"
            />

        
            <div className="text-center w-full">
              <p className="font-semibold text-lg text-white truncate mb-1">{song.title}</p>
              <p className="text-sm text-neutral-400 truncate">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList;