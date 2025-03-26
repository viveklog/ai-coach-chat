import { motion as Motion } from "framer-motion";

const LoadingAnimation = () => {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A8"];

  return (
    <div className="relative flex gap-4">
      {colors.map((color, index) => (
        <Motion.div
          key={index}
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
        />
      ))}
    </div>
  );
};

export default LoadingAnimation;
