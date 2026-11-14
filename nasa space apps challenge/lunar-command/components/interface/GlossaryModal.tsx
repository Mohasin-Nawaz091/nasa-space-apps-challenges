"use client";

import React, { useState, useEffect } from "react";
import { SCIENCE_GLOSSARY } from "../../data/glossary";
import { X, BookOpen, Lightbulb, Sparkles, Filter, ArrowLeft } from "lucide-react";
import { sounds } from "../../utils/audio";

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlossaryModal({ isOpen, onClose }: GlossaryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        sounds.playClick();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = ["All", "Environment", "Life Support", "Engineering", "Space Weather"];

  const filteredTerms =
    selectedCategory === "All"
      ? SCIENCE_GLOSSARY
      : SCIENCE_GLOSSARY.filter((t) => t.category === selectedCategory);

  return (
    <div
      onClick={() => {
        sounds.playClick();
        onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
      title="Click outside to close"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl text-white overflow-hidden cursor-default"
      >
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-lg md:text-xl font-bold tracking-wide text-cyan-200">
                Junior Astronaut Science Glossary
              </h2>
              <p className="text-xs text-slate-400">
                NASA concepts explained for future lunar explorers (Ages 7–12)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/70 text-red-200 hover:text-white font-black text-xs transition active:scale-95 shadow-lg mr-2 cursor-pointer"
            title="Close Glossary [Esc]"
          >
            <X className="w-4 h-4 text-red-400" />
            <span>CLOSE</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/40 flex flex-wrap gap-1.5 items-center">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sounds.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-cyan-600 text-white shadow-sm shadow-cyan-900"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Terms List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {filteredTerms.map((term, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-cyan-300">{term.term}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {term.category}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {term.childExplanation}
              </p>
              <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-900/50 flex items-start gap-2 text-xs text-blue-200">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{term.realWorldFact}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Close Button */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>RETURN TO BASE VIEW [ESC]</span>
          </button>
        </div>
      </div>
    </div>
  );
}
