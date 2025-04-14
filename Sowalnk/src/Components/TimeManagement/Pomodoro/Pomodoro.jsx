import React, { useState, useEffect, useRef, useCallback } from "react";
import TimerComponent from "./Timer";
import TaskManagerComponent from "./TaskManger";
import GamificationComponent from "./Gamfication";
import pomodoroService from "../../../services/pomodoroService";
import { toast } from "react-toastify";
import { Info, Star } from "lucide-react";

function Pomodoro() {
  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [shortBreakDuration, setShortBreakDuration] = useState(5 * 60);
  const [longBreakDuration, setLongBreakDuration] = useState(15 * 60);
  const [pomodoros, setPomodoros] = useState(0);
  const [phase, setPhase] = useState("Work");
  const [cycle, setCycle] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [world, setWorld] = useState("Forest");
  const [streak, setStreak] = useState(0);
  const [userPoint, setUserPoint] = useState(null);
  const [dailyChallenge, setDailyChallenge] = useState({
    description: "Complete 4 focus sessions today!",
    target: 4,
    progress: 0,
    completed: false,
  });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeView, setActiveView] = useState("gamification");
  const [loading, setLoading] = useState(false);

  const tasksRef = useRef(tasks);
  const currentTaskRef = useRef(currentTask);
  const pomodorosRef = useRef(pomodoros);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    currentTaskRef.current = currentTask;
  }, [currentTask]);

  useEffect(() => {
    pomodorosRef.current = pomodoros;
  }, [pomodoros]);

  useEffect(() => {
    // Clear current task if the corresponding task is deleted or completed
    if (currentTask && tasks.length > 0) {
      const taskExists = tasks.some(
        (task) => task.text === currentTask && !task.completed
      );
      if (!taskExists) {
        setCurrentTask(null);
      }
    }
  }, [tasks, currentTask]);

  // useEffect(() => {
  //   const validateCurrentTask = () => {
  //     const savedTask = localStorage.getItem("currentPomodoroTask");
  //     if (savedTask && tasks.length > 0) {
  //       const taskValid = tasks.some(
  //         (task) =>
  //           task.text === savedTask &&
  //           !task.completed &&
  //           task.deadline &&
  //           new Date(task.deadline) > new Date()
  //       );

  //       if (!taskValid) {
  //         setCurrentTask(null);
  //         localStorage.removeItem("currentPomodoroTask");
  //       }
  //     }
  //   };

  //   const interval = setInterval(validateCurrentTask, 30000); // Validate every 30 seconds
  //   return () => clearInterval(interval);
  // }, [tasks]);

  useEffect(() => {
    const item = localStorage.getItem("currentPomodoroTask");
    setCurrentTask(item);
    // if (currentTask) {
    //   localStorage.setItem("currentPomodoroTask", currentTask);
    // } else {
    //   localStorage.removeItem("currentPomodoroTask");
    // }
  }, [currentTask]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await pomodoroService.getAllpomodoros();
      if (response.success) {
        setTasks(response.data);

        // Get saved task from localStorage
        const savedTask = localStorage.getItem("currentPomodoroTask");
        setCurrentTask(savedTask);
        // // Find matching task in fresh data
        // const validTask = response.data.find(
        //   (task) =>
        //     task.text === savedTask &&
        //     !task.completed &&
        //     task.deadline &&
        //     new Date(task.deadline) > new Date()
        // );

        // if (validTask) {
        //   setCurrentTask(validTask.text);
        // } else {
        //   localStorage.removeItem("currentPomodoroTask");
        //   setCurrentTask(null);
        // }
      } else {
        toast.error("Failed to fetch tasks");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPomodoroPoint = useCallback(async () => {
    try {
      const response = await pomodoroService.getAllpomodorosPoints();
      if (response.success) {
        setUserPoint(response.data);
        setPoints(response.data.points);
        setLevel(response.data.level);
        setStreak(response.data.streak);
      } else {
        toast.error("Failed to fetch user points");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch user points");
    }
  }, []);

  const handleSessionComplete = useCallback(
    (completedPhase) => {
      if (completedPhase === "Work") {
        const newPomodoros = pomodorosRef.current + 1;
        setPomodoros(newPomodoros);

        const currentTaskText = currentTaskRef.current;
        if (currentTaskText) {
          const taskIndex = tasksRef.current.findIndex(
            (task) => task.text === currentTaskText
          );
          if (taskIndex !== -1) {
            const task = tasksRef.current[taskIndex];

            if (task.deadline) {
              const deadlineDate = new Date(task.deadline);
              const currentDate = new Date();

              if (currentDate >= deadlineDate && !task.completed) {
                const markTaskAsCompleted = async () => {
                  try {
                    const response = await pomodoroService.markAsCompleted(
                      task._id
                    );
                    if (response.success) {
                      setTasks((prevTasks) => {
                        const updatedTasks = [...prevTasks];
                        updatedTasks[taskIndex] = {
                          ...task,
                          completed: true,
                          progress: 100,
                        };
                        return updatedTasks;
                      });

                      if (currentTaskRef.current === task.text) {
                        setCurrentTask(null);
                        localStorage.removeItem("currentPomodoroTask");
                      }

                      if (response.data.points) {
                        setUserPoint(response.data.points);
                        setPoints(response.data.points.points);
                        setLevel(response.data.points.level);
                        setStreak(response.data.points.streak);

                        if (response.data.streakBonus > 0) {
                          toast.success(
                            `Streak Bonus! +${response.data.streakBonus} points`
                          );
                        }
                        if (response.data.levelUp) {
                          toast.success(
                            `Level Up! You're now level ${response.data.points.level}`
                          );
                        }
                      }

                      toast.success("Task completed! Deadline reached.");
                    }
                  } catch (error) {
                    toast.error("Failed to mark task as completed");
                  }
                };

                markTaskAsCompleted();
              }
            }
          }
        }

        setSessions((prev) => [
          ...prev,
          {
            duration: workDuration / 60,
            timestamp: new Date(),
            task: currentTaskRef.current,
          },
        ]);

        setDailyChallenge((prev) => ({
          ...prev,
          progress: Math.min(prev.target, prev.progress + 1),
        }));

        if ((newPomodoros + 1) % 4 === 0) {
          setPhase("Long Break");
          setCycle((prev) => prev + 1);
        } else {
          setPhase("Short Break");
        }
      } else {
        setPhase("Work");
      }
    },
    [workDuration]
  );

  useEffect(() => {
    fetchTasks();
    fetchPomodoroPoint();
  }, [fetchTasks, fetchPomodoroPoint]);

  const InfoModal = React.memo(() => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <h2 className="text-3xl font-semibold text-purple-800 mb-6">
          About the Pomodoro Technique
        </h2>
        <div className="space-y-6 text-gray-700">
          {/* Add your modal content here if needed */}
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
  ));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6">
          <div className="w-full">
            <TimerComponent
              workDuration={workDuration}
              setWorkDuration={setWorkDuration}
              shortBreakDuration={shortBreakDuration}
              setShortBreakDuration={setShortBreakDuration}
              longBreakDuration={longBreakDuration}
              setLongBreakDuration={setLongBreakDuration}
              phase={phase}
              setPhase={setPhase}
              pomodoros={pomodoros}
              currentTask={currentTask}
              onSessionComplete={handleSessionComplete}
              cycle={cycle}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <TaskManagerComponent
              loading={loading}
              tasks={tasks}
              setTasks={setTasks}
              currentTask={currentTask}
              setCurrentTask={setCurrentTask}
              phase={phase}
              world={world}
              reminderSound="https://www.soundjay.com/buttons/beep-01a.mp3"
              onPointsUpdate={(amount) => setPoints((prev) => prev + amount)}
              setActiveView={setActiveView}
            />

            <div className="flex gap-3">
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
                points={points || userPoint?.points || 0}
                level={level || userPoint?.level || 1}
                world={world}
                setWorld={setWorld}
                streak={streak || userPoint?.streak || 0}
                dailyChallenge={dailyChallenge}
                setDailyChallenge={setDailyChallenge}
                pomodoros={pomodoros}
              />
            )}
          </div>
        </div>
      </div>

      {showInfoModal && <InfoModal />}
    </div>
  );
}

export default React.memo(Pomodoro);
