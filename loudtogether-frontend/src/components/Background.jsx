// Background.jsx

const Background = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#17D9A3] to-[#15c795] opacity-10"></div>
    </div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45">
      <div className="w-[500px] h-[500px] rounded-[100px] bg-gradient-to-tr from-[#17D9A3] to-[#15c795] opacity-5"></div>
    </div>
  </div>
);

export default Background;
