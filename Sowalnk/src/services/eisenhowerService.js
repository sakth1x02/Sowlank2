// Get the auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Eisenhower API service
const eisenhowerService = {
  // Create a new task
  createTask: async (taskData) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/eisenhower`, {
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
      const response = await fetch(`/api/v1/eisenhower`, {
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
      const response = await fetch(`/api/v1/eisenhower/${id}`, {
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
      const response = await fetch(`/api/v1/eisenhower/${id}/status`, {
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

      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error updating task status:", error);
      return {
        success: false,
        error: error.message || "Failed to update task status",
      };
    }
  },
};

export default eisenhowerService;
