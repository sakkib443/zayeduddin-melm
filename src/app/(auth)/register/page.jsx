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
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
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
    setFieldErrors({});

    const errors = {};

    // Frontend Password Validation
    const password = formData.password;
    if (password.length < 8) {
      errors.password = language === "bn"
        ? "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে"
        : "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = language === "bn"
        ? "পাসওয়ার্ডে কমপক্ষে ১টি বড় হাতের অক্ষর থাকতে হবে (A-Z)"
        : "Password must contain at least 1 uppercase letter (A-Z)";
    } else if (!/[a-z]/.test(password)) {
      errors.password = language === "bn"
        ? "পাসওয়ার্ডে কমপক্ষে ১টি ছোট হাতের অক্ষর থাকতে হবে (a-z)"
        : "Password must contain at least 1 lowercase letter (a-z)";
    } else if (!/\d/.test(password)) {
      errors.password = language === "bn"
        ? "পাসওয়ার্ডে কমপক্ষে ১টি সংখ্যা থাকতে হবে (0-9)"
        : "Password must contain at least 1 number (0-9)";
    } else if (!/[@$!%*?&]/.test(password)) {
      errors.password = language === "bn"
        ? "পাসওয়ার্ডে কমপক্ষে ১টি বিশেষ চিহ্ন থাকতে হবে (@$!%*?&)"
        : "Password must contain at least 1 special character (@$!%*?&)";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = language === "bn"
        ? "পাসওয়ার্ড মিলছে না"
        : "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
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
          phone: formData.phoneNumber,
          password: formData.password,
          role: "student",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Log the full error data for debugging
        console.log("Registration Error API Response:", data);

        // 1. Handle Zod validation errors (array of error sources)
        if (data.errorSources && Array.isArray(data.errorSources)) {
          const backendErrors = {};
          data.errorSources.forEach(err => {
            const fieldName = err.path === 'phone' ? 'phoneNumber' : err.path;
            backendErrors[fieldName] = err.message;
          });
          setFieldErrors(backendErrors);
          throw new Error(language === "bn" ? "অনুগ্রহ করে ফর্মের ভুলগুলো ঠিক করুন" : "Please fix the validation errors");
        }

        // 2. Handle generic errorMessages array
        if (data.errorMessages && Array.isArray(data.errorMessages) && data.errorMessages.length > 0) {
          const firstErr = data.errorMessages[0];
          // Try to show specific message from the array
          throw new Error(firstErr?.message || (language === "bn" ? "রেজিস্ট্রেশন ব্যর্থ হয়েছে" : "Registration failed"));
        }

        // 3. Handle standard error message field
        throw new Error(data.message || (language === "bn" ? "রেজিস্ট্রেশন ব্যর্থ হয়েছে" : "Registration failed"));
      }

      // Success! Set status to registered
      setRegisteredEmail(formData.email);
      setIsRegistered(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: FiBookOpen, text: language === "bn" ? "৫০+ প্রফেশনাল কোর্স" : "50+ Professional Courses" },
    { icon: FiUsers, text: language === "bn" ? "৪,২০০+ সফল শিক্ষার্থী" : "4,200+ Successful Students" },
    { icon: FiAward, text: language === "bn" ? "ইন্ডাস্ট্রি সার্টিফিকেট" : "Industry Certificates" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#e8f9f9] py-12">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

            {/* Left Side - Info Section */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#021E14] to-[#38a89d] p-8 lg:p-12 text-white relative overflow-hidden">
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
                    {language === "bn" ? "আপনার ক্যারিয়ার যাত্রা শুরু করুন" : "Start Your Career Journey"}
                  </h2>
                  <p className={`text-white/80 text-sm leading-relaxed ${bengaliClass}`}>
                    {language === "bn"
                      ? "একটি অ্যাকাউন্ট তৈরি করুন এবং প্রিমিয়াম কোর্স, লাইভ ক্লাস ও ক্যারিয়ার সাপোর্ট পান।"
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
                        {language === "bn" ? "প্লেসমেন্ট রেট" : "Placement Rate"}
                      </p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold outfit">4.9★</p>
                      <p className={`text-xs text-white/70 ${bengaliClass}`}>
                        {language === "bn" ? "শিক্ষার্থী রেটিং" : "Student Rating"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="lg:col-span-3 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                {isRegistered ? (
                  <div className="py-12 text-center animate-in fade-in zoom-in duration-700">
                    <div className="flex justify-center mb-8">
                      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center border border-green-100 shadow-inner">
                        <FiCheck className="text-green-500" size={50} />
                      </div>
                    </div>

                    <h3 className={`text-3xl font-bold text-gray-800 mb-4 outfit ${bengaliClass}`}>
                      {language === "bn" ? "রেজিস্ট্রেশন সফল!" : "Registration Success!"}
                    </h3>

                    <p className={`text-gray-600 mb-8 leading-relaxed ${bengaliClass}`}>
                      {language === "bn"
                        ? `আমরা ${registeredEmail} ঠিকানায় একটি ভেরিফিকেশন লিংক পাঠিয়েছি। অনুগ্রহ করে আপনার ইমেইল চেক করুন এবং অ্যাকাউন্টটি সক্রিয় করুন।`
                        : `We've sent a verification link to ${registeredEmail}. Please check your email and activate your account to continue.`}
                    </p>

                    <div className="space-y-4">
                      <Link
                        href="/login"
                        className={`block w-full py-4 rounded-xl bg-gradient-to-r from-[#021E14] to-[#38a89d] text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition ${bengaliClass}`}
                      >
                        {language === "bn" ? "লগইন পেজে যান" : "Go to Login Page"}
                      </Link>

                      <p className={`text-xs text-gray-400 font-medium ${bengaliClass}`}>
                        {language === "bn" ? "ইমেইল পাননি? স্প্যাম ফোল্ডার চেক করুন।" : "Didn't receive email? Check your spam folder."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h3 className={`text-2xl font-bold text-gray-800 mb-2 outfit ${bengaliClass}`}>
                        {language === "bn" ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account"}
                      </h3>
                      <p className={`text-gray-500 text-sm ${bengaliClass}`}>
                        {language === "bn" ? "মাত্র এক মিনিট সময় লাগবে!" : "It only takes a minute!"}
                      </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                      {/* Name Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <FiUser className="absolute left-4 top-3.5 text-gray-400" size={18} />
                          <input
                            name="firstName"
                            placeholder={language === "bn" ? "প্রথম নাম" : "First name"}
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${fieldErrors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition ${bengaliClass}`}
                          />
                          {fieldErrors.firstName && <p className="text-red-500 text-[10px] mt-1 ml-1">{fieldErrors.firstName}</p>}
                        </div>
                        <div className="relative">
                          <FiUser className="absolute left-4 top-3.5 text-gray-400" size={18} />
                          <input
                            name="lastName"
                            placeholder={language === "bn" ? "শেষ নাম" : "Last name"}
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${fieldErrors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition ${bengaliClass}`}
                          />
                          {fieldErrors.lastName && <p className="text-red-500 text-[10px] mt-1 ml-1">{fieldErrors.lastName}</p>}
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <div className="relative">
                          <FiMail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                          <input
                            name="email"
                            type="email"
                            placeholder={language === "bn" ? "ইমেইল ঠিকানা" : "Email address"}
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition ${bengaliClass}`}
                          />
                        </div>
                        {fieldErrors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{fieldErrors.email}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <div className="relative">
                          <FiPhone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                          <input
                            name="phoneNumber"
                            placeholder={language === "bn" ? "ফোন নম্বর (ঐচ্ছিক)" : "Phone number (optional)"}
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${fieldErrors.phoneNumber ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition ${bengaliClass}`}
                          />
                        </div>
                        {fieldErrors.phoneNumber && <p className="text-red-500 text-[10px] mt-1 ml-1">{fieldErrors.phoneNumber}</p>}
                      </div>

                      {/* Password Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="relative">
                            <FiLock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                            <input
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder={language === "bn" ? "পাসওয়ার্ড" : "Password"}
                              value={formData.password}
                              onChange={handleChange}
                              required
                              className={`w-full pl-11 pr-10 py-3 rounded-xl border ${fieldErrors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition ${bengaliClass}`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3.5 text-gray-400 hover:text-[#021E14] transition"
                            >
                              {showPassword ? <MdOutlineVisibilityOff size={18} /> : <MdOutlineRemoveRedEye size={18} />}
                            </button>
                          </div>
                          {fieldErrors.password && <p className="text-red-500 text-[10px] mt-1 ml-1">{fieldErrors.password}</p>}
                          {/* Password Strength */}
                          <div className="mt-2 text-left">
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${passwordStrength === 0 ? "w-0" :
                                  passwordStrength === 1 ? "w-1/3 bg-[#021E14]" :
                                    passwordStrength === 2 ? "w-2/3 bg-yellow-400" :
                                      "w-full bg-green-500"
                                  }`}
                              />
                            </div>
                            <p className={`text-[10px] text-gray-400 mt-1 ${bengaliClass}`}>
                              {language === "bn"
                                ? "৮+ অক্ষর, বড় হাত, ছোট হাত, সংখ্যা, বিশেষ চিহ্ন (@$!%*?&)"
                                : "8+ chars, uppercase, lowercase, number, special (@$!%*?&)"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <div className="relative">
                            <FiLock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                            <input
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder={language === "bn" ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm password"}
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required
                              className={`w-full pl-11 pr-10 py-3 rounded-xl border ${fieldErrors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition ${bengaliClass}`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-3.5 text-gray-400 hover:text-[#021E14] transition"
                            >
                              {showConfirmPassword ? <MdOutlineVisibilityOff size={18} /> : <MdOutlineRemoveRedEye size={18} />}
                            </button>
                          </div>
                          {fieldErrors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 ml-1">{fieldErrors.confirmPassword}</p>}
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-left">
                          <p className="text-red-600 text-xs font-medium">{error}</p>
                        </div>
                      )}

                      {/* Terms */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${termsAccepted ? 'bg-[#021E14] border-[#021E14]' : 'border-gray-300'}`}>
                          {termsAccepted && <FiCheck className="text-white" size={12} />}
                        </div>
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="hidden"
                        />
                        <span className={`text-sm text-gray-600 ${bengaliClass}`}>
                          {language === "bn" ? "আমি " : "I agree to the "}
                          <Link href="/terms" className="text-[#021E14] font-medium hover:underline">
                            {language === "bn" ? "শর্তাবলী" : "Terms & Conditions"}
                          </Link>
                          {language === "bn" ? " এবং " : " and "}
                          <Link href="/privacy" className="text-[#021E14] font-medium hover:underline">
                            {language === "bn" ? "গোপনীয়তা নীতি" : "Privacy Policy"}
                          </Link>
                          {language === "bn" ? " মেনে নিচ্ছি।" : "."}
                        </span>
                      </label>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading || !termsAccepted}
                        className={`w-full py-3.5 rounded-xl text-white font-semibold shadow-lg transition text-base ${loading || !termsAccepted
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#021E14] to-[#38a89d] hover:shadow-xl hover:-translate-y-0.5"
                          } ${bengaliClass}`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                            {language === "bn" ? "তৈরি হচ্ছে..." : "Creating..."}
                          </span>
                        ) : (
                          language === "bn" ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account"
                        )}
                      </button>

                      {/* Login Link */}
                      <p className={`text-sm text-gray-500 text-center ${bengaliClass}`}>
                        {language === "bn" ? "ইতিমধ্যে অ্যাকাউন্ট আছে? " : "Already have an account? "}
                        <Link href="/login" className="text-[#021E14] font-semibold hover:underline">
                          {language === "bn" ? "লগইন করুন" : "Sign in"}
                        </Link>
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
