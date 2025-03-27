import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { toast } from "react-toastify";
const FeedbackPopup = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === null) {
      toast.warning("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackdata = {
        rating,
        feedback,
      };
      await onSubmit(feedbackdata);
      toast.success("Thank you for your feedback!");
      setRating(null);
      setFeedback("");
      onClose();
      setIsSubmitting(false);
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed overflow-auto min-h-screen top-0 inset-0 z-50 bg-black bg-opacity-50 flex justify-center">
      <div className="sm:max-w-md p-0 max-h-[430px] mt-20 overflow-hidden rounded-xl bg-white border border-slate-200 shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="p-6 "
        >
          <div className="pb-4">
            <div className="text-2xl font-medium tracking-tight">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Feedback
              </span>
              <h2 className="text-2xl text-purple-500 font-medium mt-1">
                How was your experience?
              </h2>
            </div>
            <div className="text-slate-500 dark:text-slate-400 mt-2">
              Your feedback helps us improve our service.
            </div>
          </div>

          <div className="py-4">
            <div className="flex justify-center items-center space-x-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-1"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                >
                  <Star
                    className={`
                      w-8 h-8 transition-all duration-200
                      ${
                        (
                          hoveredRating !== null
                            ? star <= hoveredRating
                            : star <= (rating || 0)
                        )
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300 dark:text-slate-600"
                      }
                    `}
                  />
                </motion.button>
              ))}
            </div>

            <textarea
              placeholder="Tell us about your experience (optional)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px] w-full p-2 resize-none rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex sm:flex sm:flex-row justify-between gap-2 mt-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className=" bg-purple-500 py-2 px-6 rounded-lg  text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit "}
            </button>
            <button onClick={onClose} className=" ">
              Skip
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackPopup;
