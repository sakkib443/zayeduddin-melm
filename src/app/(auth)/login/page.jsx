"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MdOutlineRemoveRedEye, MdOutlineVisibilityOff } from "react-icons/md";
import { FiMail, FiLock, FiCheck, FiShield, FiClock, FiHeadphones } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

import { API_BASE_URL } from "@/config/api";
import Logo from "@/components/sheard/Logo";

import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSuccess = (data) => {
    const token = data?.data?.token || data?.data?.tokens?.accessToken;
    const user = data?.data?.user;

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const userRole = user.role || "student";
      console.log("Logged in user role:", userRole);

      switch (userRole) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "mentor":
          router.push("/dashboard/instructor");
          break;
        case "student":
        case "user":
        default:
          router.push("/");
      }
    } else {
      throw new Error("Invalid response from server");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      handleLoginSuccess(data);
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google Login failed");
      handleLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: FiShield, text: language === "bn" ? "নিরাপদ লগইন" : "Secure Login" },
    { icon: FiClock, text: language === "bn" ? "২৪/৭ অ্যাক্সেস" : "24/7 Access" },
    { icon: FiHeadphones, text: language === "bn" ? "সাপোর্ট টিম" : "Support Team" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#e8f9f9] py-12">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

            {/* Left Side - Info Section */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#021E14] to-[#38a89d] p-8 lg:p-12 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-40 h-40 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-20 left-10 w-24 h-24 border-2 border-white rounded-full"></div>
              </div>

              <div className="relative z-10 h-full flex flex-col justify-center">
                {/* Welcome Message */}
                <div className="mb-8">
                  <div className="mb-6">
                    <Logo color="#ffffff" align="left" size="large" />
                  </div>
                  <h2 className={`text-3xl font-bold mb-2 outfit ${bengaliClass}`}>
                    {language === "bn" ? "স্বাগতম!" : "Welcome Back!"}
                  </h2>
                  <p className={`text-white/80 text-sm ${bengaliClass}`}>
                    {language === "bn"
                      ? "আপনার শেখার যাত্রা চালিয়ে যান"
                      : "Sign in to continue your learning"}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-10">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Icon size={18} />
                        </div>
                        <span className={`text-sm font-medium ${bengaliClass}`}>{feature.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Quote */}
                <div className="mt-auto pt-6 border-t border-white/20">
                  <p className={`text-sm text-white/80 italic ${bengaliClass}`}>
                    {language === "bn"
                      ? "\"শিক্ষা হলো সবচেয়ে শক্তিশালী অস্ত্র যা আপনি পৃথিবী পরিবর্তন করতে পারেন।\""
                      : "\"Education is the most powerful weapon you can use to change the world.\""}
                  </p>
                  <p className="text-xs text-white/60 mt-2">- Nelson Mandela</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="lg:col-span-3 p-8 lg:p-12 flex items-center">
              <div className="w-full max-w-md mx-auto">
                <div className="mb-8">
                  <h3 className={`text-2xl font-bold text-gray-800 mb-2 outfit ${bengaliClass}`}>
                    {language === "bn" ? "লগইন করুন" : "Sign In"}
                  </h3>
                  <p className={`text-gray-500 text-sm ${bengaliClass}`}>
                    {language === "bn" ? "অ্যাকাউন্ট নেই? " : "Don't have an account? "}
                    <Link href="/register" className="text-[#021E14] font-semibold hover:underline">
                      {language === "bn" ? "রেজিস্টার করুন" : "Create one"}
                    </Link>
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${bengaliClass}`}>
                      {language === "bn" ? "ইমেইল ঠিকানা" : "Email Address"}
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={language === "bn" ? "আপনার ইমেইল" : "you@example.com"}
                        className={`w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-gray-50 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition ${bengaliClass}`}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${bengaliClass}`}>
                      {language === "bn" ? "পাসওয়ার্ড" : "Password"}
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder={language === "bn" ? "পাসওয়ার্ড দিন" : "Enter password"}
                        className={`w-full pl-11 pr-12 py-3 rounded-full border border-gray-200 bg-gray-50 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition ${bengaliClass}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-[#021E14] transition"
                      >
                        {showPassword ? <MdOutlineVisibilityOff size={20} /> : <MdOutlineRemoveRedEye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${rememberMe ? 'bg-[#021E14] border-[#021E14]' : 'border-gray-300'}`}>
                        {rememberMe && <FiCheck className="text-white" size={12} />}
                      </div>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="hidden"
                      />
                      <span className={`text-sm text-gray-600 ${bengaliClass}`}>
                        {language === "bn" ? "মনে রাখুন" : "Remember me"}
                      </span>
                    </label>
                    <Link href="/forgot-password" className={`text-sm text-[#021E14] hover:underline font-medium ${bengaliClass}`}>
                      {language === "bn" ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}
                    </Link>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-sm text-center font-medium">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 rounded-full text-white font-semibold shadow-lg transition text-base ${loading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#021E14] to-[#38a89d] hover:shadow-xl hover:-translate-y-0.5"
                      } ${bengaliClass}`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                        {language === "bn" ? "লগইন হচ্ছে..." : "Signing in..."}
                      </span>
                    ) : (
                      language === "bn" ? "লগইন করুন" : "Sign In"
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-gray-400 font-medium">
                      {language === "bn" ? "অথবা" : "Or continue with"}
                    </span>
                  </div>
                </div>

                {/* Google Login Button */}
                <div className="flex justify-center">
                  <div className="w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError("Google Login Failed")}
                      useOneTap
                      theme="outline"
                      size="large"
                      width="100%"
                      shape="pill"
                      text="continue_with"
                    />
                  </div>
                </div>

                {/* Help Text */}
                <p className={`text-xs text-gray-400 text-center mt-6 ${bengaliClass}`}>
                  {language === "bn"
                    ? "সমস্যা হচ্ছে? আমাদের সাপোর্ট টিমে যোগায়োগ করুন"
                    : "Having trouble? Contact our support team"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

