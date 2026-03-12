"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiLoader } from "react-icons/fi";

/**
 * Decode JWT token and check if it's expired
 * @param {string} token - JWT token
 * @returns {{ valid: boolean, payload: object|null }}
 */
const verifyToken = (token) => {
  try {
    // JWT structure: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, payload: null };

    // Decode the payload (base64url -> JSON)
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    // Check if token has expired
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (now >= payload.exp) {
        return { valid: false, payload };
      }
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, payload: null };
  }
};

/**
 * Clear all auth data and redirect to login
 */
const clearAuthAndRedirect = (router) => {
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  router.replace("/login");
};

const ProtectedRoute = ({ children, role, allowedRoles = [] }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check token validity
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // No token or user data — redirect to login
    if (!token || !user) {
      clearAuthAndRedirect(router);
      return;
    }

    // Verify token is valid and not expired
    const { valid } = verifyToken(token);
    if (!valid) {
      clearAuthAndRedirect(router);
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
          case "instructor":
            router.replace("/dashboard/instructor");
            break;
          case "user":
          case "student":
            router.replace("/dashboard/user");
            break;
          default:
            clearAuthAndRedirect(router);
        }
        return;
      }

      setTimeout(() => setIsAuthorized(true), 0);
    } catch (e) {
      clearAuthAndRedirect(router);
    }
  }, [router, role, allowedRoles]);

  useEffect(() => {
    checkAuth();

    // Periodically check token validity (every 60 seconds)
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        clearAuthAndRedirect(router);
        return;
      }
      const { valid } = verifyToken(token);
      if (!valid) {
        clearAuthAndRedirect(router);
      }
    }, 60000);

    // Listen for 401 responses from API calls (custom event)
    const handleUnauthorized = () => {
      clearAuthAndRedirect(router);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);

    // Listen for storage changes (e.g., another tab logs out)
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        clearAuthAndRedirect(router);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuth, router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <FiLoader className="text-4xl text-[#021E14] animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Verifying Access...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
