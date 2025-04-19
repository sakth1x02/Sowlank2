import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "react-toastify";

// GTD Components
import GTDHeader from "./GTDHeader";
import GTDCapture from "./GTDCapture";
import GTDClarify from "./GTDClarify";
import GTDOrganize from "./GTDOrganize";
import GTDReflect from "./GTDReflect";
import GTDEngage from "./GTDEngage";
import GTDInfo from "./GTDInfo";

const GTDApp = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("capture");

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("gtdTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("gtdTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    const newTask = {
      id: Date.now().toString(),
      text: task,
      status: "inbox", // Initial status
      clarified: false,
      priority: "medium",
      dueDate: null,
      category: "",
      notes: "",
      completed: false,
      dateCreated: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
    toast.success("Task captured");
  };

  const updateTask = (taskId, updates) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    toast.success("Task deleted");
  };

  const completeTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <GTDHeader />

      <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 md:grid md:grid-cols-6 h-14">
            <TabsTrigger value="capture" className="text-sm md:text-base">
              Capture
            </TabsTrigger>
            <TabsTrigger value="clarify" className="text-sm md:text-base">
              Clarify
            </TabsTrigger>
            <TabsTrigger value="organize" className="text-sm md:text-base">
              Organize
            </TabsTrigger>
            <TabsTrigger value="reflect" className="text-sm md:text-base">
              Reflect
            </TabsTrigger>
            <TabsTrigger value="engage" className="text-sm md:text-base">
              Engage
            </TabsTrigger>
            <TabsTrigger value="info" className="text-sm md:text-base">
              Info
            </TabsTrigger>
          </TabsList>

          <div className="p-4 md:p-6">
            <TabsContent value="capture">
              <GTDCapture addTask={addTask} />
            </TabsContent>

            <TabsContent value="clarify">
              <GTDClarify
                tasks={tasks.filter((task) => !task.clarified)}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            </TabsContent>

            <TabsContent value="organize">
              <GTDOrganize
                tasks={tasks.filter(
                  (task) => task.clarified && !task.completed
                )}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            </TabsContent>

            <TabsContent value="reflect">
              <GTDReflect tasks={tasks} />
            </TabsContent>

            <TabsContent value="engage">
              <GTDEngage
                tasks={tasks.filter(
                  (task) => task.clarified && !task.completed
                )}
                completeTask={completeTask}
                updateTask={updateTask}
              />
            </TabsContent>

            <TabsContent value="info">
              <GTDInfo />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default GTDApp;
