import React, { useState, useEffect } from "react";
import TimerComponent from "./Timer"; // Fixed import name
import TaskManagerComponent from "./TaskManger"; // Fixed import name
import GamificationComponent from "./Gamfication"; // Fixed import name

import { Info, BarChart, Trophy, Star } from "lucide-react";

function Pomodoro() {
  // Pomodoro state
  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [shortBreakDuration, setShortBreakDuration] = useState(5 * 60);
  const [longBreakDuration, setLongBreakDuration] = useState(15 * 60);
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isActive, setIsActive] = useState(false);
  const [pomodoros, setPomodoros] = useState(0);
  const [phase, setPhase] = useState("Work");
  const [cycle, setCycle] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [autoStart] = useState(true);
  const [soundEnabled] = useState(true);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [world, setWorld] = useState("Forest");
  const [streak, setStreak] = useState(0);
  const [dailyChallenge, setDailyChallenge] = useState({
    description: "Complete 4 focus sessions today!",
    target: 4,
    progress: 0,
    completed: false,
  });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeView, setActiveView] = useState("gamification");

  // Payment state
  const [hasPaid, setHasPaid] = useState(false); // Tracks payment status

  // Load payment status from localStorage (for demo; use backend in production)
  useEffect(() => {
    const paymentStatus = localStorage.getItem("hasPaid");
    if (paymentStatus === "true") {
      setHasPaid(true);
    }
  }, []);

  const handleSessionComplete = (completedPhase) => {
    if (completedPhase === "Work") {
      setPomodoros(prev => prev + 1);
      setPoints(prev => prev + 10);
      setSessions(prev => [
        ...prev,
        { duration: workDuration / 60, timestamp: new Date(), task: currentTask }
      ]);
      setDailyChallenge(prev => ({
        ...prev,
        progress: Math.min(prev.target, prev.progress + 1)
      }));

      if ((pomodoros + 1) % 4 === 0) {
        setPhase("Long Break");
        setTimeLeft(longBreakDuration);
        setCycle(prev => prev + 1);
      } else {
        setPhase("Short Break");
        setTimeLeft(shortBreakDuration);
      }
    } else {
      setPhase("Work");
      setTimeLeft(workDuration);
      setCurrentTask(null);
    }
  };

  // // Razorpay Payment Handler
  // const handlePayment = () => {
  //   const options = {
  //     key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay Key ID
  //     amount: 1000, // 10 INR (amount in paise: 10 * 100 = 1000)
  //     currency: "INR",
  //     name: "Pomodoro App",
  //     description: "Unlock Pomodoro Technique",
  //     handler: function (response) {
  //       // Handle successful payment
  //       console.log("Payment successful:", response);
  //       setHasPaid(true);
  //       localStorage.setItem("hasPaid", "true"); // Persist payment status (demo only)
  //       alert("Payment successful! Enjoy the Pomodoro Technique.");
  //     },
  //     prefill: {
  //       name: "User Name",
  //       email: "user@example.com",
  //       contact: "9999999999",
  //     },
  //     theme: {
  //       color: "#9333ea", // Purple theme to match your app
  //     },
  //   };

  //   // Simulate order creation (replace with backend API call in production)
  //   const paymentObject = new window.Razorpay(options);
  //   paymentObject.on("payment.failed", function (response) {
  //     console.error("Payment failed:", response.error);
  //     alert("Payment failed. Please try again.");
  //   });
  //   paymentObject.open();
  // };

  const InfoModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <h2 className="text-3xl font-semibold text-purple-800 mb-6">About the Pomodoro Technique</h2>
        {/* Info content remains unchanged */}
        <div className="space-y-6 text-gray-700">
          <section>
            <h3 className="text-xl font-semibold text-purple-700 mb-2">What is the Pomodoro Technique?</h3>
            <p>
              The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s...
            </p>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-purple-700 mb-2">How to Use the Pomodoro Technique</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Choose a task you want to work on...</li>
            </ul>
          </section>
          <section>
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Benefits of the Pomodoro Technique</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Enhanced Focus:</strong> The 25-minute intervals help you concentrate...</li>
            </ul>
          </section>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowInfoModal(false)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Payment Page Component
  const PaymentPage = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
        <h2 className="text-3xl font-bold text-purple-800 mb-4">Unlock Pomodoro Technique</h2>
        <p className="text-gray-700 mb-6">
          To use this app and boost your productivity with the Pomodoro Technique, please make a one-time payment of <strong>₹10</strong>.
        </p>
        <button
          onClick={handlePayment}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Pay ₹10 Now
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Powered by Razorpay
        </p>
      </div>
    </div>
  );

  // Main Pomodoro UI (shown only after payment)
  const PomodoroUI = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800">Pomodoro</h1>
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            title="Learn about the Pomodoro Technique"
          >
            <Info size={24} className="text-purple-800" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TimerComponent
              workDuration={workDuration}
              setWorkDuration={setWorkDuration}
              shortBreakDuration={shortBreakDuration}
              setShortBreakDuration={setShortBreakDuration}
              longBreakDuration={longBreakDuration}
              setLongBreakDuration={setLongBreakDuration}
              phase={phase}
              setPhase={setPhase}
              timeLeft={timeLeft}
              setTimeLeft={setTimeLeft}
              isActive={isActive}
              setIsActive={setIsActive}
              pomodoros={pomodoros}
              setPomodoros={setPomodoros}
              currentTask={currentTask}
              autoStart={autoStart}
              soundEnabled={soundEnabled}
              onSessionComplete={handleSessionComplete}
              cycle={cycle}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <TaskManagerComponent
              tasks={tasks}
              setTasks={setTasks}
              currentTask={currentTask}
              setCurrentTask={setCurrentTask}
              phase={phase}
              world={world}
              reminderSound="https://www.soundjay.com/buttons/beep-01a.mp3"
              onPointsUpdate={(amount) => setPoints(prev => prev + amount)}
              setActiveView={setActiveView}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setActiveView("summary")}
                className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <BarChart size={20} />
                Summary
              </button>
              <button
                onClick={() => setActiveView("ranking")}
                className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trophy size={20} />
                Ranking
              </button>
              <button
                onClick={() => setActiveView("gamification")}
                className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Star size={20} />
                Level
              </button>
            </div>

            {activeView === "gamification" && (
              <GamificationComponent
                points={points}
                setPoints={setPoints}
                level={level}
                setLevel={setLevel}
                world={world}
                setWorld={setWorld}
                streak={streak}
                setStreak={setStreak}
                dailyChallenge={dailyChallenge}
                setDailyChallenge={setDailyChallenge}
                pomodoros={pomodoros}
              />
            )}
            {activeView === "summary" && <Summary sessions={sessions} pomodoros={pomodoros} />}
            {activeView === "ranking" && <Ranking />}
          </div>
        </div>
      </div>

      {showInfoModal && <InfoModal />}
    </div>
  );

  return <PomodoroUI /> ;
}

export default Pomodoro;