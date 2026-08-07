import React from 'react';
import { BROCHURES } from '../services/whatsapp';
import { Leaf, Moon, Palette, CheckCircle2 } from 'lucide-react';

export const BrochurePreview = ({ selectedTheme, onSelectTheme }) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-300">
        Select Brochure Theme Attachment <span className="text-amber-400">*</span>
      </label>
      
      {/* 3 Theme Selector Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {Object.values(BROCHURES).map((b) => {
          const isSelected = selectedTheme === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectTheme(b.id)}
              className={`relative p-3 rounded-xl text-left transition-all duration-300 flex flex-col justify-between overflow-hidden border ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/15 shadow-lg scale-[1.02]'
                  : 'border-white-10 bg-slate-900/60 hover:bg-slate-900'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 text-amber-400">
                  <CheckCircle2 className="w-5 h-5 fill-amber-400 text-slate-950" />
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-2">
                {b.id === 'nature' && <Leaf className="w-5 h-5 text-emerald-400" />}
                {b.id === 'dark' && <Moon className="w-5 h-5 text-purple-400" />}
                {b.id === 'colorful' && <Palette className="w-5 h-5 text-rose-400" />}
                <span className="font-bold text-sm text-white font-heading">{b.title}</span>
              </div>
              
              <span className="text-11px text-gray-400 leading-tight">{b.description}</span>
            </button>
          );
        })}
      </div>

      {/* Live Graphic Poster Preview */}
      {BROCHURES[selectedTheme] && (
        <div className="relative mt-4 rounded-2xl overflow-hidden border border-white-10 shadow-2xl transition-all duration-500 group">
          <div className="h-52 w-full relative bg-slate-950 flex items-center justify-center">
            <img
              src={BROCHURES[selectedTheme].imagePath}
              alt={BROCHURES[selectedTheme].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between text-white pointer-events-none">
            <div className="flex justify-between items-start">
              <span className="badge badge-todo">
                {BROCHURES[selectedTheme].badge}
              </span>
              <span className="text-xs bg-slate-950/80 px-2.5 py-1 rounded-full text-amber-400 border font-mono">
                {BROCHURES[selectedTheme].title}
              </span>
            </div>

            <div>
              <h4 className="text-lg font-extrabold font-heading text-white mb-0-5">
                {BROCHURES[selectedTheme].title}
              </h4>
              <p className="text-xs text-gray-300">
                {BROCHURES[selectedTheme].tagline}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
