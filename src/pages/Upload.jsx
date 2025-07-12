import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Uploads from "../components/Uploads";

const Upload = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <main className="p-4 mt-6">
        <h1 className="text-2xl font-bold mb-4">Upload your music</h1>
        <Uploads />
      </main>

      <div className="fixed bottom-0 left-0 w-full z-50">
        <NavBar />
      </div>
    </div>
  );
};

export default Upload;
