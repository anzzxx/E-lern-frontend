import { persistor } from "../Redux/store"; // adjust path if needed

export const handleLogout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");

    if (refreshToken && accessToken) {
      await api.post(
        "http://localhost:8000/api/logout/",
        { refresh: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Failed to logout:", error);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Purge persisted state from redux-persist
    persistor.purge().then(() => {
      console.log("Persisted state purged");
      // Navigate to login after purge
      window.location.href = "/";
    });
  }
};
