// import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   address?: string;
//   avatar: string;
// };

// const defaultUser: User = {
//   id: "guest-1",
//   name: "Aarav Sharma",
//   email: "aarav@gmail.com",
//   phone: "+91 98765 43210",
//   address: "402, Green Residency, MG Road, Bengaluru 560001",
//   avatar: "🧑🏻",
// };

// type AuthContextValue = {
//   user: User;
//   isAuthenticated: boolean;
//   theme: "light" | "dark";
//   toggleTheme: () => void;
//   updateUser: (patch: Partial<User>) => void;
//   login: (email: string, password: string) => Promise<boolean>;
//   register: (name: string, email: string, password: string) => Promise<boolean>;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextValue | null>(null);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User>(defaultUser);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const theme = "light";
//   const toggleTheme = () => {};

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const storedUser = localStorage.getItem("amazecart-user");
//     const storedAuth = localStorage.getItem("amazecart-auth");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     if (storedAuth === "true") setIsAuthenticated(true);
//   }, []);
//   const updateUser = (patch: Partial<User>) => {
//     setUser((u) => {
//       const next = { ...u, ...patch };
//       localStorage.setItem("amazecart-user", JSON.stringify(next));
//       return next;
//     });
//   };

//   const login = async (email: string, password: string) => {
//     if (!email || !password) return false;
//     const nextUser = {
//       ...defaultUser,
//       id: `user-${Date.now()}`,
//       email,
//       name: email.split("@")[0].replace(/\./g, " "),
//       avatar: "🧑",
//     };
//     setUser(nextUser);
//     setIsAuthenticated(true);
//     localStorage.setItem("amazecart-user", JSON.stringify(nextUser));
//     localStorage.setItem("amazecart-auth", "true");
//     return true;
//   };

//   const register = async (name: string, email: string, password: string) => {
//     if (!name || !email || !password) return false;
//     const nextUser = { id: `user-${Date.now()}`, name, email, avatar: "🛍️" };
//     setUser(nextUser);
//     setIsAuthenticated(true);
//     localStorage.setItem("amazecart-user", JSON.stringify(nextUser));
//     localStorage.setItem("amazecart-auth", "true");
//     return true;
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     localStorage.removeItem("amazecart-auth");
//     localStorage.removeItem("amazecart-user");
//   };

//   return <AuthContext.Provider value={{ user, isAuthenticated, theme, toggleTheme, updateUser, login, register, logout }}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }
