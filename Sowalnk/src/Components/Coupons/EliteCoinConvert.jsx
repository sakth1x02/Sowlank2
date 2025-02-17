import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const EliteCoinConvert = () => {
  // Load Elite Coins and Coupons from localStorage
  const [eliteCoins, setEliteCoins] = useState(
    () => parseInt(localStorage.getItem("eliteCoins")) || 2000
  );
  const [eliteCoupons, setEliteCoupons] = useState(
    () => JSON.parse(localStorage.getItem("eliteCoupons")) || []
  );

  // Function to handle conversion
  const handleConvert = () => {
    if (eliteCoupons.length >= 1) {
      toast.warning("You can only have 1 Elite Coupon at a time!");
      return;
    }

    if (eliteCoins < 1000) {
      toast.error("Not enough Elite Coins! You need at least 1000.");
      return;
    }

    // Deduct 1000 coins and add a new coupon
    setEliteCoins((prev) => prev - 1000);
    setEliteCoupons([
      { description: "₹1000 Discount Coupon for Food or Products" },
    ]);
    toast.success("Successfully redeemed a ₹1000 coupon!");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Elite Coin Convert
      </h1>

      {/* Display Elite Coin Balance */}
      <div className="text-center mb-6 flex justify-center items-center gap-5">
        <p className="text-lg">Your Balance:</p>
        <p className="text-2xl font-bold">👑 {eliteCoins} Elite Coins</p>
      </div>

      {/* Convert Button */}
      <div className="text-center">
        <button
          onClick={handleConvert}
          disabled={eliteCoupons.length >= 1 || eliteCoins < 1000}
          className={`px-6 py-2 text-white font-semibold rounded-lg ${
            eliteCoupons.length >= 1 || eliteCoins < 1000
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-500"
          }`}
        >
          Redeem ₹1000 Coupon
        </button>
      </div>

      {/* Display Coupons */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-1 gap-6">
        {eliteCoupons.map((coupon, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border rounded-lg shadow-md bg-gray-100"
          >
            <p className="text-lg font-semibold">🎟 ₹1000 Coupon</p>
            <p className="text-gray-700 text-sm">{coupon.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Show a message if they have no coupons */}
      {eliteCoupons.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          You haven't redeemed any coupons yet.
        </p>
      )}
    </div>
  );
};

export default EliteCoinConvert;
