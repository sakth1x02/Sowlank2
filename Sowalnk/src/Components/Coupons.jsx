import React from "react";
import { motion } from "framer-motion";

const Coupons = () => {
  const coinTypes = [
    {
      type: "Normal Coins",
      description: "Basic coins for everyday rewards",
      color: "bg-blue-500",
      icon: "🪙",
      amount: "1",
    },
    {
      type: "Gold Coins",
      description: "Premium currency for special items",
      color: "bg-yellow-500",
      icon: "💰",
      amount: "500",
    },
    {
      type: "Elite Coins",
      description: "Exclusive currency for rare items",
      color: "bg-purple-500",
      icon: "👑",
      amount: "100",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Coin Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coinTypes.map((coin, index) => (
          <motion.div
            key={coin.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl shadow-lg overflow-hidden"
          >
            <div className={`${coin.color} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <span className="text-4xl">{coin.icon}</span>
                <h2 className="text-2xl font-bold">{coin.type}</h2>
              </div>
              <p className="mt-2 text-sm opacity-90">{coin.description}</p>
            </div>

            <div className="bg-white p-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Available Balance</span>
                <span className="text-2xl font-bold">{coin.amount}</span>
              </div>
              <button className="mt-4 w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                Get More {coin.type}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Coupons;
