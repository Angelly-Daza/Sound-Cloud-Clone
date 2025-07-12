import React from 'react';

const ProfileHeaderContent = ({ profile }) => {
  if (!profile) return null; 

  return (
    <div className="relative w-full h-40 bg-gradient-to-r from-[#8A777D] to-[#541981] rounded-b-lg overflow-hidden">

      <div className="absolute inset-0">
       
      </div>

      <div className="absolute bottom-0 left-0 p-4 flex items-end w-full">
        
        <div className="w-24 h-24 bg-neutral-600 rounded-full flex items-center justify-center border-4 border-[#121212] z-10 overflow-hidden">
         
          <span className="text-4xl text-white font-bold">{profile.username ? profile.username[0].toUpperCase() : ''}</span>
        </div>

        <div className="ml-4 flex-1 text-white pb-2 pl-2">
          <h2 className="text-3xl font-bold mb-1">{profile.full_name || "Nombre Completo"}</h2>
          <p className="text-neutral-300 text-lg">@{profile.username || "usuario"}</p>
          <p className="text-neutral-400 text-sm mt-1">{profile.bio || null}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderContent;