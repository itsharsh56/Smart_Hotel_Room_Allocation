const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
};

export const roomApi = {
  addRoom: (data) =>
    request("/rooms", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getRooms: () => request("/rooms"),
  searchRooms: (params) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        query.append(key, value);
      }
    });

    return request(`/rooms/search?${query.toString()}`);
  },
  allocateRoom: (data) =>
    request("/rooms/allocate", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getLogs: () => request("/rooms/logs"),
};
