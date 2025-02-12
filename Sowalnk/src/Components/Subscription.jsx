import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIntermediateMember, setAdvanceMember } from "../store/ui-slice";
import { TriangleAlert } from "lucide-react";
const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(); // Track selected plan
  const dispatch = useDispatch();
  const { intermediateMember, advanceMember } = useSelector(
    (state) => state.ui
  );
  const plans = [
    {
      name: "BASIC",
      price: "Daily limits",
      features: [
        "Access to Daily Goals Only ",
        "Limited support",
        "Dark/Light Mode",
      ],
    },
    {
      name: "INTERMEDIATE",
      price: "₹750/year",
      features: [
        "Access upto Weekly Goals",
        "Set Theme as your wish",
        "By coupons,buy the nathan lights",
        "Progress",
      ],
    },
    {
      name: "ADVANCED",
      price: "₹1550/year",
      features: [
        "Remainders,Push Notification",
        "support team",
        "Access to all premium content",
        "Rewards with high products as coupons",
        "Streak Tracking",
      ],
    },
  ];

  const showFeatures = (planName) => {
    // Set the selected plan to show its features
    setSelectedPlan(planName);
  };

  const handleSubscribe = (planName) => {
    // Replace with actual navigation when the payment page is implemented
    if (planName === "INTERMEDIATE") {
      dispatch(setIntermediateMember(true));
    }
    if (planName === "ADVANCED") {
      dispatch(setAdvanceMember(true));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-purple-200 p-8">
      {/* Moving Advertisement */}
      <div className="w-full overflow-hidden bg-black text-white py-2 flex items-center justify-center">
        <div className="text-xl font-bold animate-marquee">
          🎉 Special Offer: Get 50% off on your first 3 months! 🎉
        </div>
      </div>

      <h1 className="text-4xl py-15 font-semibold text-gray-800 mt-8">
        Choose Your Plan
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8 max-w-7xl">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="p-8 rounded-lg shadow-xl text-center text-white bg-purple-600"
          >
            <h2 className="text-2xl font-semibold mb-3">{plan.name}</h2>
            <p className="text-lg mb-6">{plan.price}</p>
            <button
              onClick={() => showFeatures(plan.name)}
              className="bg-white text-gray-800 px-6 py-2 rounded-md hover:bg-gray-200 transition-all duration-300"
            >
              View Features
            </button>
          </div>
        ))}
      </div>

      {/* Display features of the selected plan */}
      {selectedPlan && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl place-items-center text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Features of {selectedPlan} Plan
          </h2>
          <ul className="list-disc list-inside text-lg text-gray-700">
            {plans
              .find((plan) => plan.name === selectedPlan)
              .features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
          </ul>
          {selectedPlan === "BASIC" && (
            <div className="my-3 place-items-center  py-3 bg-blue-100 text-blue-700 rounded-lg w-[50%]  border border-blue-500">
              Need to use Weekly, Monthly and Yearly Tasks
              <span
                className="flex gap-3 cursor-pointer"
                onClick={() => setSelectedPlan("INTERMEDIATE")}
              >
                <TriangleAlert /> Subscribe Now{" "}
              </span>
            </div>
          )}
          <button
            onClick={() => handleSubscribe(selectedPlan)}
            className={`mt-4 
           
            `}
          >
            <span
              className={` ${
                selectedPlan === "INTERMEDIATE"
                  ? "block  px-6 py-2 rounded-md  transition-all duration-300 "
                  : "hidden"
              }
              ${
                intermediateMember
                  ? " bg-white text-blue-600 border border-blue-600"
                  : " bg-blue-600 text-white hover:bg-blue-700"
              }
              `}
            >
              Subscribe Now
            </span>
            <span
              className={` ${
                selectedPlan === "ADVANCED"
                  ? "block px-6 py-2 rounded-md  transition-all duration-300 "
                  : "hidden"
              }
              ${
                advanceMember
                  ? " bg-white text-blue-600 border border-blue-600"
                  : " bg-blue-600 text-white hover:bg-blue-700"
              }
              `}
            >
              Subscribe Now
            </span>
          </button>
          <button
            onClick={() => setSelectedPlan(null)}
            className="mt-4 ml-4 bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-all duration-300"
          >
            Close
          </button>
        </div>
      )}

      {/* Add CSS for the marquee animation */}
      <style jsx="true">{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Subscription;
