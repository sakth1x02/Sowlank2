// Get the auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

const twoMinuteService = {
  // Task Services
  createTask: async (taskData) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/twominuterule/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      const res = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: res.message || "Failed to create task",
        };
      }

      return {
        success: true,
        data: res.data?.task,
      };
    } catch (error) {
      console.error("Error creating task:", error);
      return {
        success: false,
        error: error.message || "Failed to create task",
      };
    }
  },

  getTasks: async () => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/twominuterule/tasks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: res.message || "Failed to fetch tasks",
        };
      }

      return {
        success: true,
        data: res.data?.tasks || [],
      };
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch tasks",
        data: [],
      };
    }
  },

  updateTask: async (taskId, taskData) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/twominuterule/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      const res = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: res.message || "Failed to update task",
        };
      }

      return {
        success: true,
        data: res.data?.task,
        points: res.data?.points,
        totalPoints: res.data?.totalPoints,
      };
    } catch (error) {
      console.error("Error updating task:", error);
      return {
        success: false,
        error: error.message || "Failed to update task",
      };
    }
  },

  deleteTask: async (taskId) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/twominuterule/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: res.message || "Failed to delete task",
        };
      }

      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error deleting task:", error);
      return {
        success: false,
        error: error.message || "Failed to delete task",
      };
    }
  },
};

export default twoMinuteService;
