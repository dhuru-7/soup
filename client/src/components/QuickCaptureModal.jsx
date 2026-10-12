import React, { useState } from 'react';
import Icon from './Icon';

export default function QuickCaptureModal({ isOpen, onClose, onSaveIdea, onDevelopWithMuse }) {
  const [title, setTitle] = useState('');
  const [snippet, setSnippet] = useState('');
  const [type, setType] = useState('Story');
  const [source, setSource] = useState('Founder quick note');

  if (!isOpen) return null;

  const handleSubmit = (developNow = false) => {
    if (!snippet.trim() && !title.trim()) return;

    const newIdea = {
      id: `inbox-${Date.now()}`,
      title: title.trim() || snippet.trim().slice(0, 45) + '...',
      snippet: snippet.trim() || title.trim(),
      type,
      date: 'Just now',
      source
    };

    onSaveIdea(newIdea);

    if (developNow) {
      onDevelopWithMuse(newIdea);
    }

    setTitle('');
    setSnippet('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-[560px] frosted-glass bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEEC98]" />
            <h3 className="font-heading text-base font-bold text-slate-900">
              Quick Capture
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Idea Inbox</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              What did you just observe, hear, or learn?
            </label>
            <textarea
              value={snippet}
              onChange={e => setSnippet(e.target.value)}
              placeholder="e.g. A customer told us today that our competitors take 4 days to debug what we show in 2 minutes. Need to talk about why trace sampling is a mistake..."
              rows={4}
              className="w-full p-4 rounded-2xl frosted-input text-sm text-slate-900 placeholder:text-slate-400 resize-none outline-none focus:border-amber-400 leading-relaxed font-sans"
              autoFocus
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Working Headline (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Short title for your scrapboard"
                className="w-full h-10 px-3.5 rounded-xl frosted-input text-xs text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Source Type
              </label>
              <select
                value={source}
                onChange={e => setSource(e.target.value)}
                className="w-full h-10 px-3 rounded-xl frosted-input text-xs text-slate-800 font-medium outline-none bg-white"
              >
                <option value="Founder quick note">Quick note</option>
                <option value="Voice note transcript">Voice note</option>
                <option value="Slack screenshot">Slack receipt</option>
                <option value="Customer quote">Customer quote</option>
                <option value="Production incident">Production incident</option>
              </select>
            </div>
          </div>

          {/* Type Selector Pills */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {['Story', 'Education', 'Opinion', 'Receipt'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    type === t
                      ? 'bg-[#FEEC98] border-[#F4D05F] text-slate-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/90 shadow-2xs flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Icon name="smart_toy" size={14} className="text-amber-600" />
            <span>Develop with Muse now</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-slate-600 hover:text-slate-900 text-xs font-semibold"
            >
              Cancel
            </button>
            {/* Primary Action Button: 10% more intense canary gold #FFCC00 */}
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-5 py-2 rounded-full bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Save to Studio
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
