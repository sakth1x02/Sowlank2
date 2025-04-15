import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../Components/TimeManagement/GTD/ui/card.jsx";
import { Calendar } from "../../Components/TimeManagement/GTD/ui/calendar.jsx";
import { Check, X, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../../Components/TimeManagement/GTD/ui/button.jsx";
import { format } from "date-fns";

// Sample data
const sampleGoals = [
  {
    id: 1,
    name: "Morning Workout",
    description: "30 minutes of cardio",
    completedDates: [new Date(2025, 3, 1), new Date(2025, 3, 3)],
    missedDates: [new Date(2025, 3, 2)],
    currentStreak: 2,
    longestStreak: 3,
  },
];

const GoalsPage = () => {
  const [goals, setGoals] = useState(sampleGoals);
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0].id);
  const [date, setDate] = useState(new Date());

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId);

  const markDateAsCompleted = (date) => {
    if (!date) return;
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id !== selectedGoalId) return goal;

        if (
          goal.completedDates.some(
            (d) => d.toDateString() === date.toDateString()
          )
        ) {
          return goal;
        }

        const updatedMissedDates = goal.missedDates.filter(
          (d) => d.toDateString() !== date.toDateString()
        );

        return {
          ...goal,
          completedDates: [...goal.completedDates, date],
          missedDates: updatedMissedDates,
        };
      })
    );
  };

  const markDateAsMissed = (date) => {
    if (!date) return;
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id !== selectedGoalId) return goal;

        if (
          goal.missedDates.some((d) => d.toDateString() === date.toDateString())
        ) {
          return goal;
        }

        const updatedCompletedDates = goal.completedDates.filter(
          (d) => d.toDateString() !== date.toDateString()
        );

        return {
          ...goal,
          completedDates: updatedCompletedDates,
          missedDates: [...goal.missedDates, date],
        };
      })
    );
  };

  const handleCreateTask = (e) => {
    e.preventDefault();

    if (!title || !description) return;

    const newGoal = {
      id: Date.now(),
      name: title,
      description,
      completedDates: [],
      missedDates: [],
      currentStreak: 0,
      longestStreak: 0,
    };

    setGoals((prev) => [...prev, newGoal]);
    setSelectedGoalId(newGoal.id);

    // Reset form
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Goal Tracker</h1>

      <div className="md:flex gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Manage Progress
              </CardTitle>
              <CardDescription>
                {/* {selectedGoal?.name} - {selectedGoal?.description} */}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  Selected Date:
                </div>
                <div className="font-medium">
                  {date
                    ? format(date, "MMMM dd, yyyy")
                    : "Please select a date"}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6 justify-center">
                <Button
                  onClick={() => markDateAsCompleted(date)}
                  variant="outline"
                  className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
                <Button
                  onClick={() => markDateAsMissed(date)}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="mr-2 h-4 w-4" />
                  Mark as Missed
                </Button>
              </div>

              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow mx-auto"
                modifiers={{
                  completed: selectedGoal?.completedDates.map(
                    (d) => new Date(d)
                  ),
                  missed: selectedGoal?.missedDates.map((d) => new Date(d)),
                  selected: date ? [new Date(date)] : [],
                }}
                modifiersClassNames={{
                  selected: "bg-purple-100 text-purple-900 font-medium",
                  completed: "bg-green-100 text-green-900",
                  missed: "bg-red-100 text-red-900",
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right column: create new goal */}
        <div className="lg:w-1/2 w-full mt-8 md:mt-0">
          <Card className="h-full shadow-md border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700">Create New Task</CardTitle>
              <CardDescription>Add your goal details below</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleCreateTask}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Learn React"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a short description"
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Create Task
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Goals list */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Your Goals</h2>
        <div className="space-y-6">
          {goals.map((goal) => (
            <Card
              key={goal.id}
              onClick={() => setSelectedGoalId(goal.id)}
              className={`cursor-pointer transition-all ${
                goal.id === selectedGoalId ? "border-purple-400" : ""
              }`}
            >
              <CardHeader>
                <CardTitle>{goal.name}</CardTitle>
                <CardDescription>{goal.description}</CardDescription>
              </CardHeader>
              {/* <CardContent className="text-sm text-gray-600">
                <p>✅ Completed: {goal.completedDates.length} days</p>
                <p>❌ Missed: {goal.missedDates.length} days</p>
                <p>🔥 Current Streak: {goal.currentStreak}</p>
                <p>🏆 Longest Streak: {goal.longestStreak}</p>
              </CardContent> */}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
