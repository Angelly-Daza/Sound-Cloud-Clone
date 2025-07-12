import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

export const useLikes = (songId) => {
  const user = useUser();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const checkLiked = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("Likes")
        .select("*")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .single();

      setLiked(!!data);
    };

    checkLiked();
  }, [songId, user]);

  const toggleLike = async () => {
    if (!user) return;

    if (liked) {
      await supabase
        .from("Likes")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", songId);
      setLiked(false);
    } else {
      await supabase.from("Likes").insert([
        {
          user_id: user.id,
          song_id: songId,
        },
      ]);
      setLiked(true);
    }
  };

  return { liked, toggleLike };
};
