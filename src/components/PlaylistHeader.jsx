const PlaylistHeader = ({ coverUrl, name, description }) => {
  return (
    <div className="relative w-[80%] h-[350px] mb-6 mt-6 overflow-hidden lg:flex lg:items-end lg:h-[420px] lg:mb-8 lg:p-5 items-start lg:bg-gradient-to-r lg:from-neutral-800 lg:via-neutral-700 lg:to-neutral-600 justify-between">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent lg:hidden" />
      <div className="absolute bottom-0 left-0 p-4 lg:static lg:p-0 lg:flex lg:flex-col lg:justify-start lg:h-full lg:text-left">
        <h1 className="text-3xl font-bold text-white lg:text-5xl lg:mb-2">
          {name}
        </h1>
        <p className="text-neutral-300 lg:text-lg lg:max-w-3xl lg:text-neutral-200">
          {description}
        </p>
      </div>
      <img
        src={coverUrl}
        alt={name}
        className="w-full h-full -mb-2 object-cover lg:w-[400px] rounded-md lg:h-[400px] lg:object-cover"
      />
    </div>
  );
};

export default PlaylistHeader;
