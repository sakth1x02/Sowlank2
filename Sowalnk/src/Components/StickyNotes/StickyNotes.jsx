import React, { useState, useEffect } from "react";
import {
  User,
  Target,
  Trophy,
  Zap,
  Heart,
  Shield,
  Sword,
  Star,
  Package,
  Award,
  Users,
  Calendar,
  Bell,
  Settings,
  Crown,
  Flame,
  Clock,
  Gift,
  ChevronRight,
  Lock,
  Unlock,
} from "lucide-react";

export default function UltimateSoloLevelingSystem() {
  const [activeTab, setActiveTab] = useState("status");
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [expToNext, setExpToNext] = useState(100);
  const [mp, setMp] = useState(50);
  const [maxMp, setMaxMp] = useState(50);
  const [fatigue, setFatigue] = useState(0);
  const [maxFatigue] = useState(100);
  const [hunterRank, setHunterRank] = useState("E");
  const [title, setTitle] = useState("Weakest Hunter");
  const [loginStreak, setLoginStreak] = useState(3);
  const [lastLogin, setLastLogin] = useState(new Date().toDateString());

  const [playerStats, setPlayerStats] = useState({
    strength: 10,
    agility: 8,
    intelligence: 12,
    vitality: 15,
    sense: 9,
    attackPower: 25,
    defense: 18,
    speed: 12,
  });

  const [skillPoints, setSkillPoints] = useState(5);
  const [skills, setSkills] = useState({
    productivity: { level: 1, maxLevel: 10, unlocked: true },
    focus: { level: 0, maxLevel: 8, unlocked: false },
    leadership: { level: 0, maxLevel: 6, unlocked: false },
    timeManagement: { level: 0, maxLevel: 12, unlocked: true },
    creativity: { level: 0, maxLevel: 9, unlocked: false },
    persistence: { level: 1, maxLevel: 15, unlocked: true },
  });

  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: "Energy Potion",
      type: "consumable",
      quantity: 3,
      effect: "Restore 25 MP",
    },
    {
      id: 2,
      name: "Focus Crystal",
      type: "equipment",
      quantity: 1,
      effect: "+5 Intelligence",
    },
    {
      id: 3,
      name: "Time Stone",
      type: "rare",
      quantity: 1,
      effect: "Complete any task instantly",
    },
    {
      id: 4,
      name: "Strength Elixir",
      type: "consumable",
      quantity: 2,
      effect: "+10 Strength for 1 hour",
    },
  ]);

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first task",
      unlocked: true,
      reward: 100,
    },
    {
      id: 2,
      name: "Level Up!",
      description: "Reach level 5",
      unlocked: false,
      reward: 200,
    },
    {
      id: 3,
      name: "Task Master",
      description: "Complete 50 tasks",
      unlocked: false,
      reward: 500,
    },
    {
      id: 4,
      name: "Week Warrior",
      description: "7-day login streak",
      unlocked: false,
      reward: 300,
    },
    {
      id: 5,
      name: "Boss Slayer",
      description: "Complete a Boss Quest",
      unlocked: false,
      reward: 1000,
    },
  ]);

  const [quests, setQuests] = useState([
    {
      id: 1,
      title: "Complete 5 daily tasks",
      progress: 3,
      total: 5,
      reward: 150,
      type: "daily",
      difficulty: "D",
      timeLimit: "24 hours",
    },
    {
      id: 2,
      title: "Finish project documentation",
      progress: 0,
      total: 1,
      reward: 300,
      type: "main",
      difficulty: "C",
      timeLimit: "7 days",
    },
    {
      id: 3,
      title: "Review code for 2 hours",
      progress: 1,
      total: 2,
      reward: 200,
      type: "daily",
      difficulty: "D",
      timeLimit: "24 hours",
    },
    {
      id: 4,
      title: "[BOSS] Launch new product feature",
      progress: 0,
      total: 1,
      reward: 2000,
      type: "boss",
      difficulty: "A",
      timeLimit: "30 days",
    },
    {
      id: 5,
      title: "Weekly Learning Challenge",
      progress: 2,
      total: 7,
      reward: 800,
      type: "weekly",
      difficulty: "B",
      timeLimit: "7 days",
    },
  ]);

  const [dailyTasks, setDailyTasks] = useState([
    {
      id: 1,
      task: "Morning workout",
      completed: false,
      exp: 50,
      mp: 5,
      difficulty: "D",
    },
    {
      id: 2,
      task: "Read for 30 minutes",
      completed: true,
      exp: 30,
      mp: 3,
      difficulty: "E",
    },
    {
      id: 3,
      task: "Code review",
      completed: false,
      exp: 40,
      mp: 4,
      difficulty: "D",
    },
    {
      id: 4,
      task: "Team standup",
      completed: true,
      exp: 20,
      mp: 2,
      difficulty: "E",
    },
    {
      id: 5,
      task: "Update documentation",
      completed: false,
      exp: 35,
      mp: 3,
      difficulty: "D",
    },
  ]);

  const [partyMembers, setPartyMembers] = useState([
    { id: 1, name: "Alex", level: 8, role: "Developer", online: true },
    { id: 2, name: "Sam", level: 12, role: "Designer", online: false },
    { id: 3, name: "Jordan", level: 6, role: "Manager", online: true },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Daily login bonus available!",
      time: "2 min ago",
      type: "bonus",
    },
    {
      id: 2,
      message: "Party member Alex completed a quest",
      time: "5 min ago",
      type: "party",
    },
    {
      id: 3,
      message: "New achievement unlocked!",
      time: "1 hour ago",
      type: "achievement",
    },
  ]);

  // Task creation states
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    task: "",
    exp: 30,
    mp: 3,
    difficulty: "D",
  });

  const [showAddQuest, setShowAddQuest] = useState(false);
  const [newQuest, setNewQuest] = useState({
    title: "",
    total: 1,
    reward: 100,
    type: "daily",
    difficulty: "D",
    timeLimit: "24 hours",
  });

  // Rank progression system
  const rankThresholds = {
    E: 0,
    D: 10,
    C: 25,
    B: 50,
    A: 100,
    S: 200,
  };

  const titlesByRank = {
    E: "Weakest Hunter",
    D: "Novice Hunter",
    C: "Skilled Hunter",
    B: "Elite Hunter",
    A: "Master Hunter",
    S: "Shadow Monarch",
  };

  // Sound effects simulation
  const playSound = (type) => {
    console.log(`🔊 ${type} sound effect played!`);
  };

  // Level up logic with rank progression
  const levelUp = () => {
    const newLevel = level + 1;
    setLevel(newLevel);

    // Check for rank up
    Object.entries(rankThresholds).forEach(([rank, threshold]) => {
      if (newLevel >= threshold && rankThresholds[hunterRank] < threshold) {
        setHunterRank(rank);
        setTitle(titlesByRank[rank]);
        playSound("rank_up");
        setNotifications((prev) => [
          {
            id: Date.now(),
            message: `Rank up! You are now ${rank}-Rank: ${titlesByRank[rank]}`,
            time: "now",
            type: "rank",
          },
          ...prev,
        ]);
      }
    });

    // Stat increases
    setPlayerStats((prev) => ({
      strength: prev.strength + 2,
      agility: prev.agility + 1,
      intelligence: prev.intelligence + 2,
      vitality: prev.vitality + 3,
      sense: prev.sense + 1,
      attackPower: prev.attackPower + 5,
      defense: prev.defense + 3,
      speed: prev.speed + 2,
    }));

    setMaxMp((prev) => prev + 10);
    setMp((prev) => prev + 10);
    setSkillPoints((prev) => prev + 2);
    playSound("level_up");
  };

  const completeTask = (taskId) => {
    setDailyTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId && !task.completed) {
          const newExp = exp + task.exp;
          const newMp = Math.min(mp + task.mp, maxMp);
          const newFatigue = Math.min(fatigue + 5, maxFatigue);

          setExp(newExp);
          setMp(newMp);
          setFatigue(newFatigue);

          if (newExp >= expToNext) {
            levelUp();
            setExp(newExp - expToNext);
            setExpToNext((prev) => Math.floor(prev * 1.2));
          }

          playSound("task_complete");
          return { ...task, completed: true };
        }
        return task;
      })
    );
  };

  const upgradeSkill = (skillName) => {
    if (
      skillPoints > 0 &&
      skills[skillName].level < skills[skillName].maxLevel
    ) {
      setSkills((prev) => ({
        ...prev,
        [skillName]: { ...prev[skillName], level: prev[skillName].level + 1 },
      }));
      setSkillPoints((prev) => prev - 1);
      playSound("skill_upgrade");
    }
  };

  const useItem = (itemId) => {
    const item = inventory.find((i) => i.id === itemId);
    if (item && item.quantity > 0) {
      if (item.type === "consumable") {
        if (item.name === "Energy Potion") {
          setMp((prev) => Math.min(prev + 25, maxMp));
        }
        setInventory((prev) =>
          prev.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
          )
        );
        playSound("item_use");
      }
    }
  };

  const claimDailyBonus = () => {
    const today = new Date().toDateString();
    if (lastLogin !== today) {
      const bonus = loginStreak * 50;
      setExp((prev) => prev + bonus);
      setLoginStreak((prev) => prev + 1);
      setLastLogin(today);
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `Daily bonus claimed! +${bonus} EXP (${loginStreak} day streak)`,
          time: "now",
          type: "bonus",
        },
        ...prev,
      ]);
      playSound("bonus_claim");
    }
  };

  // Add new task
  const addDailyTask = () => {
    if (newTask.task.trim()) {
      const task = {
        id: Date.now(),
        task: newTask.task,
        completed: false,
        exp: parseInt(newTask.exp),
        mp: parseInt(newTask.mp),
        difficulty: newTask.difficulty,
      };
      setDailyTasks((prev) => [...prev, task]);
      setNewTask({ task: "", exp: 30, mp: 3, difficulty: "D" });
      setShowAddTask(false);
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `New daily task added: ${task.task}`,
          time: "now",
          type: "task",
        },
        ...prev,
      ]);
      playSound("task_add");
    }
  };

  // Add new quest
  const addQuest = () => {
    if (newQuest.title.trim()) {
      const quest = {
        id: Date.now(),
        title: newQuest.title,
        progress: 0,
        total: parseInt(newQuest.total),
        reward: parseInt(newQuest.reward),
        type: newQuest.type,
        difficulty: newQuest.difficulty,
        timeLimit: newQuest.timeLimit,
      };
      setQuests((prev) => [...prev, quest]);
      setNewQuest({
        title: "",
        total: 1,
        reward: 100,
        type: "daily",
        difficulty: "D",
        timeLimit: "24 hours",
      });
      setShowAddQuest(false);
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `New quest created: ${quest.title}`,
          time: "now",
          type: "quest",
        },
        ...prev,
      ]);
      playSound("quest_add");
    }
  };

  // Delete task
  const deleteTask = (taskId) => {
    setDailyTasks((prev) => prev.filter((task) => task.id !== taskId));
    playSound("task_delete");
  };

  // Delete quest
  const deleteQuest = (questId) => {
    setQuests((prev) => prev.filter((quest) => quest.id !== questId));
    playSound("quest_delete");
  };

  const StatBar = ({ label, value, max, icon: Icon, color = "blue" }) => (
    <div className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-400/30 rounded">
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4 text-blue-300" />
        <span className="text-blue-100 text-sm">{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-20 h-2 bg-blue-900/50 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-${color}-400 to-${
              color === "blue" ? "cyan" : color
            }-300 transition-all duration-500`}
            style={{
              width: `${
                max ? (value / max) * 100 : Math.min((value / 50) * 100, 100)
              }%`,
            }}
          />
        </div>
        <span className="text-blue-100 font-mono text-sm min-w-[3rem]">
          {max ? `${value}/${max}` : value}
        </span>
      </div>
    </div>
  );

  const QuestItem = ({ quest }) => {
    const difficultyColors = {
      E: "text-gray-400 border-gray-400/30",
      D: "text-green-400 border-green-400/30",
      C: "text-blue-400 border-blue-400/30",
      B: "text-purple-400 border-purple-400/30",
      A: "text-red-400 border-red-400/30",
      S: "text-yellow-400 border-yellow-400/30",
    };

    return (
      <div
        className={`p-4 border rounded backdrop-blur-sm ${
          quest.type === "boss"
            ? "bg-red-900/20 border-red-400/30"
            : quest.type === "weekly"
            ? "bg-purple-900/20 border-purple-400/30"
            : "bg-blue-900/20 border-blue-400/30"
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-blue-100 font-medium">{quest.title}</h3>
          <div className="flex space-x-2">
            <span
              className={`px-2 py-1 rounded text-xs border ${
                difficultyColors[quest.difficulty]
              }`}
            >
              {quest.difficulty}-RANK
            </span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                quest.type === "boss"
                  ? "bg-red-500/20 text-red-300 border border-red-400/30"
                  : quest.type === "weekly"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                  : quest.type === "main"
                  ? "bg-orange-500/20 text-orange-300 border border-orange-400/30"
                  : "bg-blue-500/20 text-blue-300 border border-blue-400/30"
              }`}
            >
              {quest.type.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="text-xs text-blue-300 mb-2">⏰ {quest.timeLimit}</div>
        <div className="flex justify-between items-center">
          <div className="flex-1 mr-4">
            <div className="flex justify-between text-xs text-blue-300 mb-1">
              <span>Progress</span>
              <span>
                {quest.progress}/{quest.total}
              </span>
            </div>
            <div className="w-full h-2 bg-blue-900/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-500"
                style={{ width: `${(quest.progress / quest.total) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-yellow-300 text-sm font-mono">
              +{quest.reward} EXP
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header with Notifications */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
              SYSTEM
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-cyan-300 mx-auto rounded-full" />
          </div>
          <div className="relative">
            <Bell className="w-6 h-6 text-blue-300 cursor-pointer" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>
        </div>

        {/* Player Info Panel */}
        <div className="bg-blue-900/10 border border-blue-400/30 rounded-lg p-6 mb-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full flex items-center justify-center relative">
                <User className="w-10 h-10 text-black" />
                <Crown className="w-6 h-6 text-yellow-400 absolute -top-2 -right-1" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-100">Hunter</h2>
                <p className="text-blue-300">{hunterRank}-Rank</p>
                <p className="text-yellow-300 text-sm">{title}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-300 text-sm">
                    {loginStreak} day streak
                  </span>
                </div>
              </div>
            </div>

            {/* Level & EXP */}
            <div>
              <div className="text-3xl font-bold text-blue-100">LV.{level}</div>
              <div className="text-blue-300 mb-2">
                Next: {expToNext - exp} EXP
              </div>
              <div className="w-full h-3 bg-blue-900/50 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-1000 shadow-lg shadow-blue-400/50"
                  style={{ width: `${(exp / expToNext) * 100}%` }}
                />
              </div>
              <button
                onClick={claimDailyBonus}
                className="bg-gradient-to-r from-green-500 to-emerald-400 text-white px-4 py-2 rounded text-sm hover:from-green-600 hover:to-emerald-500 transition-all"
              >
                <Gift className="w-4 h-4 inline mr-1" />
                Daily Bonus
              </button>
            </div>

            {/* Resources */}
            <div className="space-y-2">
              <StatBar
                label="MP"
                value={mp}
                max={maxMp}
                icon={Zap}
                color="blue"
              />
              <StatBar
                label="Fatigue"
                value={fatigue}
                max={maxFatigue}
                icon={Clock}
                color="red"
              />
              <div className="text-right">
                <span className="text-yellow-300 font-mono">
                  Skill Points: {skillPoints}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 bg-blue-900/10 p-1 rounded-lg border border-blue-400/30">
          {[
            { id: "status", label: "Status", icon: User },
            { id: "quests", label: "Quests", icon: Target },
            { id: "daily", label: "Daily Tasks", icon: Trophy },
            { id: "skills", label: "Skills", icon: Star },
            { id: "inventory", label: "Inventory", icon: Package },
            { id: "achievements", label: "Achievements", icon: Award },
            { id: "party", label: "Party", icon: Users },
            { id: "calendar", label: "Calendar", icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 py-2 px-3 rounded transition-all text-sm ${
                activeTab === tab.id
                  ? "bg-blue-400/20 text-blue-100 border border-blue-400/50"
                  : "text-blue-300 hover:bg-blue-900/20"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Panels */}
        <div className="bg-blue-900/10 border border-blue-400/30 rounded-lg p-6 backdrop-blur-sm">
          {activeTab === "status" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-blue-100 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Character Stats
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatBar
                  label="Strength"
                  value={playerStats.strength}
                  icon={Sword}
                />
                <StatBar
                  label="Agility"
                  value={playerStats.agility}
                  icon={Zap}
                />
                <StatBar
                  label="Intelligence"
                  value={playerStats.intelligence}
                  icon={Star}
                />
                <StatBar
                  label="Vitality"
                  value={playerStats.vitality}
                  icon={Heart}
                />
                <StatBar
                  label="Sense"
                  value={playerStats.sense}
                  icon={Shield}
                />
                <StatBar
                  label="Attack Power"
                  value={playerStats.attackPower}
                  icon={Sword}
                />
                <StatBar
                  label="Defense"
                  value={playerStats.defense}
                  icon={Shield}
                />
                <StatBar label="Speed" value={playerStats.speed} icon={Zap} />
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-blue-100 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Skill Tree
                </h3>
                <div className="text-yellow-300 font-mono">
                  Available Points: {skillPoints}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(skills).map(([skillName, skill]) => (
                  <div
                    key={skillName}
                    className={`p-4 border rounded ${
                      skill.unlocked
                        ? "bg-blue-900/20 border-blue-400/30"
                        : "bg-gray-900/20 border-gray-600/30"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-blue-100 capitalize">
                        {skillName.replace(/([A-Z])/g, " $1").trim()}
                      </h4>
                      {skill.unlocked ? (
                        <Unlock className="w-4 h-4 text-green-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-300 text-sm">
                        Level {skill.level}/{skill.maxLevel}
                      </span>
                      {skill.unlocked &&
                        skill.level < skill.maxLevel &&
                        skillPoints > 0 && (
                          <button
                            onClick={() => upgradeSkill(skillName)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                          >
                            Upgrade
                          </button>
                        )}
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-500"
                        style={{
                          width: `${(skill.level / skill.maxLevel) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-blue-100 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Inventory
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 border rounded ${
                      item.type === "rare"
                        ? "bg-purple-900/20 border-purple-400/30"
                        : item.type === "equipment"
                        ? "bg-orange-900/20 border-orange-400/30"
                        : "bg-blue-900/20 border-blue-400/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-blue-100 font-medium">{item.name}</h4>
                      <span className="text-blue-300 text-sm">
                        x{item.quantity}
                      </span>
                    </div>
                    <p className="text-blue-300 text-sm mb-2">{item.effect}</p>
                    {item.type === "consumable" && item.quantity > 0 && (
                      <button
                        onClick={() => useItem(item.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Use
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-blue-100 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 border rounded ${
                      achievement.unlocked
                        ? "bg-green-900/20 border-green-400/30"
                        : "bg-gray-900/20 border-gray-600/30"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Trophy
                        className={`w-6 h-6 ${
                          achievement.unlocked
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                      />
                      <div className="flex-1">
                        <h4 className="text-blue-100 font-medium">
                          {achievement.name}
                        </h4>
                        <p className="text-blue-300 text-sm">
                          {achievement.description}
                        </p>
                        <span className="text-yellow-300 text-sm">
                          +{achievement.reward} EXP
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "party" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-blue-100 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Party Members
              </h3>
              <div className="space-y-3">
                {partyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 bg-blue-900/20 border border-blue-400/30 rounded"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            member.online ? "bg-green-400" : "bg-gray-400"
                          }`}
                        />
                        <div>
                          <h4 className="text-blue-100 font-medium">
                            {member.name}
                          </h4>
                          <p className="text-blue-300 text-sm">
                            {member.role} • Level {member.level}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-sm ${
                          member.online ? "text-green-300" : "text-gray-400"
                        }`}
                      >
                        {member.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "quests" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-blue-100 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Active Quests
                </h3>
                <button
                  onClick={() => setShowAddQuest(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-400 text-white px-4 py-2 rounded hover:from-purple-600 hover:to-pink-500 transition-all flex items-center space-x-2"
                >
                  <span>+</span>
                  <span>Add Quest</span>
                </button>
              </div>

              {/* Add Quest Modal */}
              {showAddQuest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-blue-900/90 border border-blue-400/30 rounded-lg p-6 w-full max-w-md backdrop-blur-sm">
                    <h4 className="text-xl font-bold text-blue-100 mb-4">
                      Create New Quest
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-blue-300 text-sm mb-2">
                          Quest Title
                        </label>
                        <input
                          type="text"
                          value={newQuest.title}
                          onChange={(e) =>
                            setNewQuest((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="w-full p-3 bg-blue-900/50 border border-blue-400/30 rounded text-blue-100 focus:border-blue-400 focus:outline-none"
                          placeholder="Enter quest title..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-blue-300 text-sm mb-2">
                            Target Goal
                          </label>
                          <input
                            type="number"
                            value={newQuest.total}
                            onChange={(e) =>
                              setNewQuest((prev) => ({
                                ...prev,
                                total: e.target.value,
                              }))
                            }
                            className="w-full p-3 bg-blue-900/50 border border-blue-400/30 rounded text-blue-100 focus:border-blue-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-blue-300 text-sm mb-2">
                            EXP Reward
                          </label>
                          <input
                            type="number"
                            value={newQuest.reward}
                            onChange={(e) =>
                              setNewQuest((prev) => ({
                                ...prev,
                                reward: e.target.value,
                              }))
                            }
                            className="w-full p-3 bg-blue-900/50 border border-blue-400/30 rounded text-blue-100 focus:border-blue-400 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-blue-300 text-sm mb-2">
                            Quest Type
                          </label>
                          <select
                            value={newQuest.type}
                            onChange={(e) =>
                              setNewQuest((prev) => ({
                                ...prev,
                                type: e.target.value,
                              }))
                            }
                            className="w-full p-3 bg-blue-900/50 border border-blue-400/30 rounded text-blue-100 focus:border-blue-400 focus:outline-none"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="main">Main Quest</option>
                            <option value="special">Special</option>
                            <option value="boss">Boss Quest</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-blue-300 text-sm mb-2">
                            Difficulty
                          </label>
                          <select
                            value={newQuest.difficulty}
                            onChange={(e) =>
                              setNewQuest((prev) => ({
                                ...prev,
                                difficulty: e.target.value,
                              }))
                            }
                            className="w-full p-3 bg-blue-900/50 border border-blue-400/30 rounded text-blue-100 focus:border-blue-400 focus:outline-none"
                          >
                            <option value="E">E-Rank</option>
                            <option value="D">D-Rank</option>
                            <option value="C">C-Rank</option>
                            <option value="B">B-Rank</option>
                            <option value="A">A-Rank</option>
                            <option value="S">S-Rank</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-blue-300 text-sm mb-2">
                          Time Limit
                        </label>
                        <input
                          type="text"
                          value={newQuest.timeLimit}
                          onChange={(e) =>
                            setNewQuest((prev) => ({
                              ...prev,
                              timeLimit: e.target.value,
                            }))
                          }
                          className="w-full p-3 bg-blue-900/50 border border-blue-400/30 rounded text-blue-100 focus:border-blue-400 focus:outline-none"
                          placeholder="e.g., 24 hours, 7 days, 1 month"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={addQuest}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-all"
                        >
                          Create Quest
                        </button>
                        <button
                          onClick={() => setShowAddQuest(false)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {quests.map((quest) => (
                  <div key={quest.id} className="relative group">
                    <QuestItem quest={quest} />
                    <button
                      onClick={() => deleteQuest(quest.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-all"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "daily" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-blue-100 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Daily Tasks
                </h3>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded hover:from-blue-600 hover:to-cyan-500 transition-all flex items-center space-x-2"
                >
                  <span>+</span>
                  <span>Add Task</span>
                </button>
              </div>

              {/* Add Task Modal */}
              {showAddTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-blue-900/90 border border-blue-400/30 rounded-lg p-6 w-full max-w-md backdrop-blur-sm">
                    <h4 className="text-xl font-bold text-blue-100 mb-4">
                      Create New Daily Task
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-blue-300 text-sm mb-2">
                          Task Description
                        </label>
                        <input
                          type="text"
                          value={newTask.task}
                          onChange={(e) =>
                            setNewTask((prev) => ({
                              ...prev,
                              task: e.target.value,
                            }))
                          }
                          className="w-full p-3 bg-blue-900/50 border border-blue-400/30 rounded text-blue-100 focus:border-blue-400 focus:outline-none"
                          placeholder="Enter task description..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-blue-300 text-sm mb-2">
                            EXP Reward
                          </label>
                          <input
                            type="number"
                            value={newTask.exp}
                            onChange={(e) =>
                              setNewTask((prev) => ({
                                ...prev,
                                exp: e.target.value,
                              }))
                            }
                            className="w-full p-3 bg-blue-900/50 border border-blue-400/30 rounded text-blue-100 focus:border-blue-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-blue-300 text-sm mb-2">
                            MP Cost
                          </label>
                          <input
                            type="number"
                            value={newTask.mp}
                            onChange={(e) =>
                              setNewTask((prev) => ({
                                ...prev,
                                mp: e.target.value,
                              }))
                            }
                            className="w-full p-3 bg-blue-900/50 border border-blue-400/30 rounded text-blue-100 focus:border-blue-400 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-blue-300 text-sm mb-2">
                          Difficulty Rank
                        </label>
                        <select
                          value={newTask.difficulty}
                          onChange={(e) =>
                            setNewTask((prev) => ({
                              ...prev,
                              difficulty: e.target.value,
                            }))
                          }
                          className="w-full p-3 bg-blue-900/50 border border-blue-400/30 rounded text-blue-100 focus:border-blue-400 focus:outline-none"
                        >
                          <option value="E">E-Rank (Easiest)</option>
                          <option value="D">D-Rank (Easy)</option>
                          <option value="C">C-Rank (Medium)</option>
                          <option value="B">B-Rank (Hard)</option>
                          <option value="A">A-Rank (Very Hard)</option>
                          <option value="S">S-Rank (Extreme)</option>
                        </select>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={addDailyTask}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-all"
                        >
                          Create Task
                        </button>
                        <button
                          onClick={() => setShowAddTask(false)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {dailyTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 border rounded backdrop-blur-sm transition-all group ${
                      task.completed
                        ? "bg-green-900/20 border-green-400/30"
                        : "bg-blue-900/20 border-blue-400/30 hover:border-blue-400/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => completeTask(task.id)}
                          className="w-5 h-5 rounded border-2 border-blue-400 bg-transparent checked:bg-blue-400 checked:border-blue-400 focus:ring-blue-400 focus:ring-2"
                        />
                        <div className="flex-1">
                          <span
                            className={`${
                              task.completed
                                ? "line-through text-green-300"
                                : "text-blue-100"
                            }`}
                          >
                            {task.task}
                          </span>
                          <div className="text-xs text-blue-300">
                            {task.difficulty}-Rank • MP Cost: {task.mp}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-300 font-mono text-sm">
                          +{task.exp} EXP
                        </span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-blue-100 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Weekly & Monthly Challenges
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg text-blue-100 font-medium">
                    This Week
                  </h4>
                  <div className="p-4 bg-purple-900/20 border border-purple-400/30 rounded">
                    <h5 className="text-purple-300 font-medium mb-2">
                      Complete 20 Tasks
                    </h5>
                    <div className="flex justify-between text-sm text-purple-300 mb-2">
                      <span>Progress</span>
                      <span>12/20</span>
                    </div>
                    <div className="w-full h-2 bg-purple-900/50 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-gradient-to-r from-purple-400 to-pink-300 w-3/5" />
                    </div>
                    <div className="text-yellow-300 text-sm">
                      Reward: +1000 EXP, Rare Item
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg text-blue-100 font-medium">
                    This Month
                  </h4>
                  <div className="p-4 bg-orange-900/20 border border-orange-400/30 rounded">
                    <h5 className="text-orange-300 font-medium mb-2">
                      Master a New Skill
                    </h5>
                    <div className="flex justify-between text-sm text-orange-300 mb-2">
                      <span>Progress</span>
                      <span>1/3</span>
                    </div>
                    <div className="w-full h-2 bg-orange-900/50 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-gradient-to-r from-orange-400 to-red-300 w-1/3" />
                    </div>
                    <div className="text-yellow-300 text-sm">
                      Reward: +2500 EXP, Title Upgrade
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Panel */}
        {notifications.length > 0 && (
          <div className="mt-6 bg-blue-900/10 border border-blue-400/30 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-blue-100 mb-3 flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Recent Notifications
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between p-2 bg-blue-900/20 rounded"
                >
                  <span className="text-blue-100 text-sm">
                    {notification.message}
                  </span>
                  <span className="text-blue-400 text-xs">
                    {notification.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-blue-900/20 border border-blue-400/30 rounded p-4 text-center">
            <div className="text-2xl font-bold text-blue-100">{level}</div>
            <div className="text-blue-300 text-sm">Level</div>
          </div>
          <div className="bg-blue-900/20 border border-blue-400/30 rounded p-4 text-center">
            <div className="text-2xl font-bold text-blue-100">{exp}</div>
            <div className="text-blue-300 text-sm">Total EXP</div>
          </div>
          <div className="bg-blue-900/20 border border-blue-400/30 rounded p-4 text-center">
            <div className="text-2xl font-bold text-blue-100">
              {dailyTasks.filter((t) => t.completed).length}
            </div>
            <div className="text-blue-300 text-sm">Tasks Done</div>
          </div>
          <div className="bg-blue-900/20 border border-blue-400/30 rounded p-4 text-center">
            <div className="text-2xl font-bold text-blue-100">
              {Object.values(playerStats).reduce((a, b) => a + b, 0)}
            </div>
            <div className="text-blue-300 text-sm">Total Stats</div>
          </div>
          <div className="bg-blue-900/20 border border-blue-400/30 rounded p-4 text-center">
            <div className="text-2xl font-bold text-blue-100">{hunterRank}</div>
            <div className="text-blue-300 text-sm">Rank</div>
          </div>
          <div className="bg-blue-900/20 border border-blue-400/30 rounded p-4 text-center">
            <div className="text-2xl font-bold text-blue-100">
              {loginStreak}
            </div>
            <div className="text-blue-300 text-sm">Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
}
