import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { CheckCheck, Filter } from "lucide-react";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const GTDEngage = ({ tasks, completeTask, updateTask }) => {
  const [filter, setFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "high") return task.priority === "high";
    if (filter === "medium") return task.priority === "medium";
    if (filter === "low") return task.priority === "low";
    return true;
  });

  const priorityColor = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Engage with Action</CardTitle>
              <CardDescription>
                Simply do. Choose the right task at the right time and take
                action.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleContent>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Filter by Priority</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "high" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("high")}
                  >
                    High Priority
                  </Button>
                  <Button
                    variant={filter === "medium" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("medium")}
                  >
                    Medium Priority
                  </Button>
                  <Button
                    variant={filter === "low" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("low")}
                  >
                    Low Priority
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {filteredTasks.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No tasks to engage with currently.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  completeTask={completeTask}
                  updateTask={updateTask}
                  priorityColor={priorityColor}
                />
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <h3 className="font-medium text-amber-800">Engage Tips</h3>
            <ul className="mt-2 list-disc pl-5 text-amber-700 text-sm">
              <li>
                Choose your tasks based on context, time available, energy
                level, and priority
              </li>
              <li>Focus on one task at a time for maximum efficiency</li>
              <li>
                Use the "2-minute rule": if it takes less than 2 minutes, do it
                now
              </li>
              <li>Break larger tasks into smaller, actionable steps</li>
              <li>Use your calendar for time-specific commitments</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TaskItem = ({ task, completeTask, updateTask, priorityColor }) => {
  const [open, setOpen] = useState(false);

  const handleComplete = () => {
    completeTask(task.id);
    setOpen(false);
  };

  return (
    <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => setOpen(true)}
        className="mr-3"
      />
      <div className="flex-1">
        <label
          htmlFor={`task-${task.id}`}
          className="font-medium cursor-pointer"
        >
          {task.text}
        </label>
        <div className="flex items-center gap-2 mt-1">
          <Badge className={priorityColor[task.priority]}>
            {task.priority}
          </Badge>
          {task.category && <Badge variant="outline">{task.category}</Badge>}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this task as complete?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium">{task.text}</p>
            {task.notes && (
              <p className="text-sm text-gray-500 mt-2">{task.notes}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleComplete}>
              <CheckCheck className="mr-2 h-4 w-4" /> Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GTDEngage;
