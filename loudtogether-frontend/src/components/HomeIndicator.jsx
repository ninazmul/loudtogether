import { motion } from "framer-motion";
import { cn } from "../../@/lib/utils";

import PropTypes from "prop-types";

const HomeIndicator = ({
  className,
  width = "w-28",
  height = "h-[2px]",
  color = "bg-gray-300",
  animate = false,
  darkMode = false,
}) => {
  const baseClasses = cn(
    width,
    height,
    color,
    "rounded-full mx-auto mt-2 relative z-10",
    darkMode ? "shadow-lg" : "shadow-md",
    className
  );

  const animationVariants = {
    initial: { scaleX: 0.8, opacity: 0.7 },
    animate: {
      scaleX: [0.8, 1.1, 1],
      opacity: [0.7, 1, 0.9],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <motion.div
      className={baseClasses}
      initial={animate ? "initial" : false}
      animate={animate ? "animate" : false}
      variants={animationVariants}
      style={{
        background: darkMode
          ? "linear-gradient(90deg, rgba(75,85,99,1) 0%, rgba(107,114,128,1) 50%, rgba(75,85,99,1) 100%)"
          : undefined,
      }}
    />
  );
};

HomeIndicator.propTypes = {
  className: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  color: PropTypes.string,
  animate: PropTypes.bool,
  darkMode: PropTypes.bool,
};

export default HomeIndicator;
