// StatusBar.jsx
import { Battery, Wifi, Signal } from "lucide-react";
import Clock from "./Clock";

const StatusBar = () => (
  <div className="flex justify-between items-center px-6 py-2 text-sm bg-gray-100 relative z-10">
    <Clock />
    <div className="absolute left-1/2 top-1 w-24 h-6 bg-black rounded-full transform -translate-x-1/2"></div>
    <div className="flex items-center space-x-2">
      <Signal size={14} />
      <Wifi size={14} />
      <Battery size={14} />
    </div>
  </div>
);

export default StatusBar;
