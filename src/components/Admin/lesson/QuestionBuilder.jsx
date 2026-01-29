'use client';

import React, { useState } from 'react';
import {
    FiPlus, FiTrash2, FiEdit3, FiCheck, FiX, FiHelpCircle,
    FiList, FiChevronDown, FiChevronUp, FiAward, FiAlertCircle
} from 'react-icons/fi';

/**
 * Professional MCQ Question Builder Component
 * Clean, minimal design matching website theme
 */
export default function QuestionBuilder({ questions = [], onChange }) {
    const [showForm, setShowForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [formData, setFormData] = useState({
        type: 'mcq',
        question: '',
        questionBn: '',
        options: [
            { text: '', textBn: '', isCorrect: false },
            { text: '', textBn: '', isCorrect: false },
            { text: '', textBn: '', isCorrect: false },
            { text: '', textBn: '', isCorrect: false },
        ],
        points: 1,
        explanation: '',
        explanationBn: '',
        order: questions.length + 1,
        isRequired: true,
    });

    const resetForm = () => {
        setFormData({
            type: 'mcq',
            question: '',
            questionBn: '',
            options: [
                { text: '', textBn: '', isCorrect: false },
                { text: '', textBn: '', isCorrect: false },
                { text: '', textBn: '', isCorrect: false },
                { text: '', textBn: '', isCorrect: false },
            ],
            points: 1,
            explanation: '',
            explanationBn: '',
            order: questions.length + 1,
            isRequired: true,
        });
        setEditingIndex(null);
        setShowForm(false);
    };

    const handleAddOption = () => {
        if (formData.options.length < 6) {
            setFormData(prev => ({
                ...prev,
                options: [...prev.options, { text: '', textBn: '', isCorrect: false }]
            }));
        }
    };

    const handleRemoveOption = (index) => {
        if (formData.options.length > 2) {
            setFormData(prev => ({
                ...prev,
                options: prev.options.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSelectCorrectAnswer = (index) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.map((opt, i) => ({
                ...opt,
                isCorrect: i === index
            }))
        }));
    };

    const handleOptionTextChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.map((opt, i) =>
                i === index ? { ...opt, [field]: value } : opt
            )
        }));
    };

    const handleSaveQuestion = () => {
        if (!formData.question.trim()) {
            alert('Please enter the question text');
            return;
        }

        const hasCorrect = formData.options.some(opt => opt.isCorrect);
        const filledOptions = formData.options.filter(opt => opt.text.trim());

        if (filledOptions.length < 2) {
            alert('Please add at least 2 options');
            return;
        }

        if (!hasCorrect) {
            alert('Please select the correct answer');
            return;
        }

        const cleanedData = {
            ...formData,
            options: formData.options.filter(opt => opt.text.trim()),
            order: editingIndex !== null ? formData.order : questions.length + 1
        };

        if (editingIndex !== null) {
            const updated = [...questions];
            updated[editingIndex] = cleanedData;
            onChange(updated);
        } else {
            onChange([...questions, cleanedData]);
        }

        resetForm();
    };

    const handleEdit = (index) => {
        const question = questions[index];
        const paddedOptions = [...question.options];
        while (paddedOptions.length < 4) {
            paddedOptions.push({ text: '', textBn: '', isCorrect: false });
        }
        setFormData({ ...question, options: paddedOptions });
        setEditingIndex(index);
        setShowForm(true);
    };

    const handleDelete = (index) => {
        if (confirm('Are you sure you want to delete this question?')) {
            onChange(questions.filter((_, i) => i !== index));
        }
    };

    const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E62D26] focus:ring-2 focus:ring-[#E62D26]/20 outline-none text-sm transition-all bg-white";

    return (
        <div className="space-y-5">

            {/* Header Stats */}
            <div className="bg-gradient-to-r from-[#E62D26] to-[#c41e18] p-5 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <FiHelpCircle size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Quiz Questions</h3>
                            <p className="text-sm text-white/80">Create multiple choice questions for assessment</p>
                        </div>
                    </div>
                    <div className="text-center bg-white/20 px-5 py-3 rounded-xl">
                        <span className="font-bold text-3xl">{questions.length}</span>
                        <p className="text-xs text-white/80 mt-0.5">Questions</p>
                    </div>
                </div>
            </div>

            {/* Questions List */}
            {questions.length > 0 && (
                <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Added Questions</p>
                    {questions.map((q, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#E62D26]/50 hover:shadow-md transition-all"
                        >
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer"
                                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#E62D26] to-[#c41e18] text-white flex items-center justify-center font-bold text-lg">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm line-clamp-1">
                                            {q.question}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 bg-[#E62D26]/10 text-[#E62D26] rounded text-xs font-medium">
                                                {q.options?.length} Options
                                            </span>
                                            <span className="px-2 py-0.5 bg-[#F79952]/10 text-[#F79952] rounded text-xs font-medium flex items-center gap-1">
                                                <FiAward size={10} /> {q.points} Point{q.points > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleEdit(index); }}
                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#E62D26] transition-colors"
                                    >
                                        <FiEdit3 size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(index); }}
                                        className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                    <div className="w-8 h-8 flex items-center justify-center text-gray-400">
                                        {expandedIndex === index ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded View */}
                            {expandedIndex === index && (
                                <div className="px-4 pb-4 border-t border-gray-100 pt-4 bg-gray-50/50">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {q.options?.map((opt, i) => (
                                            <div
                                                key={i}
                                                className={`flex items-center gap-3 p-3 rounded-lg text-sm ${opt.isCorrect
                                                    ? 'bg-[#E62D26] text-white'
                                                    : 'bg-white border border-gray-200 text-gray-700'
                                                    }`}
                                            >
                                                <span className={`w-7 h-7 rounded-md flex items-center justify-center font-semibold text-xs ${opt.isCorrect ? 'bg-white/20' : 'bg-gray-100'
                                                    }`}>
                                                    {optionLabels[i]}
                                                </span>
                                                <span className="flex-1 font-medium">{opt.text}</span>
                                                {opt.isCorrect && <FiCheck size={16} />}
                                            </div>
                                        ))}
                                    </div>
                                    {q.explanation && (
                                        <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 text-sm">
                                            <span className="font-semibold">Explanation:</span> {q.explanation}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Question Form */}
            {showForm ? (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-[#E62D26] to-[#c41e18] px-5 py-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                                {editingIndex !== null ? <FiEdit3 size={18} /> : <FiPlus size={18} />}
                            </div>
                            <div>
                                <h4 className="font-semibold">
                                    {editingIndex !== null ? 'Edit Question' : 'Add New Question'}
                                </h4>
                                <p className="text-sm text-white/80">Question #{editingIndex !== null ? editingIndex + 1 : questions.length + 1}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <FiX size={18} />
                        </button>
                    </div>

                    <div className="p-5 space-y-6">

                        {/* Step 1: Question */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-6 h-6 rounded-md bg-[#E62D26] text-white flex items-center justify-center font-semibold text-xs">1</span>
                                <h5 className="font-semibold text-gray-800 text-sm">Question Text</h5>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">English *</label>
                                    <textarea
                                        value={formData.question}
                                        onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                                        placeholder="Enter your question here..."
                                        rows={3}
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Bengali (Optional)</label>
                                    <textarea
                                        value={formData.questionBn}
                                        onChange={(e) => setFormData(prev => ({ ...prev, questionBn: e.target.value }))}
                                        placeholder="Enter Bengali translation..."
                                        rows={3}
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Options */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-md bg-[#E62D26] text-white flex items-center justify-center font-semibold text-xs">2</span>
                                    <h5 className="font-semibold text-gray-800 text-sm">Answer Options</h5>
                                </div>
                                {formData.options.length < 6 && (
                                    <button
                                        type="button"
                                        onClick={handleAddOption}
                                        className="flex items-center gap-1.5 text-[#E62D26] text-xs font-semibold hover:text-[#c41e18] px-3 py-1.5 bg-[#E62D26]/10 rounded-lg transition-colors"
                                    >
                                        <FiPlus size={14} /> Add Option
                                    </button>
                                )}
                            </div>

                            {/* Instruction */}
                            <div className="flex items-center gap-2 p-3 bg-[#F79952]/10 border border-[#F79952]/20 rounded-lg text-[#F79952] text-xs mb-4">
                                <FiAlertCircle size={16} className="shrink-0" />
                                <span><strong>Tip:</strong> Click the checkmark button next to the correct answer to mark it</span>
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {formData.options.map((opt, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${opt.isCorrect
                                            ? 'border-[#E62D26] bg-[#E62D26]/5'
                                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                            }`}
                                    >
                                        {/* Option Label */}
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${opt.isCorrect
                                            ? 'bg-[#E62D26] text-white'
                                            : 'bg-white border border-gray-200 text-gray-600'
                                            }`}>
                                            {optionLabels[index]}
                                        </div>

                                        {/* Inputs */}
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="text"
                                                value={opt.text}
                                                onChange={(e) => handleOptionTextChange(index, 'text', e.target.value)}
                                                placeholder={`Option ${optionLabels[index]}`}
                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E62D26] outline-none text-sm bg-white"
                                            />
                                            <input
                                                type="text"
                                                value={opt.textBn}
                                                onChange={(e) => handleOptionTextChange(index, 'textBn', e.target.value)}
                                                placeholder="Bengali"
                                                className="w-24 px-3 py-2 rounded-lg border border-gray-200 focus:border-[#E62D26] outline-none text-sm bg-white"
                                            />
                                        </div>

                                        {/* Correct Answer Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleSelectCorrectAnswer(index)}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all shrink-0 ${opt.isCorrect
                                                ? 'bg-[#E62D26] text-white shadow-md'
                                                : 'bg-white border border-gray-200 text-gray-400 hover:border-[#E62D26] hover:text-[#E62D26]'
                                                }`}
                                            title={opt.isCorrect ? 'Correct Answer' : 'Mark as Correct'}
                                        >
                                            <FiCheck size={18} />
                                        </button>

                                        {/* Remove */}
                                        {formData.options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOption(index)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 3: Points & Explanation */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-6 h-6 rounded-md bg-gray-400 text-white flex items-center justify-center font-semibold text-xs">3</span>
                                <h5 className="font-medium text-gray-600 text-sm">Points & Explanation (Optional)</h5>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Points</label>
                                    <input
                                        type="number"
                                        value={formData.points}
                                        onChange={(e) => setFormData(prev => ({ ...prev, points: Number(e.target.value) }))}
                                        min="1"
                                        max="100"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Explanation (shown after answering)</label>
                                    <input
                                        type="text"
                                        value={formData.explanation}
                                        onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                                        placeholder="Explain why this is the correct answer..."
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveQuestion}
                                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#E62D26] to-[#c41e18] hover:from-[#c41e18] hover:to-[#E62D26] text-white font-medium text-sm flex items-center gap-2 shadow-md transition-all"
                            >
                                <FiCheck size={16} />
                                {editingIndex !== null ? 'Update Question' : 'Add Question'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Add Question Button */
                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="w-full p-4 border-2 border-dashed border-[#E62D26]/40 rounded-xl text-[#E62D26] hover:border-[#E62D26] hover:bg-[#E62D26]/5 transition-all flex items-center justify-center gap-3 font-semibold"
                >
                    <div className="w-10 h-10 rounded-lg bg-[#E62D26]/10 flex items-center justify-center">
                        <FiPlus size={20} />
                    </div>
                    Add New Question
                </button>
            )}
        </div>
    );
}
