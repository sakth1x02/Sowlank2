import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { CheckCircle, ClipboardList, Edit, Trash2 } from "lucide-react";

const GTDOrganize = ({ tasks, updateTask, deleteTask }) => {
  const organizeTasks = (category) => {
    return tasks.filter((task) => task.category === category);
  };

  const priorityColor = {
    high: "bg-red-100 text-red-800 hover:bg-red-200",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    low: "bg-green-100 text-green-800 hover:bg-green-200",
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Organize Tasks</CardTitle>
          <CardDescription>
            Put tasks where they belong. Organize them into appropriate
            categories for later review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="md:grid md:grid-cols-6 grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="work">Work</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TaskList
                tasks={tasks}
                updateTask={updateTask}
                deleteTask={deleteTask}
                priorityColor={priorityColor}
              />
            </TabsContent>

            <TabsContent value="work">
              <TaskList
                tasks={organizeTasks("work")}
                updateTask={updateTask}
                deleteTask={deleteTask}
                priorityColor={priorityColor}
              />
            </TabsContent>

            <TabsContent value="personal">
              <TaskList
                tasks={organizeTasks("personal")}
                updateTask={updateTask}
                deleteTask={deleteTask}
                priorityColor={priorityColor}
              />
            </TabsContent>

            <TabsContent value="health">
              <TaskList
                tasks={organizeTasks("health")}
                updateTask={updateTask}
                deleteTask={deleteTask}
                priorityColor={priorityColor}
              />
            </TabsContent>

            <TabsContent value="finance">
              <TaskList
                tasks={organizeTasks("finance")}
                updateTask={updateTask}
                deleteTask={deleteTask}
                priorityColor={priorityColor}
              />
            </TabsContent>

            <TabsContent value="other">
              <TaskList
                tasks={organizeTasks("other").concat(
                  tasks.filter((task) => !task.category)
                )}
                updateTask={updateTask}
                deleteTask={deleteTask}
                priorityColor={priorityColor}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-medium text-indigo-800">Organize Tips</h3>
            <ul className="mt-2 list-disc pl-5 text-indigo-700 text-sm">
              <li>Group related tasks together in appropriate categories</li>
              <li>Make sure each task has a clear purpose and outcome</li>
              <li>Ensure tasks are broken down to the simplest next action</li>
              <li>Put tasks in contexts where you'll see them when needed</li>
              <li>Consider using project folders for multi-step outcomes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TaskList = ({ tasks, updateTask, deleteTask, priorityColor }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No tasks in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
        >
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium">{task.text}</span>
              <Badge className={`ml-2 ${priorityColor[task.priority]}`}>
                {task.priority}
              </Badge>
              {task.category && (
                <Badge variant="outline" className="ml-2">
                  {task.category}
                </Badge>
              )}
            </div>
            {task.notes && (
              <p className="text-sm text-gray-500 mt-1">{task.notes}</p>
            )}
          </div>

          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateTask(task.id, { status: "nextAction" })}
              title="Mark as next action"
            >
              <ClipboardList className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteTask(task.id)}
              title="Delete task"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GTDOrganize;
