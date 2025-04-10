// Get the auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Pomodoro API service
const pomodoroService = {
  // Create a new pomodoro task
  createpomodoros: async (taskData) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/pomodoro`, {
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
          error: res.message || "Failed to create pomodoro task",
        };
      }

      return { success: true, data: res.data || res };
    } catch (error) {
      console.error("Error creating pomodoro task:", error);
      return {
        success: false,
        error: error.message || "Failed to create pomodoro task",
      };
    }
  },

  // Get all pomodoro tasks for the authenticated user
  getAllpomodoros: async () => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/pomodoro`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: res.message || "Failed to fetch pomodoro tasks",
        };
      }

      return { success: true, data: res.data || res };
    } catch (error) {
      console.error("Error fetching pomodoro tasks:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch pomodoro tasks",
      };
    }
  },

  // Delete a pomodoro task
  deletepomodoros: async (id) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/pomodoro/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: res.message || "Failed to delete pomodoro task",
        };
      }

      return { success: true, data: res.data || res };
    } catch (error) {
      console.error("Error deleting pomodoro task:", error);
      return {
        success: false,
        error: error.message || "Failed to delete pomodoro task",
      };
    }
  },

  // Mark a pomodoro task as completed
  markAsCompleted: async (id) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/pomodoro/${id}/complete`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: res.message || "Failed to mark pomodoro as completed",
        };
      }

      return { success: true, data: res.data || res };
    } catch (error) {
      console.error("Error marking pomodoro as completed:", error);
      return {
        success: false,
        error: error.message || "Failed to mark pomodoro as completed",
      };
    }
  },

  // Update deadline of a pomodoro task
  updateDeadline: async (id, deadline) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/pomodoro/${id}/deadline`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deadline }),
      });

      const res = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: res.message || "Failed to update deadline",
        };
      }

      return { success: true, data: res.data || res };
    } catch (error) {
      console.error("Error updating deadline:", error);
      return {
        success: false,
        error: error.message || "Failed to update deadline",
      };
    }
  },
};

export default pomodoroService;
