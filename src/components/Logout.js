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
        console.log("Tokens removed"); // Debugging

        setTimeout(() => {
            window.location.reload();  // ✅ Force reload to clear memory
            window.location.href = "/login";  // Redirect after reload
        }, 500);
    }
};

