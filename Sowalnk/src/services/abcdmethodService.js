// Get the auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// ABCDE Method API service
const abcdmethodService = {
  // Create a new task
  createTask: async (taskData) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/abcdmethod`, {
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

      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error creating task:", error);
      return {
        success: false,
        error: error.message || "Failed to create task",
      };
    }
  },

  // Get all tasks for the authenticated user
  getAllTasks: async () => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/abcdmethod`, {
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

      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch tasks",
      };
    }
  },

  // Delete a task
  deleteTask: async (id) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/abcdmethod/${id}`, {
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

  // Update task completion status
  updateTaskStatus: async (id, isCompleted) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/abcdmethod/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isCompleted }),
      });

      const res = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: res.message || "Failed to update task status",
        };
      }

      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      console.error("Error updating task status:", error);
      return {
        success: false,
        error: error.message || "Failed to update task status",
      };
    }
  },

  // Get user points (now also gets level and badges)
  getUserPoints: async () => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/abcdmethod/points`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: res.message || "Failed to fetch user points",
        };
      }

      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      console.error("Error fetching user points:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch user points",
      };
    }
  },
};

export default abcdmethodService;
