"use client";

import React, { useEffect, useState } from "react";
import { HiOutlineSparkles, HiXMark } from "react-icons/hi2";
import { LuPlay, LuUsers, LuTrophy, LuStar, LuArrowRight } from "react-icons/lu";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const SuccessHistoryPage = () => {
  const [activeFilter, setActiveFilter] = useState("journey");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t, language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsVisible(true);
  }, []);

  const videoData = {
    journey: [
      { id: "iqiNOsO7Yp8", title: language === "bn" ? "????? ???? ??????? - ????? ??????" : "From Student to Professional - Sarah's Journey", name: language === "bn" ? "???? ???" : "Sarah Khan" },
      { id: "_6cBwuHNKgI", title: language === "bn" ? "?????????? ?????????????? - ???? ???????? ????" : "Career Transformation - John's Success Story", name: language === "bn" ? "?? ??" : "John Doe" },
      { id: "2GqZBsRqaf0", title: language === "bn" ? "????? ??????????? ??????" : "Web Development Journey", name: language === "bn" ? "????? ?????" : "Rifat Hassan" },
      { id: "5RrnH4paPSg", title: language === "bn" ? "???? ???? ??? - ???????? ????????" : "Learning to Earning - Maria's Experience", name: language === "bn" ? "??????? ??????" : "Maria Akter" },
      { id: "0_FsHO7u5Pc", title: language === "bn" ? "??????????? ???? ???-???? - ??????? ???????" : "Internship to Full-time - David's Progress", name: language === "bn" ? "????? ?????" : "David Hossain" },
      { id: "MAesoykAUhc", title: language === "bn" ? "????????????? ??????" : "Freelancing Success", name: language === "bn" ? "???? ??????" : "Karim Uddin" },
    ],
    feedback: [
      { id: "ymFUAUDfHIo", title: language === "bn" ? "????? ???????? - ????? ????????" : "Student Feedback - Course Experience", name: language === "bn" ? "??????? ?????" : "Nadia Islam" },
      { id: "2GqZBsRqaf0", title: language === "bn" ? "????? ????? - ?????? ????????" : "Course Review - Positive Experience", name: language === "bn" ? "????? ?????" : "Sakib Ahmed" },
      { id: "5HQLWiQP5-E", title: language === "bn" ? "????????? ????????" : "Mentorship Experience", name: language === "bn" ? "?????? ?????" : "Tanvir Rahman" },
    ],
  };

  const stats = [
    { icon: LuUsers, value: "4,200+", label: language === "bn" ? "??? ??????????" : "Successful Students" },
    { icon: LuTrophy, value: "92%", label: language === "bn" ? "?????????? ???" : "Placement Rate" },
    { icon: LuStar, value: "4.9/5", label: language === "bn" ? "????? ?????" : "Student Rating" },
  ];

  const filters = [
    { key: "journey", label: language === "bn" ? "???????? ????" : "Student Stories" },
    { key: "feedback", label: language === "bn" ? "????? ????????" : "Student Feedback" },
  ];

  const activeVideos = videoData[activeFilter];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ecfcfb] via-white to-[#ecfcfb]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-100">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f9f9] via-white to-[#fff8f0]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#E62D26]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-[#F79952]/10 to-transparent rounded-full blur-3xl"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(65,191,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(65,191,184,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="container mx-auto px-4 lg:px-16 py-12 lg:py-16 relative z-10">
          <div className={`text-center max-w-3xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
              <HiOutlineSparkles className="text-[#F79952] text-lg" />
              <span className={`text-sm font-medium text-gray-700 work ${bengaliClass}`}>
                {language === "bn" ? "?????? ???????? ????" : "Our Success Stories"}
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold outfit text-gray-800 mb-4 ${bengaliClass}`}>
              {language === "bn" ? "????????????? " : "Student "}
              <span className="bg-gradient-to-r from-[#E62D26] to-[#38a89d] bg-clip-text text-transparent">
                {language === "bn" ? "???????? ????" : "Success Stories"}
              </span>
            </h1>

            {/* Description */}
            <p className={`text-gray-600 work text-sm sm:text-base leading-relaxed mb-8 ${bengaliClass}`}>
              {language === "bn"
                ? "ejobs it-? ?????? ???????????? ???? ?????? ????? ??? ?? � ???? ????? ????? ???? ?????? ?????????? ????????-??????? ??????????? ??????? ???? ?????? ??????????? ???? ???????? ???????? ???? ?????? ????"
                : "At ejobs it, our students gain more than just skills � they gain opportunities. Through real client project-based training, they graduate fully prepared for real-world challenges."}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#E62D26]/10 to-[#E62D26]/5 rounded-lg flex items-center justify-center">
                      <Icon className="text-[#E62D26] text-lg" />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-gray-800 outfit">{stat.value}</p>
                      <p className={`text-xs text-gray-500 work ${bengaliClass}`}>{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(i => (
                  <FaStar key={i} className="text-[#F79952] text-sm" />
                ))}
              </div>
              <span className={`text-sm text-gray-600 work ${bengaliClass}`}>
                {language === "bn" ? "???+ ???????? ????" : "500+ Success Stories"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 lg:px-16 py-12">
        {/* Filter Buttons */}
        <div className={`flex justify-center gap-4 mb-10 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`relative px-6 py-3 rounded-xl font-medium work transition-all duration-300 ${bengaliClass} ${activeFilter === filter.key
                ? "bg-gradient-to-r from-[#E62D26] to-[#38a89d] text-white shadow-lg shadow-[#E62D26]/30"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#E62D26]/50 hover:text-[#E62D26]"
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeVideos.map((video, index) => (
            <div
              key={index}
              onClick={() => setSelectedVideo(video)}
              className={`group cursor-pointer transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
                {/* Video Thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-all duration-300 group-hover:bg-[#E62D26]">
                      <LuPlay className="w-6 h-6 text-[#E62D26] group-hover:text-white ml-1" />
                    </div>
                  </div>

                  {/* Badge */}
                  <div className={`absolute top-3 left-3 px-3 py-1 bg-[#F79952] text-white text-xs font-medium rounded-lg ${bengaliClass}`}>
                    {activeFilter === "journey"
                      ? (language === "bn" ? "???????? ????" : "Success Story")
                      : (language === "bn" ? "????????" : "Feedback")}
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className={`text-white font-semibold outfit text-base mb-1 line-clamp-2 ${bengaliClass}`}>{video.title}</p>
                    <p className="text-white/80 text-sm work">{video.name}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="bg-gradient-to-r from-[#E62D26]/10 via-white to-[#F79952]/10 rounded-2xl p-8 border border-gray-100">
            <h3 className={`text-2xl font-bold text-gray-800 outfit mb-3 ${bengaliClass}`}>
              {language === "bn" ? "??????? ???????? ???? ????? ??? ????!" : "Your Success Story Could Be Next!"}
            </h3>
            <p className={`text-gray-600 work mb-6 max-w-xl mx-auto ${bengaliClass}`}>
              {language === "bn"
                ? "??? ?????? ???? ??? ??? ??? ????? ?????????? ?????????????? ???? ?????"
                : "Join us today and start your career transformation journey with our expert-led courses."}
            </p>
            <Link
              href="/courses"
              className={`inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#E62D26] to-[#38a89d] text-white rounded-xl font-semibold work hover:shadow-xl hover:shadow-[#E62D26]/30 transition-all duration-300 group ${bengaliClass}`}
            >
              <span>{language === "bn" ? "????? ?????" : "Explore Courses"}</span>
              <LuArrowRight className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <HiXMark className="w-6 h-6" />
            </button>

            {/* Video */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* Video Info */}
            <div className="mt-4 text-center">
              <p className={`text-white font-semibold outfit text-lg ${bengaliClass}`}>{selectedVideo.title}</p>
              <p className="text-white/70 text-sm work">{selectedVideo.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SuccessHistoryPage;
