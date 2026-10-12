import React, { useState } from 'react';
import Icon from './Icon';

export default function ContentDetailModal({ 
  item, 
  isOpen, 
  onClose, 
  onUpdateItem, 
  onDeleteItem,
  onOpenInMuse,
  showToast
}) {
  if (!isOpen || !item) return null;

  return (
    <ContentDetailModalInner
      item={item}
      onClose={onClose}
      onUpdateItem={onUpdateItem}
      onDeleteItem={onDeleteItem}
      onOpenInMuse={onOpenInMuse}
      showToast={showToast}
    />
  );
}

function ContentDetailModalInner({ 
  item, 
  onClose, 
  onUpdateItem, 
  onDeleteItem, 
  onOpenInMuse,
  showToast 
}) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [title, setTitle] = useState(item.title || '');
  const [stage, setStage] = useState(item.stage || 'draft');
  const [platform, setPlatform] = useState(item.platform || 'LinkedIn');
  const [format, setFormat] = useState(item.format || 'Text post');
  const [hook, setHook] = useState(item.hook || '');
  const [script, setScript] = useState(item.script || item.outline || '');
  const [visualDirection, setVisualDirection] = useState(item.visualDirection || '');
  const [scheduledDate, setScheduledDate] = useState(item.scheduledDate || '2026-10-15');
  const [repurposeMode, setRepurposeMode] = useState(false);
  const [repurposeTarget, setRepurposeTarget] = useState('X / Twitter Thread');

  const handleSave = () => {
    onUpdateItem({
      ...item,
      title,
      stage,
      platform,
      format,
      hook,
      script,
      visualDirection,
      scheduledDate
    });
    onClose();
  };

  const handleRepurpose = () => {
    onOpenInMuse(`Repurpose this content into a ${repurposeTarget}:\n\nTitle: ${title}\nHook: ${hook}\nBody: ${script}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-[760px] frosted-glass bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              stage === 'published' ? 'bg-emerald-100 text-emerald-800' :
              stage === 'approved' ? 'bg-blue-100 text-blue-800' :
              stage === 'draft' ? 'bg-amber-100 text-amber-800' :
              'bg-slate-100 text-slate-700'
            }`}>
              {stage}
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              {platform} • {format}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs sm:text-sm">
          
          {/* Working Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Content Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full h-11 px-4 rounded-xl frosted-input text-sm font-bold text-slate-900 outline-none"
            />
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pipeline Stage
              </label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value)}
                className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold outline-none"
              >
                <option value="idea">Idea</option>
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Platform
              </label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold outline-none"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="X / Twitter">X / Twitter</option>
                <option value="Substack">Substack</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Format
              </label>
              <input
                type="text"
                value={format}
                onChange={e => setFormat(e.target.value)}
                className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold outline-none text-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Scheduled Slot
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold outline-none text-xs"
              />
            </div>
          </div>

          {/* Hook / Opener */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              The Hook (Stopping the Scroll)
            </label>
            <textarea
              value={hook}
              onChange={e => setHook(e.target.value)}
              rows={3}
              className="w-full p-3.5 rounded-xl frosted-input text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed outline-none"
              placeholder="The opening 2 lines that set up tension, failure, or contrarian truth..."
            />
          </div>

          {/* Script / Body */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Draft Structure / Full Copy
            </label>
            <textarea
              value={script}
              onChange={e => setScript(e.target.value)}
              rows={6}
              className="w-full p-3.5 rounded-xl frosted-input text-xs sm:text-sm font-mono text-slate-800 leading-relaxed outline-none"
              placeholder="1. The failure post-mortem\n2. Concrete numbers\n3. Actionable takeaway"
            />
          </div>

          {/* Visual Asset Direction */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Visual Direction & Asset Brief
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 flex items-center">
                <Icon name="photo_camera" size={15} />
              </span>
              <textarea
                value={visualDirection}
                onChange={e => setVisualDirection(e.target.value)}
                rows={2}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl frosted-input text-xs text-slate-700 outline-none leading-relaxed"
                placeholder="e.g. Unfiltered screenshot of terminal memory graph or whiteboard architecture diagram."
              />
            </div>
          </div>

          {/* Repurposing Drawer */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Repurpose Engine
                </span>
                <span className="text-[11px] text-slate-500">
                  Spin this piece into another format with Muse
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRepurposeMode(!repurposeMode)}
                className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50"
              >
                {repurposeMode ? 'Cancel' : 'Spin out variant →'}
              </button>
            </div>

            {repurposeMode && (
              <div className="flex items-center gap-2 pt-2 animate-fade-in">
                <select
                  value={repurposeTarget}
                  onChange={e => setRepurposeTarget(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold outline-none"
                >
                  <option value="X / Twitter Thread">X / Twitter Thread</option>
                  <option value="Short video script (45s)">Short video script (45s)</option>
                  <option value="Substack Newsletter deep-dive">Substack Newsletter</option>
                  <option value="Carousel 5-slide outline">Carousel 5-slide outline</option>
                </select>
                <button
                  type="button"
                  onClick={handleRepurpose}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs"
                >
                  Generate in Muse
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
          {!isConfirmingDelete ? (
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Icon name="delete" size={15} />
              <span>Delete</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 animate-fade-in bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
              <span className="text-xs font-bold text-rose-850">Delete this note?</span>
              <button
                type="button"
                onClick={() => {
                  onDeleteItem(item.id);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
              >
                Yes, delete
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

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
              onClick={handleSave}
              className="px-5 py-2 rounded-full bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
