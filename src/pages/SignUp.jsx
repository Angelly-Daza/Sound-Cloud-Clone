import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { FaSoundcloud } from "react-icons/fa6";
import { CiCircleAlert } from "react-icons/ci";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [full_name, setFull_name] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();


    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Error en registro:", authError.message);
      alert("No se pudo registrar el usuario.");
      return;
    }

    const userId = authData.user?.id;
    if (!userId) return;


    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: userId,
        full_name,
        username,
        bio,
      },
    ]);

    if (profileError) {
      console.error("Error creando perfil:", profileError.message);
      alert("Registro exitoso, pero no se pudo crear el perfil.");
    }

    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
      <FaSoundcloud className="text-9xl text-neutral-600 mb-4" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input
          type="text"
          placeholder="Full name"
          className="p-2 rounded bg-neutral-800 placeholder-neutral-400"
          value={full_name}
          onChange={(e) => setFull_name(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          className="p-2 rounded bg-neutral-800 placeholder-neutral-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <textarea
          placeholder="Bio (optional)"
          className="p-2 rounded bg-neutral-800 placeholder-neutral-400"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded bg-neutral-800 placeholder-neutral-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded bg-neutral-800 placeholder-neutral-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p className="text-neutral-400 flex gap-3 "> <CiCircleAlert /><span className="-mt-1">Password must be at least 6 characters</span></p>

        <button
          type="submit"
          className="bg-[#FFB88B] text-black rounded py-2 font-semibold hover:bg-[#FF6500] transition"
        >
          Sign Up
        </button>
      </form>
      <p className="text-neutral-400 mr-4 ml-10">Please check your email to confirm your registration.</p>
      <button
        onClick={() => navigate("/login")}
        className="mt-4 text-sm text-[#FF6500] hover:text-white"
      >
        Already have an account? Log In
      </button>
    </div>
  );
};

export default SignUp;
