import React from "react";
import { Card, CardContent } from "./ui/card";

const GTDInfo = () => {
  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
              The Getting Things Done (GTD) Methodology
            </h2>

            <p className="mb-6 text-gray-700">
              Getting Things Done (GTD) is a personal productivity system
              developed by David Allen. It helps you organize and manage your
              tasks, commitments, and information in a way that reduces stress
              and increases productivity.
            </p>

            <div className="space-y-6">
              <GTDStep
                number="1"
                title="Capture"
                description="Collect everything that has your attention into trusted external systems. This includes tasks, ideas, commitments, and anything else on your mind."
                tips={[
                  "Use physical and digital tools for capture",
                  "Write down everything that has your attention",
                  "Don't worry about organizing yet",
                  "Clear your mind by getting things out of your head",
                ]}
              />

              <GTDStep
                number="2"
                title="Clarify"
                description="Process what each item means and decide what action to take. Is it actionable? If yes, what's the next action? If not, trash it, reference it, or incubate it."
                tips={[
                  "For each item, ask: 'Is it actionable?'",
                  "If not actionable: trash, reference, or incubate",
                  "If actionable and takes <2 min: do it now",
                  "If actionable: delegate or defer",
                  "Identify the next physical, visible action",
                ]}
              />

              <GTDStep
                number="3"
                title="Organize"
                description="Put things where they belong. Categorize and store items in appropriate lists and systems so you can find them when needed."
                tips={[
                  "Create lists for different contexts (e.g., @home, @work)",
                  "Maintain a calendar for time-specific actions",
                  "Keep a 'Waiting For' list for delegated items",
                  "Store project plans for multi-step outcomes",
                  "File reference materials for later access",
                ]}
              />

              <GTDStep
                number="4"
                title="Reflect"
                description="Review your lists regularly to stay on top of your commitments. Daily reviews keep you focused on immediate actions, while weekly reviews ensure nothing falls through the cracks."
                tips={[
                  "Daily review: Check calendar and context lists",
                  "Weekly review: Process inbox, update lists",
                  "Update project lists and next actions",
                  "Review 'Someday/Maybe' list periodically",
                  "Update and refine your system as needed",
                ]}
              />

              <GTDStep
                number="5"
                title="Engage"
                description="Make choices about what to do based on context, time available, energy level, and priorities. Take action with confidence, knowing you've considered all your options."
                tips={[
                  "Consider context, time, energy, and priority",
                  "Trust your system to make good choices",
                  "Focus on one task at a time",
                  "Use your lists to guide decisions",
                  "Adjust your plans as circumstances change",
                ]}
              />
            </div>

            <div className="mt-8 p-5 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-blue-800">
                Benefits of GTD
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-blue-700">
                <li>Reduced mental load and stress</li>
                <li>Increased productivity and focus</li>
                <li>Improved follow-through on commitments</li>
                <li>Better work-life balance</li>
                <li>Enhanced ability to make strategic decisions</li>
                <li>
                  Greater confidence and control in managing your workload
                </li>
              </ul>
            </div>

            <p className="mt-6 text-sm text-gray-500 text-center">
              Based on the book "Getting Things Done" by David Allen. This app
              implements the core principles of the GTD methodology.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const GTDStep = ({ number, title, description, tips }) => {
  return (
    <div className="border-l-4 border-blue-500 pl-4 py-2">
      <h3 className="text-xl font-bold flex items-center">
        <span className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full mr-2">
          {number}
        </span>
        {title}
      </h3>
      <p className="mt-2 text-gray-700">{description}</p>

      <div className="mt-2">
        <h4 className="font-medium text-blue-700">Key Tips:</h4>
        <ul className="list-disc pl-5 text-sm mt-1 space-y-1 text-gray-600">
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GTDInfo;
