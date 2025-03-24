import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { PlusCircle } from "lucide-react";

const GTDCapture = ({ addTask }) => {
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      addTask(task.trim());
      setTask("");
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Capture Tasks</CardTitle>
          <CardDescription>
            Collect what has your attention. Write down everything on your mind,
            big or small.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="What's on your mind?"
                className="flex-1"
              />
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800">Capture Tips</h3>
            <ul className="mt-2 list-disc pl-5 text-blue-700 text-sm">
              <li>
                Don't worry about organizing yet—just get it all out of your
                head
              </li>
              <li>Include personal and professional commitments</li>
              <li>Add even small tasks that take less than 2 minutes</li>
              <li>Capture ideas, projects, and reminders</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GTDCapture;
