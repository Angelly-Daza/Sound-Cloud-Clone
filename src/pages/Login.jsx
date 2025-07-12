import { useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaSoundcloud } from "react-icons/fa6";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Error al iniciar sesión:", error.message);
        alert("Credenciales incorrectas o usuario no registrado.");
        return;
      }

      console.log("Inicio de sesión exitoso:", data);
      navigate("/");
    } catch (err) {
      console.error("Error inesperado:", err.message);
      alert("Ocurrió un error al intentar iniciar sesión.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
       <FaSoundcloud className="text-9xl text-neutral-600 mb-4" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-2 rounded bg-neutral-800 placeholder-neutral-400"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="p-2 rounded bg-neutral-800 placeholder-neutral-400"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-[#FFB88B] text-black rounded py-2 font-semibold hover:bg-[#FF6500] transition "
        >
          Log In
        </button>
      </form>

      <button
        onClick={() => navigate("/signup")}
        className="mt-4 text-sm text-[#FF6500] hover:text-white"
      >
        Don't have an account? Sign up here
      </button>
    </div>
  );
};

export default Login;
