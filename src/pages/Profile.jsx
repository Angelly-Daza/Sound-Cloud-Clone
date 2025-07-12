import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ProfileHeaderContent from "../components/ProfileHeader";

const Profile = () => {
    const user = useUser();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (fetchError) {
                console.error("Error fetching profile:", fetchError);

                if (fetchError.code === 'PGRST116') {
                    setError("Perfil no encontrado. ¿Has iniciado sesión con un usuario nuevo? Intenta registrar uno.");
                } else {
                    setError("Error al cargar el perfil: " + fetchError.message);
                }
                setProfile(null);
            } else {
                setProfile(data);
            }
            setLoading(false);
        };

        fetchProfile();
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
                <p>You must log in to view your profile..</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white mt-11">
            <div className="p-4 pb-28">
                {loading ? (
                    <p className="text-neutral-400 text-center mt-8">Loading profile data...</p>
                ) : error ? (
                    <p className="text-red-500 text-center mt-8">{error}</p>
                ) : profile ? (
                    <>

                        <ProfileHeaderContent profile={profile} />

                        <div className="bg-neutral-900 p-4 rounded-xl mt-4">
                            <h3 className="text-lg font-semibold mb-2">
                                Member details</h3>

                            <p><span className="font-semibold">Member since:</span> {new Date(profile.created_at).toLocaleDateString()}</p>

                        </div>


                        <div className="bg-neutral-900 p-4 rounded-xl mt-4">
                            <h3 className="text-lg font-semibold mb-2">Activity</h3>
                            <p className="text-neutral-400">Seems a little quiet over here.</p>
                            <button 
                            onClick={() => navigate("/upload")}
                            className=" mt-2 bg-white text-black font-semibold px-3 py-1 rounded-lg border border-black hover:bg-black hover:text-white hover:transition-all duration-300 cursor-pointer">Upload now</button>
                        </div>
                    </>
                ) : (
                    <p className="text-neutral-400 text-center mt-8">
                        No profile data found.
                    </p>
                )}
            </div>

            <NavBar />
        </div>
    );
};

export default Profile;