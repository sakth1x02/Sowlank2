import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../store/user-slice";
const NormalCoinConvert = () => {
  // State for normal coins and coupon cards
  const { users, loggedInUser } = useSelector((store) => store.user);
  const loggedInUserData = users.find((user) => user._id === loggedInUser._id);
  console.log(loggedInUserData);
  const [normalCoins, setNormalCoins] = useState(1);
  const [couponCards, setCouponCards] = useState([]);
  const dispatch = useDispatch();
  //There this loggesInUserData getting undefined value need to fix it
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  // Cost of one coupon card in normal coins
  const COUPON_COST = 5;

  // Function to handle coin conversion
  const handleConvertCoins = () => {
    if (couponCards.length >= 2) {
      toast.warning("You can only have 2 coupons at a time!");
      return;
    }

    if (normalCoins < COUPON_COST) {
      toast.warning("Not enough normal coins to convert.");
      return;
    }

    // Deduct coins and generate a new coupon card
    setNormalCoins((prevCoins) => prevCoins - COUPON_COST);
    setCouponCards((prevCards) => [
      ...prevCards,
      `Coupon Card ${prevCards.length + 1}`,
    ]);
    toast.success("Coupon card generated successfully!");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Normal Coin Convert
      </h1>

      {/* Display available normal coins */}
      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <p className="text-lg font-semibold text-blue-800">
          Available Normal Coins: {normalCoins}
        </p>
      </div>

      {/* Convert button */}
      <div className="text-center mb-6">
        <button
          onClick={handleConvertCoins}
          className={`bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors ${
            couponCards.length >= 2 || normalCoins < COUPON_COST
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          Convert to Coupon Card ({COUPON_COST} Coins)
        </button>
      </div>

      {/* Display generated coupon cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {couponCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border rounded-lg shadow-md bg-gray-100 space-y-8 py-10"
          >
            <p className="text-xl font-semibold text-green-800">{card}</p>
            <p className="text-sm text-gray-600">Redeemable for rewards</p>
          </motion.div>
        ))}
      </div>

      {/* Message when maximum cards are reached */}
      {couponCards.length >= 2 && (
        <p className="text-center text-gray-600 mt-6">
          You have reached the maximum number of coupon cards.
        </p>
      )}
    </div>
  );
};

export default NormalCoinConvert;
