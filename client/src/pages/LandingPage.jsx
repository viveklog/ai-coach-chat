import { motion as Motion} from 'framer-motion';
import Navbar from '../components/landing/Navbar';
import ParticlesBackground from '../components/landing/ParticlesBackground';
import AIAnimation from '../components/landing/AIAnimation';
import { useNavigate } from "react-router-dom";


export default function LandingPage (){
  const navigate = useNavigate();
    return (
        <div className="relative min-h-screen overflow-hidden">
      <ParticlesBackground />
      <Navbar />
      
      <main className="relative pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[calc(100vh-4rem)] items-center">
            {/* Left Content */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-5xl font-bold text-gray-900">
                Begin Your AI Learning Journey
              </h1>
              <p className="text-xl text-gray-600">
                Embark on a transformative learning experience with your personal AI coach. 
                Master new skills, unlock your potential, and shape your future in tech.
              </p>
              <Motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick ={()=>navigate("/auth")}
                className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Learning
              </Motion.button>
            </Motion.div>

            {/* Right Animation */}
            <Motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block"
            >
              <AIAnimation />
            </Motion.div>
          </div>
        </div>
      </main>
    </div>
    )
}