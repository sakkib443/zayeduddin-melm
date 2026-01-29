"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitReview, resetSubmitState } from "@/redux/reviewSlice";
import { FaStar, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { LuLoader, LuSend } from "react-icons/lu";

const WriteReviewModal = ({ isOpen, onClose, productId, productType }) => {
    const dispatch = useDispatch();
    const { submitLoading, submitError, submitSuccess } = useSelector((state) => state.reviews);

    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [title, setTitle] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(submitReview({
            productId,
            productType,
            rating,
            title,
            comment
        })).then((res) => {
            if (!res.error) {
                setTimeout(() => {
                    onClose();
                    setComment("");
                    setTitle("");
                    setRating(5);
                    dispatch(resetSubmitState());
                }, 2000);
            }
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="text-xl font-bold text-gray-900 outfit">Write a Review</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {submitSuccess ? (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <LuSend size={32} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Review Submitted!</h4>
                                <p className="text-gray-500 text-sm">Thank you for your feedback. It will be visible after approval.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Rating Star Input */}
                                <div className="space-y-2 text-center">
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Select Rating</p>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className="text-3xl transition-colors focus:outline-none transition-transform hover:scale-110"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                            >
                                                <FaStar
                                                    className={
                                                        star <= (hoverRating || rating)
                                                            ? "text-amber-400 fill-amber-400"
                                                            : "text-gray-200"
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium">
                                        {hoverRating || rating === 1 ? "Very Poor" :
                                            hoverRating || rating === 2 ? "Poor" :
                                                hoverRating || rating === 3 ? "Average" :
                                                    hoverRating || rating === 4 ? "Good" : "Excellent"}
                                    </p>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Title (Optional)</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                                        placeholder="Summarize your experience"
                                    />
                                </div>

                                {/* Comment */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Review <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows="4"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder-gray-400 resize-none"
                                        placeholder="What did you like or dislike?"
                                    ></textarea>
                                </div>

                                {/* Error Message */}
                                {submitError && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                        {submitError}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitLoading || !comment.trim()}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/20"
                                >
                                    {submitLoading ? (
                                        <>
                                            <LuLoader className="animate-spin" /> Submitting...
                                        </>
                                    ) : (
                                        "Submit Review"
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default WriteReviewModal;
