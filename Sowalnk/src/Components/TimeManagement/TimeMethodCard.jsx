import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const TimeMethodCard = ({ method, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: method.id * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <div
        className="h-full overflow-hidden bg-white border border-gray-200 hover:border-emerald-200 hover:shadow-md transition-all duration-300"
        onClick={onClick}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-medium text-sm">
              {method.id}
            </span>
          </div>
          <h3 className="text-xl font-bold mt-4 mb-2">{method.name}</h3>
          <p className="text-gray-500 text-sm">{method.description}</p>
        </div>
        <div className="px-6 pb-6 pt-0">
          <button className="text-emerald-600 text-sm font-medium flex items-center gap-1 group hover:text-emerald-800 transition-colors">
            Learn more
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TimeMethodCard;
