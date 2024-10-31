const SplashScreen = () => (
  <div className="max-w-7xl mx-auto text-gray-800 min-h-screen flex flex-col rounded-[2rem] overflow-hidden relative p-4 md:p-8">
    <div className="flex-grow flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#17D9A3] border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
        <div className="text-2xl font-semibold text-[#17D9A3]">Loading...</div>
      </div>
    </div>
  </div>
);

export default SplashScreen;
