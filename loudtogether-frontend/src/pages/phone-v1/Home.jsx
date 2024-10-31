import { Link } from "react-router-dom";
import Background from "../../components/Background";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto text-gray-800 min-h-screen flex flex-col rounded-[2rem] overflow-hidden relative p-4 md:p-8">
      {/* Background Design */}
      <Background />

      {/* Content */}
      <div className="flex flex-col lg:flex-row justify-center items-center lg:px-16 px-4 py-8 lg:py-16 relative z-10 gap-10 lg:gap-16">
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <img
            src="/img/loudpng-ai.png"
            alt="LoudTogether Logo"
            className="w-2/3 sm:w-1/2 lg:w-full max-w-md mb-4 lg:mb-8"
          />
          <div className="flex items-center gap-4 mb-4 lg:mb-8">
            <img
              src="/img/logo1.png"
              alt="LoudTogether Logo"
              className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16"
            />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
              LoudTogether
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 lg:mb-8 max-w-lg">
            Connect and collaborate in real-time
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col gap-4">
          <Link to="/create" className="block w-full">
            <button className="bg-gradient-to-r from-[#17D9A3] to-[#15c795] text-white rounded-full py-3 lg:py-5 px-6 lg:px-10 text-center font-semibold text-lg lg:text-2xl shadow-lg transition-all duration-200 hover:scale-105 w-56 md:w-72 lg:w-80">
              Create Session
            </button>
          </Link>
          <Link to="/join" className="block w-full">
            <button className="bg-gradient-to-r from-[#17D9A3] to-[#15c795] text-white rounded-full py-3 lg:py-5 px-6 lg:px-10 text-center font-semibold text-lg lg:text-2xl shadow-lg transition-all duration-200 hover:scale-105 w-56 md:w-72 lg:w-80">
              Join Session
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
