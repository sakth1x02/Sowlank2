import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, convertGoldCoinsToCoupon } from "../../store/user-slice";
import { CheckCircle } from "lucide-react";
const GoldCoinConvert = () => {
  const dispatch = useDispatch();
  const { users, loggedInUser } = useSelector((store) => store.user);
  const loggedInUserData = users.find((user) => user._id === loggedInUser._id);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("FLAT500");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (!loggedInUserData) {
    return <p>Loading...</p>;
  }

  // Cost of one coupon card in normal coins
  const COUPON_COST = 5;

  // Function to handle coin conversion
  const handleConvertCoins = async () => {
    if (loggedInUserData?.goldCouponCards.length >= 5) {
      toast.warning("You can only have 5 coupons at a time!");
      return;
    }

    if (loggedInUserData?.goldCoins < COUPON_COST) {
      toast.warning("Not enough gold coins to convert.");
      return;
    }

    // Deduct coins and generate a new coupon card
    try {
      await dispatch(
        convertGoldCoinsToCoupon({ userId: loggedInUserData._id })
      ).unwrap();
      toast.success("Coupon card generated successfully!");
    } catch (error) {
      console.error("Error generating coupon card:", error);
      toast.error("Error generating coupon card. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Gold Coin Convert</h1>

      {/* Display available normal coins */}
      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <p className="text-lg font-semibold text-blue-800">
          Available Gold Coins: {loggedInUserData?.goldCoins || 0}
        </p>
      </div>

      {/* Convert button */}
      <div className="text-center mb-6">
        <button
          onClick={handleConvertCoins}
          className={`bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors ${
            loggedInUserData?.goldCouponCards.length >= 5 ||
            loggedInUserData?.goldCoins < COUPON_COST
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          Convert to Coupon Card ({COUPON_COST} Coins)
        </button>
      </div>

      {/* Display generated coupon cards */}
      <div className="grid grid-cols-1  gap-4">
        {loggedInUserData?.goldCouponCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 w-full lg:w-[80%] ml-auto  border rounded-lg shadow-md bg-gray-100 space-y-8 py-10"
          >
            <div className="px-6">
              <div className="flex flex-col justify-between mb-4 gap-4">
                <div className="flex justify-between items-center gap-2 mb-2">
                  <h2 className="md:text-3xl text-xl font-medium text-gray-700">
                    FLAT<span className="font-bold">₹500 OFF</span>
                  </h2>
                  <div className="flex items-center ml-2 gap-1 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Verified</span>
                  </div>
                </div>
                <p className="text-gray-700 md:text-lg">
                  Grab Flat Rs 500 OFF on your orders
                </p>

                <div className="flex items-center gap-2 justify-end text-sm md:text-base">
                  {showCode ? (
                    <div className="flex">
                      <button
                        onClick={handleCopyCode}
                        className="rounded-r-none text-white bg-blue-500 hover:bg-blue-600 h-12 px-2 md:px-6"
                      >
                        {copied ? "COPIED!" : "COPY"}
                      </button>
                      <div className="border border-dashed border-gray-300 flex items-center justify-center px-2 md:px-6 h-12 rounded-r-md bg-white">
                        <span className="font-bold md:text-lg">FLAT500</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCode(true)}
                      className="bg-blue-500 rounded-lg hover:bg-blue-600 h-12 text-white px-6"
                    >
                      SHOW COUPON CODE
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Message when maximum cards are reached */}
      {loggedInUserData?.goldCouponCards.length >= 5 && (
        <p className="text-center text-gray-600 mt-6">
          You have reached the maximum number of coupon cards.
        </p>
      )}
    </div>
  );
};

export default GoldCoinConvert;
