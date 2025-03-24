import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CheckCircle, Trash2 } from "lucide-react";

const GTDClarify = ({ tasks, updateTask, deleteTask }) => {
  const [activeTaskId, setActiveTaskId] = useState(null);

  const handleClarify = (task) => {
    setActiveTaskId(task.id);
  };

  const saveTaskDetails = (taskId, updates) => {
    updateTask(taskId, { ...updates, clarified: true });
    setActiveTaskId(null);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Clarify Tasks</CardTitle>
          <CardDescription>
            Process what it means. Determine if items are actionable and what
            the next step should be.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No tasks to clarify. Capture some tasks first!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 bg-gray-50">
                  {activeTaskId === task.id ? (
                    <div className="space-y-3">
                      <Input
                        value={task.text}
                        onChange={(e) =>
                          updateTask(task.id, { text: e.target.value })
                        }
                        className="font-medium"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Priority
                          </label>
                          <Select
                            defaultValue={task.priority}
                            onValueChange={(value) =>
                              updateTask(task.id, { priority: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Category
                          </label>
                          <Select
                            defaultValue={task.category}
                            onValueChange={(value) =>
                              updateTask(task.id, { category: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="work">Work</SelectItem>
                              <SelectItem value="personal">Personal</SelectItem>
                              <SelectItem value="health">Health</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="home">Home</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Notes
                        </label>
                        <Textarea
                          value={task.notes || ""}
                          onChange={(e) =>
                            updateTask(task.id, { notes: e.target.value })
                          }
                          placeholder="Add any relevant notes or context"
                          rows={3}
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setActiveTaskId(null)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={() => saveTaskDetails(task.id, task)}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">{task.text}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleClarify(task)}
                        >
                          Clarify
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-800">Clarify Tips</h3>
            <ul className="mt-2 list-disc pl-5 text-green-700 text-sm">
              <li>Determine if the item is actionable</li>
              <li>
                If not actionable, trash it, file it as reference, or incubate
                it
              </li>
              <li>If actionable and takes less than 2 minutes, do it now</li>
              <li>If actionable but delegable, give it to someone else</li>
              <li>
                If actionable and will take longer, clarify it as a next action
                or project
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GTDClarify;
