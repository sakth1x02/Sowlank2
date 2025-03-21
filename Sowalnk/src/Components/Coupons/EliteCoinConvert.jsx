import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, convertEliteCoinsToCoupon } from "../../store/user-slice";
import { CheckCircle } from "lucide-react";
const EliteCoinConvert = () => {
  const dispatch = useDispatch();
  const { users, loggedInUser } = useSelector((store) => store.user);
  const loggedInUserData = users.find((user) => user._id === loggedInUser._id);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const handleCopyCode = () => {
    navigator.clipboard.writeText("FLAT1000");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (!loggedInUserData) {
    return <p>Loading...</p>;
  }
  const COUPON_COST = 5;
  // Function to handle conversion
  const handleConvert = async () => {
    if (loggedInUserData?.eliteCouponCards.length >= 1) {
      toast.warning("You can only have 1 Elite Coupon at a time!");
      return;
    }

    if (loggedInUserData?.eliteCoins < COUPON_COST) {
      toast.error("Not enough Elite Coins! You need at least 5.");
      return;
    }

    // Deduct 1000 coins and add a new coupon
    try {
      await dispatch(
        convertEliteCoinsToCoupon({ userId: loggedInUserData._id })
      ).unwrap();
      toast.success("Successfully redeemed a ₹1000 coupon!");
    } catch (error) {
      console.error("Error converting elite coins:", error);
      toast.error("Error converting elite coins. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Elite Coin Convert
      </h1>

      {/* Display Elite Coin Balance */}
      <div className="text-center mb-6 flex justify-center items-center gap-5">
        <p className="text-lg">Your Balance:</p>
        <p className="text-2xl font-bold">
          👑 {loggedInUserData?.eliteCoins} Elite Coins
        </p>
      </div>

      {/* Convert Button */}
      <div className="text-center">
        <button
          onClick={handleConvert}
          disabled={
            loggedInUserData?.eliteCouponCards.length >= 1 ||
            loggedInUserData?.eliteCoins < COUPON_COST
          }
          className={`px-6 py-2 text-white font-semibold rounded-lg ${
            loggedInUserData?.eliteCouponCards.length >= 1 ||
            loggedInUserData?.eliteCoins < COUPON_COST
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-500"
          }`}
        >
          Redeem ₹1000 Coupon(5 Elite Coins)
        </button>
      </div>

      {/* Display Coupons */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-1 gap-6">
        {loggedInUserData?.eliteCouponCards.map((coupon, index) => (
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
                    FLAT<span className="font-bold">₹1000 OFF</span>
                  </h2>
                  <div className="flex items-center ml-2 gap-1 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Verified</span>
                  </div>
                </div>
                <p className="text-gray-700 md:text-lg">
                  Grab Flat Rs 1000 OFF on your orders
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
                        <span className="font-bold md:text-lg">FLAT1000</span>
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

      {/* Show a message if they have no coupons */}
      {loggedInUserData?.eliteCouponCards.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          You haven't redeemed any coupons yet.
        </p>
      )}
    </div>
  );
};

export default EliteCoinConvert;
