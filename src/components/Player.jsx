import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import { FaPause, FaVolumeUp, FaVolumeMute, FaPlay } from "react-icons/fa";
import { supabase } from "../supabase/supabaseClient";

const Player = ({ song, isPlaying, setIsPlaying }) => {
  const [sound, setSound] = useState(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const intervalRef = useRef(null);
  const progressBarRef = useRef(null);

  // Efecto para inicializar o cambiar la canción
  useEffect(() => {
    if (!song) {
      if (sound) {
        sound.unload();
      }
      setIsPlaying(false);
      setProgress(0);
      return;
    }

    if (sound) {
      sound.stop();
      clearInterval(intervalRef.current);
    }

    const newSound = new Howl({
      src: [song.audio_path],
      html5: true,
      volume: volume,
      onend: () => {
        setIsPlaying(false);
        setProgress(0);
      },
      onplay: () => {
        setIsPlaying(true);
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          if (newSound.playing()) {
            setProgress(newSound.seek());
          }
        }, 500);
      },
      onpause: () => {
        setIsPlaying(false);
        clearInterval(intervalRef.current);
      },
      onstop: () => {
        setIsPlaying(false);
        clearInterval(intervalRef.current);
        setProgress(0);
      },
      onloaderror: (id, error) => {
        console.error("Error al cargar la canción:", error);
      },
    });

    setSound(newSound);

    if (isPlaying || !sound) {
      newSound.play();
      setIsPlaying(true);
    }

    return () => {
      if (newSound) {
        newSound.unload();
      }
      clearInterval(intervalRef.current);
    };
  }, [song, setIsPlaying]);

  // Efecto para actualizar el volumen del sonido cuando cambia el estado 'volume'
  useEffect(() => {
    if (sound) {
      sound.volume(volume);
    }
  }, [volume, sound]);

  // Función para alternar entre reproducir y pausar
  const togglePlayPause = () => {
    if (!sound) return;

    if (isPlaying) {
      sound.pause();
    } else {
      sound.play();
    }
  };

  // Función para manejar el "seek" (mover la barra de progreso)
  const handleSeek = (e) => {
    if (!sound || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const duration = sound.duration();
    if (duration > 0) {
      const seekTime = (clickX / width) * duration;
      sound.seek(seekTime);
      setProgress(seekTime);
    }
  };

  // Función para manejar el cambio de volumen
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    // El sound.volume(newVolume) ya se maneja en el useEffect de volumen
  };

  // Función para formatear el tiempo (segundos a formato mm:ss)
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const duration = sound ? sound.duration() : 0;

  // Calculamos el porcentaje del volumen para el gradiente
  const volumePercentage = volume * 100;

  return (
    <>
      {song ? (
        <div className="fixed bottom-0 left-0 w-full text-white z-50 overflow-y-hidden bg-[#333333] py-2 px-4 lg:px-32">
          {/* LAYOUT PARA PANTALLAS PEQUEÑAS (SM) */}
          <div className="flex sm:hidden items-center justify-around gap-4 w-full">
            <button
              onClick={togglePlayPause}
              className="bg-white text-neutral-900 p-3 rounded-full hover:scale-110 transition-transform shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 cursor-pointer"
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? <FaPause size={13} /> : <FaPlay size={13} />}
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={song.Image_url || song.image_path}
                alt={song.Title || song.title}
                className="w-12 h-12 object-cover rounded-md shadow-md"
              />
              <div className="flex flex-col truncate">
                <p className="text-sm text-neutral-400 truncate">
                  {song.Artist || song.artist}
                </p>
                <p className="text-base font-bold text-white truncate">
                  {song.Title || song.title}
                </p>
              </div>
            </div>
          </div>

          {/* LAYOUT PARA PANTALLAS MEDIANAS (MD) Y GRANDES (LG) */}
          <div className="hidden sm:flex justify-between items-center w-full gap-4">
            <div className="flex items-center min-w-[50px]">
              <button
                onClick={togglePlayPause}
                className="bg-white text-neutral-900 p-3 rounded-full hover:scale-110 transition-transform shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 cursor-pointer"
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
              </button>
            </div>

            <div className="flex flex-grow items-center justify-center gap-8 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 md:gap-4 flex-grow">
                <span className="text-xs text-neutral-400 min-w-[30px]">
                  {formatTime(progress)}
                </span>
                <div
                  ref={progressBarRef}
                  onClick={handleSeek}
                  className="relative flex-grow h-1 bg-neutral-700 rounded-full cursor-pointer group"
                >
                  <div
                    style={{ width: `${(progress / (duration || 1)) * 100}%` }}
                    className="bg-[#FF5500] h-full rounded-full group-hover:bg-[#FF5500] transition-colors duration-200"
                  />
                  <div
                    style={{ left: `${(progress / (duration || 1)) * 100}%` }}
                    className="absolute -top-1.5 -ml-2 w-3.5 h-3.5 bg-white rounded-full shadow-md transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:opacity-100 sm:group-hover:opacity-100"
                  />
                </div>
                <span className="text-xs text-neutral-400 min-w-[30px]">
                  {formatTime(duration)}
                </span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={song.Image_url || song.image_path}
                  alt={song.Title || song.title}
                  className="w-8 h-8 object-cover rounded-md shadow-md lg:w-12 lg:h-12"
                />
                <div className="flex flex-col truncate">
                  <p className="text-sm text-neutral-400 truncate">
                    {song.Artist || song.artist}
                  </p>
                  <p className="text-base font-bold text-white truncate">
                    {song.Title || song.title}
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3 min-w-[150px] justify-end">
              {volume === 0 ? (
                <FaVolumeMute className="text-neutral-300" size={20} />
              ) : (
                <FaVolumeUp className="text-neutral-300" size={20} />
              )}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                // *** AQUÍ ESTÁ EL CAMBIO CLAVE ***
                style={{
                  background: `linear-gradient(to right, #FF5500 0%, #FF5500 ${volumePercentage}%, #4A5568 ${volumePercentage}%, #4A5568 100%)`,
                }}
                className="w-24 h-1 rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:hover:bg-[#FF5500] [&::-webkit-slider-thumb]:transition-colors [&::-webkit-slider-thumb]:duration-200
                [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:hover:bg-[#FF5500] [&::-moz-range-thumb]:transition-colors [&::-moz-range-thumb]:duration-200"
                aria-label="Control de volumen"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Player;