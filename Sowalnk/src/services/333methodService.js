// Get the auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

const threeThreeThreeService = {
  // Task Services
  createTask: async (taskData) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/333method/tasks`, {
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

      // Extract task data from the response
      const task = res.data?.task;
      if (!task || !task._id || !task.text) {
        return {
          success: false,
          error: "Invalid task data received from server",
        };
      }

      return {
        success: true,
        data: task,
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
      const response = await fetch(`/api/v1/333method/tasks`, {
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

      // Ensure we return the tasks array from the response
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
      const response = await fetch(`/api/v1/333method/tasks/${taskId}`, {
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

      // Ensure we return the updated task data
      const updatedTask = res.data;
      if (!updatedTask || !updatedTask._id) {
        return {
          success: false,
          error: "Invalid task data received from server",
        };
      }

      return { success: true, data: updatedTask };
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
      const response = await fetch(`/api/v1/333method/tasks/${taskId}`, {
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

  // Session Services
  createSession: async (sessionData) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/333method/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      });

      const res = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: res.message || "Failed to create session",
        };
      }

      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error creating session:", error);
      return {
        success: false,
        error: error.message || "Failed to create session",
      };
    }
  },

  getSessions: async () => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/333method/sessions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: res.message || "Failed to fetch sessions",
        };
      }

      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch sessions",
      };
    }
  },
};

export default threeThreeThreeService;
