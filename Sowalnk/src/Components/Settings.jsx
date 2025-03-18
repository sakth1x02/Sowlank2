import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Trophy,
  Coins,
  Star,
  Calendar,
  Clock,
  Mail,
  User,
  Shield,
  Zap,
} from "lucide-react";
import { motion, animate } from "framer-motion";
import { fetchUsers } from "../store/user-slice";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
const CountUp = ({ value, duration = 2, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      onUpdate: (latest) => {
        setDisplayValue(Math.floor(latest));
      },
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [value, duration]);

  return <span className={className}>{displayValue}</span>;
};

const Settings = () => {
  const authData = useSelector((state) => state.user.loggedInUser);
  const users = useSelector((state) => state.user.users);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers()).then(() => setIsLoading(false));
  }, [dispatch]);

  const auth = users.find((user) => user._id === authData._id);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    isNumber = false,
    prefix = "",
    suffix = "",
    className = "",
    onClick,
  }) => (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`bg-white rounded-xl p-6 shadow-sm backdrop-blur-sm bg-opacity-90 ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-semibold text-gray-900">
            {prefix}
            {isNumber ? <CountUp value={value} /> : value}
            {suffix}
          </p>
        </div>
      </div>
    </motion.div>
  );

  if (isLoading || !auth) {
    return (
      <Loader className="w-10 h-10 text-purple-700  animate-spin mx-auto" />
    ); // Show a loading spinner while data is being fetched
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Profile Header */}
      <motion.div
        variants={item}
        className="bg-white rounded-2xl p-8 mb-8 shadow-lg backdrop-blur-sm bg-opacity-90 border border-gray-100"
      >
        <div className="md:flex md:items-center gap-6 place-items-center space-y-6">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              auth.name
            )}&background=random`}
            alt={auth.name}
            className="w-24 h-24 rounded-full ring-4 ring-green-300 shadow-xl"
          />
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent"
            >
              {auth.name}
            </motion.h1>
            <div className="flex items-center gap-2 text-gray-500 mt-1">
              <Mail className="w-4 h-4" />
              <span>{auth.email}</span>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800 shadow-sm"
              >
                <Shield className="w-4 h-4 mr-1" /> Verified Account
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm"
              >
                <Zap className="w-4 h-4 mr-1" /> {auth.authMethod} Login
              </motion.span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        <StatCard
          icon={Trophy}
          title="Total Points"
          value={auth.totalPoints}
          isNumber={true}
          className="border-l-4 border-blue-500"
          onClick={() => navigate("/rankings")}
        />
        <StatCard
          icon={Star}
          title="Current Streak"
          value={auth.streak}
          isNumber={true}
          suffix=" days"
          className="border-l-4 border-yellow-500"
          onClick={() => navigate("/dashboard")}
        />
        <StatCard
          icon={Coins}
          title="Normal Coins"
          value={auth.normalCoins}
          isNumber={true}
          className="border-l-4 border-green-500"
          onClick={() => navigate("/coupons")}
        />
      </motion.div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          variants={item}
          className="bg-white rounded-xl p-6 shadow-lg backdrop-blur-sm bg-opacity-90 border border-gray-100"
        >
          <h2 className="text-xl font-semibold mb-4">Points Breakdown</h2>
          <div className="space-y-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="flex justify-between items-center"
            >
              <span className="text-gray-600">Positive Points</span>
              <span className="font-medium text-green-600">
                +<CountUp value={auth.positivePoints} />
              </span>
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="flex justify-between items-center"
            >
              <span className="text-gray-600">Negative Points</span>
              <span className="font-medium text-red-600">
                -<CountUp value={auth.negativePoints} />
              </span>
            </motion.div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    (auth.positivePoints /
                      (auth.positivePoints + auth.negativePoints)) *
                    100
                  }%`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-white rounded-xl p-6 shadow-lg backdrop-blur-sm bg-opacity-90 border border-gray-100"
        >
          <h2 className="text-xl font-semibold mb-4">Account Activity</h2>
          <div className="space-y-4">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Last Task Completed</span>
              </div>
              <span className="font-medium">
                {formatDate(auth.lastTaskDate)}
              </span>
            </motion.div>
            <motion.div
              whileHover={{ x: 5 }}
              className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Last Login</span>
              </div>
              <span className="font-medium">{formatDate(auth.lastLogin)}</span>
            </motion.div>
            <motion.div
              whileHover={{ x: 5 }}
              className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Member Since</span>
              </div>
              <span className="font-medium">{formatDate(auth.createdAt)}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;
