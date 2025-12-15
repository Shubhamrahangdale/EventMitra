import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved user on mount
    const savedUser = localStorage.getItem("eventmitra_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    const userInfo = {
      email: userData.email,
      name: userData.name || userData.email.split("@")[0],
      avatar: null,
      phone: userData.phone || "",
      role: userData.email.includes("organizer") || userData.email.includes("admin") ? "organizer" : "attendee",
      joinedDate: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    };
    setUser(userInfo);
    localStorage.setItem("eventmitra_user", JSON.stringify(userInfo));
    return userInfo;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eventmitra_user");
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("eventmitra_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
