import PropTypes from "prop-types";
import { Music, MessageSquare, Camera, Settings } from "lucide-react";

const AppIcon = ({ Icon, gradient }) => (
  <div
    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${gradient}`}
  >
    <Icon size={20} color="white" strokeWidth={1.5} />
  </div>
);

const AppDock = () => {
  return (
    <div className="">
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-1 shadow-lg border border-white/30">
        <div className="flex justify-around items-center">
          <AppIcon
            Icon={Music}
            gradient="bg-gradient-to-br from-pink-500 to-purple-600"
          />
          <AppIcon
            Icon={MessageSquare}
            gradient="bg-gradient-to-br from-green-400 to-blue-500"
          />
          <AppIcon
            Icon={Camera}
            gradient="bg-gradient-to-br from-yellow-400 to-orange-500"
          />
          <AppIcon
            Icon={Settings}
            gradient="bg-gradient-to-br from-gray-400 to-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

AppIcon.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  gradient: PropTypes.string.isRequired,
};

AppIcon.displayName = "AppIcon";

export default AppDock;
