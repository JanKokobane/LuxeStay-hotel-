export const ApiService = {
  async updateProfile(userId: number, data: any) {
    const token = localStorage.getItem("userToken");
    const res = await fetch(
      `https://tango-hotel-backend.onrender.com/api/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
  },

  async deleteProfile(userId: number) {
    const token = localStorage.getItem("userToken");
    const res = await fetch(
      `https://tango-hotel-backend.onrender.com/api/users/${userId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) throw new Error("Failed to delete profile");
    return res.json();
  },
};
