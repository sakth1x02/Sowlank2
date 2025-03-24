import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const GTDReflect = ({ tasks }) => {
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const incompleteTasks = totalTasks - completedTasks;
  const clarifiedTasks = tasks.filter((task) => task.clarified).length;
  const unclarifiedTasks = tasks.filter((task) => !task.clarified).length;

  // Prepare data for category chart
  const categories = [
    "work",
    "personal",
    "health",
    "finance",
    "home",
    "other",
    "",
  ];
  const categoryData = categories
    .map((category) => {
      const count = tasks.filter((task) => task.category === category).length;
      return {
        name: category || "uncategorized",
        count: count,
      };
    })
    .filter((item) => item.count > 0);

  // Prepare data for completion status pie chart
  const statusData = [
    { name: "Completed", value: completedTasks, color: "#4ade80" },
    { name: "In Progress", value: incompleteTasks, color: "#f97316" },
  ].filter((item) => item.value > 0);

  // Prepare data for priority distribution
  const priorityData = [
    {
      name: "High",
      count: tasks.filter((task) => task.priority === "high").length,
      color: "#ef4444",
    },
    {
      name: "Medium",
      count: tasks.filter((task) => task.priority === "medium").length,
      color: "#f59e0b",
    },
    {
      name: "Low",
      count: tasks.filter((task) => task.priority === "low").length,
      color: "#10b981",
    },
  ].filter((item) => item.count > 0);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Reflect on Progress</CardTitle>
          <CardDescription>
            Review regularly to maintain clarity and control. See how you're
            doing on your GTD journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No tasks to reflect on yet. Start by capturing some tasks!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  title="Total Tasks"
                  value={totalTasks}
                  description="Total tasks in your system"
                  className="bg-blue-50"
                />
                <StatCard
                  title="Completed"
                  value={completedTasks}
                  description={`${
                    Math.round((completedTasks / totalTasks) * 100) || 0
                  }% of all tasks`}
                  className="bg-green-50"
                />
                <StatCard
                  title="Clarified"
                  value={clarifiedTasks}
                  description={`${
                    Math.round((clarifiedTasks / totalTasks) * 100) || 0
                  }% of all tasks`}
                  className="bg-purple-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {statusData.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Task Completion Status</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {categoryData.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Tasks by Category</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={categoryData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

              {priorityData.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Tasks by Priority</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={priorityData}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Bar dataKey="count">
                          {priorityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium text-purple-800">Reflect Tips</h3>
            <ul className="mt-2 list-disc pl-5 text-purple-700 text-sm">
              <li>Review your lists regularly (daily, weekly, monthly)</li>
              <li>Check if your next actions are still relevant</li>
              <li>Update priorities based on changing circumstances</li>
              <li>Identify which areas need more attention</li>
              <li>Remember to celebrate your accomplishments!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value, description, className }) => {
  return (
    <div className={`rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-sm mt-1 text-gray-600">{description}</p>
    </div>
  );
};

export default GTDReflect;
