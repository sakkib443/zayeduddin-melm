"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiLoader } from "react-icons/fi";

const ProtectedRoute = ({ children, role, allowedRoles = [] }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    try {
      const userObj = JSON.parse(user);
      const userRole = userObj.role || "student";

      // Admin can access everything
      if (userRole === "admin") {
        setTimeout(() => setIsAuthorized(true), 0);
        return;
      }

      // Check if user has required role
      const requiredRoles = allowedRoles.length > 0 ? allowedRoles : (role ? [role] : []);

      // Normalize roles - treat 'user' and 'student' as the same
      const normalizedUserRole = (userRole === 'user' || userRole === 'student') ? 'student' : userRole;
      const normalizedRequiredRoles = requiredRoles.map(r => (r === 'user' || r === 'student') ? 'student' : r);

      if (normalizedRequiredRoles.length > 0 && !normalizedRequiredRoles.includes(normalizedUserRole)) {
        // Redirect to user's own dashboard
        switch (userRole) {
          case "mentor":
            router.replace("/dashboard/mentor");
            break;
          case "user":
          case "student":
            router.replace("/dashboard/user");
            break;
          default:
            router.replace("/login");
        }
        return;
      }

      setTimeout(() => setIsAuthorized(true), 0);
    } catch (e) {
      router.replace("/login");
    }
  }, [router, role, allowedRoles]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <FiLoader className="text-4xl text-[#E62D26] animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Verifying Access...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
