import React from "react";
import About from "./About";
import Feature from "./Feature";
import Subscription from "./Subscription";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.user.loggedInUser);
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

          <section className="bg-violet-200 text-black py-16 lg:py-32 rounded-lg">
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
