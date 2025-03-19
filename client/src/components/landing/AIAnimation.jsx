import {motion as Motion} from 'framer-motion'

const AIAnimation = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <Motion.div
        className="w-64 h-64 bg-blue-500/20 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <Motion.div
        className="absolute w-48 h-48 bg-indigo-500/20 rounded-full"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <Motion.div
        className="absolute w-32 h-32 bg-purple-500/20 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default AIAnimation;