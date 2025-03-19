import { motion as Motion } from 'framer-motion';
import {useNavigate} from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed w-full top-0 bg-white/80 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <span className="text-2xl font-bold text-blue-600">AI Coach</span>
          </Motion.div>
          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors" onClick={()=>navigate("/auth")}>
              Login
            </button>
          </Motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;