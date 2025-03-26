import { useState, useEffect } from "react";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// HelpModal Component
function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="rounded-2xl p-6 sm:p-8 w-full max-w-[90%] sm:max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl bg-white">
        <h2 className="text-2xl sm:text-3xl font-semibold text-purple-800 mb-4 sm:mb-6">What is the Pomodoro Technique?</h2>
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            The <strong>Pomodoro Technique</strong> is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is called a "Pomodoro," named after the tomato-shaped kitchen timer Cirillo used (Pomodoro means "tomato" in Italian).
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-purple-700">How It Works</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Choose a Task:</strong> Pick a task you want to focus on.</li>
            <li><strong>Set the Timer:</strong> Set the timer to 25 minutes (one Pomodoro).</li>
            <li><strong>Work on the Task:</strong> Focus until the timer rings.</li>
            <li><strong>Take a Short Break:</strong> Take a 5-minute break.</li>
            <li><strong>Repeat:</strong> After four Pomodoros, take a longer break (15-30 minutes).</li>
          </ol>
          <h3 className="text-lg sm:text-xl font-semibold text-purple-700">How to Use This Timer</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Select Task:</strong> Choose a task from "Capture Tasks" to start.</li>
            <li><strong>Start:</strong> Click "Start" to begin the session.</li>
            <li><strong>Track:</strong> View stats in "Summary," "Details," and "Ranking."</li>
            <li><strong>Manage Interruptions:</strong> Log distractions with the custom modal.</li>
          </ul>
          <p>Happy focusing!</p>
        </div>
        <div className="mt-6 sm:mt-8 flex justify-end">
          <button onClick={onClose} className="bg-purple-500 hover:bg-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg text-base sm:text-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Details Component
function Details({ sessions, interruptions }) {
  return (
    <div className="rounded-2xl shadow-lg p-4 sm:p-6 bg-white">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Details</h3>
      {sessions.length === 0 ? (
        <p className="text-gray-600 text-sm sm:text-base">No sessions recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Task Name</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Date</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Duration (min)</th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Interruptions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm">{session.task || "No task"}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm">{new Date(session.timestamp).toLocaleDateString()}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm">{Math.floor(session.duration / 60)}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm">{interruptions.filter(i => i.session === index + 1).length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Ranking Component
function Ranking() {
  const users = [
    { name: "Alice", minutes: 1250 },
    { name: "Bob", minutes: 1100 },
    { name: "Charlie", minutes: 950 },
    { name: "David", minutes: 800 },
    { name: "Eve", minutes: 700 },
  ];

  return (
    <div className="rounded-2xl shadow-lg p-4 sm:p-6 bg-white">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Ranking</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">S.No</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Name</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">HH:MM</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              const hours = Math.floor(user.minutes / 60);
              const minutes = user.minutes % 60;
              return (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm">{index + 1}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm">{user.name}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm">{`${hours}h ${minutes}m`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Summary Component
function Summary({ sessions, interruptions }) {
  const [view, setView] = useState('Week');

  const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
  const hoursFocused = Math.floor(totalMinutes / 60);
  const minutesFocused = totalMinutes % 60;
  const uniqueDays = [...new Set(sessions.map(s => new Date(s.timestamp).toDateString()))].length;
  const focusScore = Math.min(100, Math.floor((sessions.length * 25 - interruptions.length * 5 + uniqueDays * 10) / 10));

  const chartData = {
    Week: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], data: [5, 3, 7, 2, 4, 6, 3] },
    Month: { labels: Array.from({ length: 30 }, (_, i) => (i + 1).toString()), data: Array(30).fill(0).map(() => Math.floor(Math.random() * 30)) },
    Year: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], data: Array(12).fill(0).map(() => Math.floor(Math.random() * 130)) },
  };

  const data = {
    labels: chartData[view].labels,
    datasets: [{ label: 'Focus Hours', data: chartData[view].data, borderColor: '#4f46e5', backgroundColor: 'rgba(79, 70, 229, 0.2)', fill: true, tension: 0.4 }],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' }, title: { display: true, text: `Focus Trend (${view})`, font: { size: 14 } } },
    scales: { y: { beginAtZero: true, title: { display: true, text: 'Hours', font: { size: 12 } } }, x: { title: { display: true, text: view === 'Week' ? 'Day' : view === 'Month' ? 'Date' : 'Month', font: { size: 12 } } } },
  };

  return (
    <div className="rounded-2xl shadow-lg p-4 sm:p-6 bg-white">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Summary</h3>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-xs sm:text-sm">Active Sessions</p>
          <p className="text-lg sm:text-2xl font-bold text-indigo-800">{sessions.length}</p>
        </div>
        <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-xs sm:text-sm">Days Focused</p>
          <p className="text-lg sm:text-2xl font-bold text-indigo-800">{uniqueDays}</p>
        </div>
        <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-xs sm:text-sm">Focus Score</p>
          <p className="text-lg sm:text-2xl font-bold text-indigo-800">{focusScore}/100</p>
        </div>
        <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-xs sm:text-sm">Hours Focused</p>
          <p className="text-lg sm:text-2xl font-bold text-indigo-800">{hoursFocused}h {minutesFocused}m</p>
        </div>
      </div>
      <div className="mb-4 sm:mb-6">
        <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Focus Graph</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {['Week', 'Month', 'Year'].map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base ${view === v ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>{v}</button>
          ))}
        </div>
        <div className="w-full h-64 sm:h-80">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

// Interruption Modal Component
function InterruptionModal({ isOpen, onClose, onSave }) {
  const [category, setCategory] = useState("");
  const [customNote, setCustomNote] = useState("");

  if (!isOpen) return null;

  const categories = ["Phone Call", "Random Thought", "Visitor", "Urgent Task", "Other"];

  const handleSave = () => {
    const note = category === "Other" ? customNote : category;
    if (note.trim()) {
      onSave(note);
      setCategory("");
      setCustomNote("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="rounded-2xl p-4 sm:p-6 max-w-[90%] sm:max-w-sm w-full shadow-2xl bg-white">
        <h3 className="text-lg sm:text-xl font-semibold text-purple-800 mb-4">Log Interruption</h3>
        <div className="space-y-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 sm:p-3 rounded-lg border text-sm sm:text-lg bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-300"
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {category === "Other" && (
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Enter custom note"
              className="w-full p-2 sm:p-3 rounded-lg border text-sm sm:text-lg bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-300"
            />
          )}
        </div>
        <div className="mt-4 sm:mt-6 flex justify-end gap-3 sm:gap-4">
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base">Cancel</button>
          <button onClick={handleSave} className="bg-purple-500 hover:bg-purple-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base">Save</button>
        </div>
      </div>
    </div>
  );
}

// Pomodoro Component
function Pomodoro() {
  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [shortBreakDuration, setShortBreakDuration] = useState(5 * 60);
  const [longBreakDuration, setLongBreakDuration] = useState(15 * 60);
  const CYCLES_BEFORE_LONG_BREAK = 4;
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isActive, setIsActive] = useState(false);
  const [pomodoros, setPomodoros] = useState(0);
  const [phase, setPhase] = useState("Work");
  const [cycle, setCycle] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [activeReport, setActiveReport] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [autoStart, setAutoStart] = useState(false);
  const [interruptions, setInterruptions] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPlanning, setShowPlanning] = useState(false);
  const [showInterruptionModal, setShowInterruptionModal] =useState(false);

  useEffect(() => {
    let timer = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      if (soundEnabled) {
        const audio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
        audio.play();
      }
      setIsActive(autoStart);
      if (phase === "Work") {
        setPomodoros((prev) => prev + 1);
        setSessions((prev) => [
          ...prev,
          { phase: "Work", duration: workDuration, timestamp: new Date(), task: currentTask },
        ]);
        if (currentTask && !window.confirm(`Task "${currentTask}" incomplete. Extend session?`)) {
          setTasks(tasks.map(t => t.text === currentTask ? { ...t, completed: false } : t));
          setCurrentTask(null);
        } else if (currentTask) {
          setTimeLeft(workDuration);
          setIsActive(true);
          return;
        }
        if (pomodoros + 1 === CYCLES_BEFORE_LONG_BREAK) {
          setPhase("Long Break");
          setTimeLeft(longBreakDuration);
          setCycle((prev) => prev + 1);
        } else {
          setPhase("Short Break");
          setTimeLeft(shortBreakDuration);
        }
      } else {
        setPhase("Work");
        setTimeLeft(workDuration);
        setCurrentTask(null); // Reset task after break
      }
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, phase, cycle, workDuration, shortBreakDuration, longBreakDuration, autoStart, currentTask, pomodoros, soundEnabled, tasks]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getProgress = () => {
    const totalTime = phase === "Work" ? workDuration : phase === "Short Break" ? shortBreakDuration : longBreakDuration;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const addTask = (task) => {
    if (task.trim()) setTasks([...tasks, { text: task, completed: false }]);
  };

  const toggleTaskCompletion = (index) => {
    setTasks(tasks.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
    if (currentTask === tasks[index]?.text) setCurrentTask(null);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(phase === "Work" ? workDuration : phase === "Short Break" ? shortBreakDuration : longBreakDuration);
  };

  const addInterruption = (note) => {
    if (phase === "Work") {
      setInterruptions([...interruptions, { note, timestamp: new Date(), session: pomodoros + 1 }]);
    }
  };

  const startTimer = () => {
    if (phase === "Work" && !currentTask) {
      alert("Please select a task to start the timer!");
      return;
    }
    setIsActive(!isActive);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="py-4 sm:py-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">Pomodoro Timer</h1>
            <p className="text-sm sm:text-lg text-gray-600 mt-1">Boost productivity with focus and breaks.</p>
          </div>
          <button onClick={() => setShowHelpModal(true)} className="text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-12 sm:pb-16 px-4 max-w-[90rem] mx-auto mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Panel - Timer */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl shadow-lg p-6 sm:p-8 bg-white">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
            
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button onClick={() => setShowSettings(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-semibold text-sm sm:text-base">Settings</button>
                  <button onClick={() => setActiveReport('summary')} className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base ${activeReport === 'summary' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Summary</button>
                  <button onClick={() => setActiveReport('details')} className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base ${activeReport === 'details' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Details</button>
                  <button onClick={() => setActiveReport('ranking')} className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base ${activeReport === 'ranking' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Ranking</button>
                </div>
              </div>
              {/* Current Task Display */}
              {phase === "Work" && (
                <div className="text-center mb-4">
                  <p className="text-sm sm:text-lg text-gray-700">
                    {currentTask ? `Working on: ${currentTask}` : "Please select a task to begin"}
                  </p>
                </div>
              )}
              {/* Timer Display */}
              <div className="flex justify-center mb-6 sm:mb-8">
                {/* Desktop View: Circular Timer */}
                <div className="hidden sm:block w-60 sm:w-80 h-60 sm:h-80 relative">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-200" strokeWidth="4" stroke="currentColor" fill="transparent" r="48" cx="50" cy="50" />
                    <circle className="text-purple-500" strokeWidth="4" strokeDasharray={`${getProgress() * 3.01}, 301`} strokeDashoffset="0" strokeLinecap="round" stroke="url(#gradient)" fill="transparent" r="48" cx="50" cy="50" transform="rotate(-90 50 50)" />
                    <defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#C084FC" /></linearGradient></defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-52 sm:w-72 h-52 sm:h-72 rounded-full bg-white shadow-inner flex items-center justify-center">
                      <span className="text-5xl sm:text-7xl font-mono text-purple-800">{formatTime(timeLeft)}</span>
                    </div>
                  </div>
                </div>
                {/* Mobile View: Simple Timer */}
                <span className="block sm:hidden text-6xl font-mono text-purple-800">{formatTime(timeLeft)}</span>
              </div>
              {/* Cycle Progress */}
              {phase === "Work" && (
                <div className="flex justify-center gap-2 mb-4">
                  {Array.from({ length: CYCLES_BEFORE_LONG_BREAK }, (_, i) => (
                    <span key={i} className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full ${i < (pomodoros % CYCLES_BEFORE_LONG_BREAK || CYCLES_BEFORE_LONG_BREAK) ? "bg-purple-500" : "bg-gray-300"}`} />
                  ))}
                </div>
              )}
              {/* Phase Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                {["Work", "Short Break", "Long Break"].map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      setPhase(p);
                      setTimeLeft(p === "Work" ? workDuration : p === "Short Break" ? shortBreakDuration : longBreakDuration);
                      setIsActive(false);
                    }}
                    className={`px-6 py-2 sm:px-6 sm:py-3 rounded-full font-semibold text-sm sm:text-lg ${phase === p ? "bg-purple-500 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-purple-100"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <button onClick={startTimer} className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-lg">{isActive ? "Pause" : "Start"}</button>
                <button onClick={resetTimer} className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-lg">Reset</button>
                {phase === "Work" && isActive && (
                  <button onClick={() => setShowInterruptionModal(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-lg">Log Interruption</button>
                )}
              </div>
              {/* Cycle Info */}
              <p className="text-center mt-4 sm:mt-6 font-medium text-sm sm:text-lg text-purple-700">
                {phase === "Work" ? `Cycle #${cycle} - Pomodoros: ${pomodoros}` : "Take a break!"}
              </p>
            </div>
          </div>

          {/* Right Panel - Tasks */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl shadow-lg p-4 sm:p-6 bg-white">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-2xl font-semibold text-purple-800">Tasks</h2>
                <button onClick={() => setShowPlanning(true)} className="text-gray-600 hover:text-gray-800 text-sm sm:text-base">Day</button>
              </div>
              <p className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-600">List tasks and select one to focus on.</p>
              <div className="space-y-3 sm:space-y-4">
                <select
                  value={currentTask || ""}
                  onChange={(e) => setCurrentTask(e.target.value || null)}
                  className="w-full p-2 sm:p-3 rounded-lg border text-sm sm:text-base bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-300"
                >
                  <option value="">Select a task</option>
                  {tasks.map((task, index) => (
                    <option key={index} value={task.text}>{task.text}</option>
                  ))}
                </select>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Add a task"
                    className="w-full p-2 sm:p-3 rounded-lg border text-sm sm:text-base bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-300"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") { addTask(e.target.value); e.target.value = ""; }
                    }}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add a task"]');
                        addTask(input.value);
                        input.value = "";
                      }}
                      className="bg-purple-500 hover:bg-purple-600 text-white w-full sm:w-auto px-6 sm:px-4 py-2 sm:h-12 sm:flex sm:items-center sm:justify-center rounded-lg text-sm sm:text-base"
                    >
                      <span className="block sm:hidden">Add</span>
                      <svg className="hidden sm:block w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <ul className="space-y-3 mt-3 sm:mt-4 max-h-80 sm:max-h-96 overflow-y-auto">
                {tasks.map((task, index) => (
                  <li key={index} className={`p-3 rounded-lg text-sm sm:text-base flex justify-between items-center ${task.text === currentTask && phase === "Work" ? "bg-purple-100 border-purple-500 border-2" : "bg-purple-50"} text-purple-800`}>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(index)} className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600 rounded" />
                      <span className={task.completed ? "line-through" : ""}>{task.text}</span>
                    </div>
                    <button onClick={() => deleteTask(index)} className="text-red-500 hover:text-red-600 text-lg sm:text-xl">×</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reports Section - Spanning Full Width */}
          <div className="lg:col-span-3 mt-6 sm:mt-8">
            {activeReport === 'summary' && <Summary sessions={sessions} interruptions={interruptions} />}
            {activeReport === 'details' && <Details sessions={sessions} interruptions={interruptions} />}
            {activeReport === 'ranking' && <Ranking />}
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-2xl p-6 sm:p-8 max-w-[90%] sm:max-w-md w-full shadow-2xl bg-white">
            <h2 className="text-2xl sm:text-3xl font-semibold text-purple-800 mb-4 sm:mb-6">Timer Settings</h2>
            <div className="space-y-4 sm:space-y-6">
              {[
                { label: "Work Duration", value: workDuration, setter: setWorkDuration },
                { label: "Short Break", value: shortBreakDuration, setter: setShortBreakDuration },
                { label: "Long Break", value: longBreakDuration, setter: setLongBreakDuration },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <label className="block text-sm sm:text-lg text-purple-700 mb-2">{label} (minutes)</label>
                  <input
                    type="number"
                    defaultValue={value / 60}
                    onChange={(e) => {
                      const newValue = Number(e.target.value) * 60;
                      setter(newValue);
                      if (phase === label.split(" ")[0] + (label.includes("Break") ? " Break" : "")) setTimeLeft(newValue);
                    }}
                    className="w-full p-2 sm:p-3 rounded-lg border text-sm sm:text-lg bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-300"
                    min="1"
                  />
                </div>
              ))}
              <div>
                <label className="flex items-center gap-2 text-sm sm:text-lg text-purple-700">
                  <input type="checkbox" checked={autoStart} onChange={() => setAutoStart(!autoStart)} className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600 rounded" />
                  Auto-start next phase
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm sm:text-lg text-purple-700">
                  <input type="checkbox" checked={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600 rounded" />
                  Enable end-of-phase sound
                </label>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 flex justify-end gap-3 sm:gap-4">
              <button onClick={() => setShowSettings(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-lg">Cancel</button>
              <button onClick={() => setShowSettings(false)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Planning Modal */}
      {showPlanning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-2xl p-6 sm:p-8 max-w-[90%] sm:max-w-md w-full shadow-2xl bg-white">
            <h2 className="text-2xl sm:text-3xl font-semibold text-purple-800 mb-4 sm:mb-6">Plan Your Day</h2>
            <p className="text-gray-700 mb-4 text-sm sm:text-base">Review and prioritize your tasks.</p>
            <ul className="space-y-2">
              {tasks.map((task, index) => (
                <li key={index} className="flex items-center gap-2">
                  <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(index)} className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600 rounded" />
                  <span className={`text-sm sm:text-base ${task.completed ? "line-through text-gray-500" : "text-gray-700"}`}>{task.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 sm:mt-8 flex justify-end">
              <button onClick={() => setShowPlanning(false)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-lg">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Interruption Modal */}
      <InterruptionModal
        isOpen={showInterruptionModal}
        onClose={() => setShowInterruptionModal(false)}
        onSave={addInterruption}
      />

      {/* Help Modal */}
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
}

export default Pomodoro;