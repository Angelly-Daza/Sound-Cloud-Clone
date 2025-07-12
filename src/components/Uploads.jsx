import { useCallback, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useDropzone } from "react-dropzone";
import { CiImageOn } from "react-icons/ci";
import { FaMusic } from "react-icons/fa";

const Uploads = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [image, setImage] = useState(null);
  const [song, setSong] = useState(null);

  // Estas variables de estado se actualizarán AL FINAL para reflejar las URLs si la subida fue exitosa
  const [songUrl, setSongUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !artist.trim()) {
      alert("Por favor, introduce el Título y el Artista.");
      return; // Detener si no están completos
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error al obtener la sesión del usuario:", userError);
      alert(
        "Hubo un error al verificar tu sesión. Por favor, intenta iniciar sesión de nuevo."
      );
      return;
    }

    if (!user) {
      // Asegúrate de que el usuario esté autenticado
      alert("Debes iniciar sesión para subir contenido.");
      return;
    }

    let songId = null; // Variable para almacenar el ID de la canción que se insertará

    // --- PRIMERA OPERACIÓN: Insertar datos básicos en la tabla 'songs' y OBTENER SU ID ---

    try {
      const { data: insertedData, error: insertError } = await supabase
        .from("songs")
        .insert({
          title: title.trim(), // .trim() Elimina los espacios en blanco al principio y al final de una cadena de texto
          artist: artist.trim(),
          // Las URLs (image_path, audio_path) NO se insertan aquí inicialmente,
          // se actualizarán después de subir los archivos al Storage.
        })
        .select(); // Obtener los datos de la fila insertada

      if (!insertError) {
        if (insertedData && insertedData.length > 0) {
          // Conprueba si se insertarion los bien los datos, y hay por lo menos un elemento en el array
          songId = insertedData[0].id; // Guarda el ID de la canción
          console.log("Canción base insertada correctamente con ID:", songId);
        } else {
          console.error(
            "Error: No se pudo obtener el ID de la canción después de la inserción inicial. insertedData está vacío."
          );
          alert(
            "Hubo un problema al crear la entrada de la canción. Por favor, inténtalo de nuevo."
          );
          return; // Detener si no se obtiene el ID
        }
      } else {
        console.error("Error al insertar título y artista en DB:", insertError);
        alert(
          `Error al guardar datos de la canción en la base de datos: ${insertError.message}`
        ); // Usar template literals
        return; // Detener si falla
      }
    } catch (dbError) {
      console.error(
        "Excepción en la inserción de datos de la canción:",
        dbError
      );
      alert(
        `Ocurrió un error inesperado al guardar la canción: ${dbError.message}`
      ); // Usar template literals
      return;
    }

    // Variables temporales para guardar las URLs una vez que se obtengan
    let tempPublicImageUrl = null;
    let tempPublicSongUrl = null;

    // --- SEGUNDA OPERACIÓN: Subir imagen a Supabase Storage y obtener su URL pública ---
    if (image) {
      // Verifica si se ha seleccionado un archivo de imagen en el input
      try {
        // Genera la extensión del archivo (ej. "jpg", "png")
        const imageExtension = image.name.split(".").pop();
        // Crea la ruta completa donde se guardará la imagen en el bucket de Storage.
        // Incluye el ID del usuario para organizar, el nombre de la canción (limpiado)
        // y un timestamp (Date.now()) para asegurar un nombre único y evitar conflictos.
        const imagePath = `user_uploads/${user.id}/images/${title
          .trim()
          .replace(/\s+/g, "-")}-${Date.now()}.${imageExtension}`; // Reemplaza espacios por guiones para la URL

        // Sube el archivo de imagen al bucket 'images' en Supabase Storage.
        // 'cacheControl': Establece la duración en segundos que el archivo puede ser cacheado por los navegadores/CDN (aquí 1 hora).
        // 'upsert: false': Significa que no sobrescribirá un archivo si ya existe con el mismo nombre en la misma ruta.
        const { data: imageData, error: imageUploadError } =
          await supabase.storage.from("images").upload(imagePath, image, {
            cacheControl: "3600",
            upsert: false,
          });

        // Comprueba si la subida de la imagen fue exitosa (no hubo error)
        if (!imageUploadError) {
          console.log("Imagen subida correctamente:", imageData); // Corregido: imageData
          // Si la subida fue exitosa, solicita la URL pública de la imagen recién subida.
          // Esta URL es permanente y se puede usar directamente para acceder al archivo.
          const { data: publicURLData } = supabase.storage
            .from("images")
            .getPublicUrl(imagePath); // Usa la misma ruta donde se subió el archivo

          // Verifica si se obtuvo una URL pública y si esta no está vacía/nula
          if (publicURLData && publicURLData.publicUrl) {
            tempPublicImageUrl = publicURLData.publicUrl; // Almacena la URL en una variable temporal para usarla más tarde en la DB
            console.log(
              "URL pública de la imagen obtenida:",
              tempPublicImageUrl
            );
          } else {
            // En caso de que la subida funcione, pero no se pueda obtener la URL pública (situación rara)
            console.error(
              "ERROR: No se pudo obtener la URL pública de la imagen ( publicUrl no existe)."
            );
          }
        } else {
          // Manejo de errores si la subida de la imagen falló
          console.error("Error al subir imagen:", imageUploadError);
          alert(`Error al subir la imagen: ${imageUploadError.message}`); // Usar template literals
        }
      } catch (imageErr) {
        // Captura cualquier excepción inesperada durante el proceso de subida de la imagen
        console.error("Excepción en la subida de imagen:", imageErr);
        alert(
          `Ocurrió un error inesperado al subir la imagen: ${imageErr.message}`
        ); // Usar template literals
      }
    }

    // --- TERCERA OPERACIÓN: Subir archivo de canción a Supabase Storage (Bucket 'songs') y obtener su URL pública ---
    if (song) {
      // Verifica si el usuario ha seleccionado un archivo de audio para la canción
      try {
        // Genera la extensión del archivo de audio (ej. "mp3", "wav", "ogg")
        const songExtension = song.name.split(".").pop();
        // Crea la ruta completa donde se guardará el archivo de audio en el bucket 'songs' de Storage.
        // Al igual que con la imagen, se usa el ID del usuario para organización,
        // el título de la canción (limpiado) y un timestamp (Date.now()) para asegurar un nombre único.
        const songPath = `user_uploads/${user.id}/songs/${title
          .trim()
          .replace(/\s+/g, "-")}-${Date.now()}.${songExtension}`; // Reemplaza espacios por guiones

        // Sube el archivo de audio al bucket 'songs' en Supabase Storage.
        // Evita sobrescribir un archivo si ya existe con el mismo nombre y ruta.
        const { data: songData, error: songUploadError } =
          await supabase.storage.from("songs").upload(songPath, song, {
            cacheControl: "3600",
            upsert: false,
          });

        // Comprueba si la subida del archivo de audio fue exitosa (no hubo error)
        if (!songUploadError) {
          console.log("Canción subida correctamente:", songData);

          // Si la subida fue exitosa, solicita la URL pública del archivo de audio recién subido.
          // Esta URL es permanente y permite acceder al archivo directamente desde un navegador o reproductor.
          const { data: publicURLData } = supabase.storage
            .from("songs")
            .getPublicUrl(songPath); // Usa la misma ruta donde se subió el archivo

          // Verifica si se obtuvo una URL pública válida (que no sea null y tenga la propiedad publicUrl)
          if (publicURLData && publicURLData.publicUrl) {
            tempPublicSongUrl = publicURLData.publicUrl; // Almacena la URL en una variable temporal para su posterior uso en la base de datos
            console.log(
              "URL pública de la canción obtenida:",
              tempPublicSongUrl
            );
          } else {
            // Problema al obtener su URL pública
            console.error(
              "ERROR: No se pudo obtener la URL pública de la canción (data es null o publicUrl no existe)."
            );
          }
        } else {
          // Si la subida del archivo de canción falló
          console.error("Error al subir canción:", songUploadError);
          alert(`Error al subir la canción: ${songUploadError.message}`); // Usar template literals
        }
      } catch (songErr) {
        // Erro que ocurra durante el proceso de subida del archivo de audio
        console.error("Excepción en la subida de canción:", songErr);
        alert(
          `Ocurrió un error inesperado al subir la canción: ${songErr.message}`
        ); // Usar template literals
      }
    }

    // --- CUARTA OPERACIÓN: ACTUALIZAR LA FILA EN LA TABLA 'songs' CON LAS URLS PÚBLICAS ---

    // Verifica si la primera operación fue exitosa y se obtuvo el 'songId' de la canción
    if (songId) {
      const updateData = {}; // Objeto vacio que contendra solo las columnas a actualizar.

      // Solo se añadirán las URLs al objeto 'updateData' si las dos URLs públicas están disponibles
      if (tempPublicImageUrl && tempPublicSongUrl) {
        // *** CAMBIO CLAVE AQUÍ: Usa 'image_path' y 'audio_path' ***
        updateData.image_path = tempPublicImageUrl;
        updateData.audio_path = tempPublicSongUrl;

        try {
          // Realiza la operación de actualización en la tabla 'songs'.
          // '.update(updateData)' envía solo las columnas presentes en 'updateData'.
          // '.eq("id", songId)' es fundamental: especifica que solo se debe actualizar
          // la fila cuyo 'id' coincida con el 'songId' que obtuvimos en la primera operación.
          const { error: updateError } = await supabase
            .from("songs")
            .update(updateData)
            .eq("id", songId); // Actualiza la fila correcta por su ID

          // Si no hubo errores durante la actualización de la base de datos
          if (!updateError) {
            console.log(
              "URLs de imagen y canción actualizadas correctamente en la base de datos." // Mensaje ajustado para reflejar que ambas se actualizaron
            );
            // Actualizar los estados de React (imageUrl, songUrl)
            // Para mostrar las URLs en la interfaz de usuario después de la subida.
            setImageUrl(tempPublicImageUrl);
            setSongUrl(tempPublicSongUrl);
            alert(
              "¡Canción, imagen y audio subidos y URLs guardadas con éxito!"
            );
          } else {
            // Si la actualización de la base de datos falló
            console.error("Error al actualizar URLs en DB:", updateError);
            alert(
              `Error al guardar las URLs en la base de datos: ${updateError.message}`
            ); // Usar template literals
          }
        } catch (updateErr) {
          // Errores durante la operación de actualización de la base de datos
          console.
          error("Excepción al actualizar URLs en DB:", updateErr);
          alert(
            `Ocurrió un error inesperado al actualizar las URLs: ${updateErr.message}`
          ); // Usar template literals
        }
      } else {
        // Este bloque se ejecuta si la condición 'tempPublicImageUrl && tempPublicSongUrl' es falsa
        // Al menos una de las URLs (o ambas) no se obtuvieron correctamente.
        console.warn(
          "No se pudieron obtener ambas URLs (imagen y canción) para la actualización completa en la DB."
        );
        alert(
          "¡Canción base subida, pero faltó la imagen, el audio, o ambos. No se pudieron vincular las URLs en la base de datos."
        );
      }
    } else {
      // Este bloque se ejecuta si la inserción inicial de la canción (Título, Artista, user_id)
      // falló y, por lo tanto, no se pudo obtener un 'songId' válido.
      // Sin un 'songId', no es posible vincular los archivos multimedia a una entrada en la base de datos.
      console.error(
        "No se pudo obtener el ID de la canción, por lo tanto, no se pudieron actualizar las URLs."
      );
      alert(
        "Hubo un problema crítico en la subida. Por favor, revisa la consola para más detalles."
      );
    }
    // FINAL
    // Limpiar el formulario
    setTitle("");
    setArtist("");
    setImage(null); // Limpiar el archivo File
    setSong(null); // Limpiar el archivo File
    e.target.reset(); // Esto reseteará los inputs de tipo file visualmente
    setImageUrl("");
    setSongUrl("");
  };

  //DROPZONE
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const onDropSong = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSong(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps: getSongRootProps, // Renombrado para evitar conflicto
    getInputProps: getSongInputProps, // Renombrado para evitar conflicto
    isDragActive: isSongDragActive, // Renombrado para evitar conflicto
  } = useDropzone({
    onDrop: onDropSong,
    accept: {
      "audio/*": [".mp3", ".wav", ".ogg", ".flac"], // Tipos de audio comunes
    },
    multiple: false,
  });
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row justify-center w-[100vw] items-center gap-4 text-white lg:flex-row lg:max-w-6xl lg:mx-auto lg:p-8 lg:bg-neutral-800 lg:rounded-xl lg:shadow-2xl"
      >
        <div className="flex gap-2 lg:flex-row lg:gap-6">
          {/* Dropzone para la Portanada */}

          <div
            className="border w-44 h-44 flex justify-center items-center text-center lg:w-64 lg:h-64 lg:border-2 lg:border-dashed lg:border-neutral-600 lg:rounded-lg lg:cursor-pointer lg:hover:border-[#FF7000] lg:transition-colors lg:duration-200"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {image ? (
              <img src={URL.createObjectURL(image)} alt="" className="lg:w-full lg:h-full lg:object-cover lg:rounded-lg" />
            ) : (
              <div className="flex flex-col text-center items-center gap-1 lg:text-neutral-400 lg:group-hover:text-[#FF7000] lg:transition-colors">
                <CiImageOn className="w-[10vw] h-[10vw] lg:w-24 lg:h-24 lg:mb-2" />
                <p className="lg:text-base lg:font-medium">Add new cover</p>
              </div>
            )}
          </div>

          {/* Dropzone para la CANCIÓN */}
          <div
            className="border w-44 h-44 flex justify-center items-center text-center lg:w-64 lg:h-64 lg:border-2 lg:border-dashed lg:border-neutral-600 lg:rounded-lg lg:cursor-pointer lg:hover:border-[#FF7000] lg:transition-colors lg:duration-200"
            {...getSongRootProps()} // Usa las props del Dropzone de canción
          >
            <input {...getSongInputProps()} />{" "}
            {song ? ( // Si ya hay una canción seleccionada, muestra su nombre
              <p className="break-words text-sm text-center px-2 lg:text-base lg:font-medium lg:px-4 lg:text-[#FF7000]">
                {song.name}
              </p>
            ) : (
              // Si no hay canción, muestra el icono y el texto de arrastre
              <div className="flex flex-col text-center items-center gap-1 lg:text-neutral-400 lg:group-hover:text-green-400 lg:transition-colors">
                {isSongDragActive ? ( // Muestra mensaje diferente si se arrastra un archivo
                  <p className="lg:text-base lg:font-medium">Drop the song...</p>
                ) : (
                  <>
                    {" "}
                    {/* Fragmento para agrupar icono y párrafo */}
                    <FaMusic className="w-[10vw] h-[10vw] lg:w-24 lg:h-24 lg:mb-2" />{" "}
                    {/* Icono de música */}
                    <p className="lg:text-base lg:font-medium">Add song</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col text-white w-[90vw] lg:w-auto lg:flex-1 lg:space-y-4">
          <label className="font-bold lg:block lg:text-sm lg:font-semibold lg:text-neutral-300 lg:mb-1">Song tittle</label>
          <input
            required
            type="text"
            name="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="lg:w-full lg:p-3 lg:bg-neutral-700 lg:rounded-md lg:text-white lg:border lg:border-neutral-600 lg:focus:border-[#FF7000] lg:focus:ring lg:focus:ring-[#FF7000] lg:focus:ring-opacity-50 lg:transition-all lg:duration-200"
          />
          <hr className="opacity-65 mb-3 lg:hidden" />
          <label className="font-bold lg:block lg:text-sm lg:font-semibold lg:text-neutral-300 lg:mb-1">Main artist(s) </label>
          <input
            required
            type="text"
            name="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="lg:w-full lg:p-3 lg:bg-neutral-700 lg:rounded-md lg:text-white lg:border lg:border-neutral-600 lg:focus:border-[#FF7000] lg:focus:ring lg:focus:ring-[#FF7000] lg:focus:ring-opacity-50 lg:transition-all lg:duration-200"
          />
          <hr className="opacity-65 lg:hidden" />
          <p className="font-extralight opacity-65 mb-3 lg:text-xs lg:text-neutral-500 lg:mt-1">
            Tip: Use commas to add multiple artist names.
          </p>

        </div>
        <button
          className="bg-[#FF7000] p-2 px-3 rounded-sm lg:py-3 lg:px-6 lg:rounded-lg lg:font-bold lg:text-lg text-white hover:bg-[#FF2200] lg:transition-all lg:duration-300 lg:self-center"
          type="submit"
        >
          Upload
        </button>
      </form>
    </>
  );
};

export default Uploads;