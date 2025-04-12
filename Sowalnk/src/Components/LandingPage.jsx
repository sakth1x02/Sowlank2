import React, { useEffect, useState } from "react";
import About from "./About";
import Feature from "./Feature";
import Subscription from "./Subscription";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.user.loggedInUser);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSignUp = () => {
    auth ? navigate("/dashboard") : navigate("/login");
  };

  return (
    <div>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-violet-700 mb-6">
            Welcome to Sowalnk
          </h1>

          {/* Something Big is Brewing Section */}
          <section className="py-20 rounded-t-lg bg-gradient-to-r from-purple-900 via-violet-800 to-purple-900 overflow-hidden">
            <div className="container mx-auto px-4 text-center relative">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10"
              >
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Something Big is Brewing...
                </h2>
                <p className="text-xl md:text-2xl text-purple-200 mb-8">
                  Stay Tuned for an Exciting Update!
                </p>

                <div className="flex justify-center items-center space-x-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </motion.div>

                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, -10, 10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 0.5,
                    }}
                    className="w-16 h-16 bg-violet-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </motion.div>

                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 1,
                    }}
                    className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: 1, delay: 1 }}
                  className="mt-12"
                >
                  {/* <button className="px-8 py-4 bg-white text-purple-900 rounded-full font-bold text-lg shadow-lg hover:bg-purple-100 transition-all transform hover:scale-105">
                    Join the Waitlist
                  </button> */}
                </motion.div>
              </motion.div>

              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 bg-purple-400 rounded-full opacity-20"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -100, 0],
                      opacity: [0.2, 0.5, 0.2],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="bg-violet-200 text-black py-16 lg:py-32 rounded-b-lg">
            <div className="container mx-auto text-center px-4">
              <h1 className="text-3xl lg:text-5xl font-bold mb-6">
                Master Your Day with Sowalnk
              </h1>
              <p className="text-base lg:text-xl mb-8">
                A to-do list app that adapts to your productivity level—whether
                you're keeping it simple or aiming higher.
              </p>
              <button
                onClick={scrollToSignUp}
                className="px-6 lg:px-8 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
              >
                Get Started
              </button>
            </div>
          </section>
        </div>

        {/* About Section */}
        <div className="mt-8">
          <About />
        </div>

        {/* Feature Section */}
        <div className="mt-8">
          <Feature />
        </div>

        {/* Subscription Section */}
        <div className="mt-8">{auth && <Subscription />}</div>
      </div>
    </div>
  );
};

export default LandingPage;
