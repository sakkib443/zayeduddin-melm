"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MdOutlineRemoveRedEye, MdOutlineVisibilityOff } from "react-icons/md";
import { FiUser, FiMail, FiPhone, FiLock, FiCheck, FiAward, FiUsers, FiBookOpen } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

import { API_BASE_URL } from "@/config/api";
import Logo from "@/components/sheard/Logo";

const Register = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const p = formData.password || "";
    let score = 0;
    if (p.length >= 8) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    setPasswordStrength(score);
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          role: "student",
          status: "active",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Attempt Auto-Login
      let token = data?.data?.token || data?.data?.tokens?.accessToken;
      let user = data?.data?.user;

      // If registration didn't return a token, try explicit login
      if (!token || !user) {
        try {
          const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            }),
          });

          if (loginRes.ok) {
            const loginData = await loginRes.json();
            token = loginData?.data?.token || loginData?.data?.tokens?.accessToken;
            user = loginData?.data?.user;
          }
        } catch (loginErr) {
          console.error("Auto-login failed:", loginErr);
          // Continue to redirect to login if auto-login fails
        }
      }

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect based on role
        const userRole = user.role || "student";
        switch (userRole) {
          case "admin":
            router.push("/dashboard/admin");
            break;
          case "mentor":
            router.push("/dashboard/mentor");
            break;
          default:
            router.push("/");
        }
      } else {
        // Fallback to login page if auto-login logic didn't result in a session
        router.push("/login");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: FiBookOpen, text: language === "bn" ? "??+ ????????? ?????" : "50+ Professional Courses" },
    { icon: FiUsers, text: language === "bn" ? "?,???+ ??? ??????????" : "4,200+ Successful Students" },
    { icon: FiAward, text: language === "bn" ? "??????????? ???????????" : "Industry Certificates" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#e8f9f9] py-12">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

            {/* Left Side - Info Section */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#E62D26] to-[#38a89d] p-8 lg:p-12 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-40 h-40 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-20 left-10 w-24 h-24 border-2 border-white rounded-full"></div>
                <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
              </div>

              <div className="relative z-10">
                {/* Welcome Message */}
                <div className="mb-10">
                  <div className="mb-6">
                    <Logo color="#ffffff" align="left" size="large" />
                  </div>
                  <h2 className={`text-3xl font-bold mb-3 outfit ${bengaliClass}`}>
                    {language === "bn" ? "????? ?????????? ???? ????" : "Start Your Career Journey"}
                  </h2>
                  <p className={`text-white/80 text-sm leading-relaxed ${bengaliClass}`}>
                    {language === "bn"
                      ? "???? ?????????? ???? ???? ??? ?????????? ?????, ???? ????? ??? ?????????? ??????? ????????? ?????"
                      : "Create an account and get access to premium courses, live classes, and career support."}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4">
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

                {/* Stats */}
                <div className="mt-10 pt-8 border-t border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-3xl font-bold outfit">92%</p>
                      <p className={`text-xs text-white/70 ${bengaliClass}`}>
                        {language === "bn" ? "?????????? ???" : "Placement Rate"}
                      </p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold outfit">4.9?</p>
                      <p className={`text-xs text-white/70 ${bengaliClass}`}>
                        {language === "bn" ? "?????????? ?????" : "Student Rating"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="lg:col-span-3 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <div className="mb-8">
                  <h3 className={`text-2xl font-bold text-gray-800 mb-2 outfit ${bengaliClass}`}>
                    {language === "bn" ? "?????????? ???? ????" : "Create Account"}
                  </h3>
                  <p className={`text-gray-500 text-sm ${bengaliClass}`}>
                    {language === "bn" ? "???? ?? ????? ???? ?????!" : "It only takes a minute!"}
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <FiUser className="absolute left-4 top-3.5 text-gray-400" size={18} />
                      <input
                        name="firstName"
                        placeholder={language === "bn" ? "????? ???" : "First name"}
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#E62D26] focus:ring-2 focus:ring-[#E62D26]/20 outline-none transition ${bengaliClass}`}
                      />
                    </div>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-3.5 text-gray-400" size={18} />
                      <input
                        name="lastName"
                        placeholder={language === "bn" ? "??? ???" : "Last name"}
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#E62D26] focus:ring-2 focus:ring-[#E62D26]/20 outline-none transition ${bengaliClass}`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <FiMail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input
                      name="email"
                      type="email"
                      placeholder={language === "bn" ? "????? ??????" : "Email address"}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#E62D26] focus:ring-2 focus:ring-[#E62D26]/20 outline-none transition ${bengaliClass}`}
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input
                      name="phoneNumber"
                      placeholder={language === "bn" ? "??? ????? (??????)" : "Phone number (optional)"}
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#E62D26] focus:ring-2 focus:ring-[#E62D26]/20 outline-none transition ${bengaliClass}`}
                    />
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={language === "bn" ? "??????????" : "Password"}
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className={`w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#E62D26] focus:ring-2 focus:ring-[#E62D26]/20 outline-none transition ${bengaliClass}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-gray-400 hover:text-[#E62D26] transition"
                        >
                          {showPassword ? <MdOutlineVisibilityOff size={18} /> : <MdOutlineRemoveRedEye size={18} />}
                        </button>
                      </div>
                      {/* Password Strength */}
                      <div className="mt-2">
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${passwordStrength === 0 ? "w-0" :
                              passwordStrength === 1 ? "w-1/3 bg-red-400" :
                                passwordStrength === 2 ? "w-2/3 bg-yellow-400" :
                                  "w-full bg-green-500"
                              }`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={language === "bn" ? "?????????? ??????? ????" : "Confirm password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className={`w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#E62D26] focus:ring-2 focus:ring-[#E62D26]/20 outline-none transition ${bengaliClass}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-[#E62D26] transition"
                      >
                        {showConfirmPassword ? <MdOutlineVisibilityOff size={18} /> : <MdOutlineRemoveRedEye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                  )}

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${termsAccepted ? 'bg-[#E62D26] border-[#E62D26]' : 'border-gray-300'}`}>
                      {termsAccepted && <FiCheck className="text-white" size={12} />}
                    </div>
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="hidden"
                    />
                    <span className={`text-sm text-gray-600 ${bengaliClass}`}>
                      {language === "bn" ? "??? " : "I agree to the "}
                      <Link href="/terms" className="text-[#E62D26] font-medium hover:underline">
                        {language === "bn" ? "????????" : "Terms & Conditions"}
                      </Link>
                      {language === "bn" ? " ??? " : " and "}
                      <Link href="/privacy" className="text-[#E62D26] font-medium hover:underline">
                        {language === "bn" ? "????????? ????" : "Privacy Policy"}
                      </Link>
                      {language === "bn" ? " ???? ???????" : "."}
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !termsAccepted}
                    className={`w-full py-3.5 rounded-xl text-white font-semibold shadow-lg transition text-base ${loading || !termsAccepted
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#E62D26] to-[#38a89d] hover:shadow-xl hover:-translate-y-0.5"
                      } ${bengaliClass}`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                        {language === "bn" ? "???? ?????..." : "Creating..."}
                      </span>
                    ) : (
                      language === "bn" ? "?????????? ???? ????" : "Create Account"
                    )}
                  </button>

                  {/* Login Link */}
                  <p className={`text-sm text-gray-500 text-center ${bengaliClass}`}>
                    {language === "bn" ? "??? ????? ?????????? ???? " : "Already have an account? "}
                    <Link href="/login" className="text-[#E62D26] font-semibold hover:underline">
                      {language === "bn" ? "???? ????" : "Sign in"}
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
