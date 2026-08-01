import React, { useState } from 'react';
import { Settings, Printer, Download, Lock, Unlock, X, Save, Eye, Sparkles } from 'lucide-react';
import { Chapter } from '../types';
import memoriesData from '../data/memories.json';
import { QRVerificationEngine } from '../utils/QRVerificationEngine';
import { audioEngine } from '../utils/AudioEngine';

interface AdminDashboardProps {
  onClose: () => void;
  onResetProgress: () => void;
  onLockHost?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onResetProgress, onLockHost }) => {
  const [chapters, setChapters] = useState<Chapter[]>(memoriesData as Chapter[]);
  const [activeTab, setActiveTab] = useState<'EDIT' | 'PRINT_QR' | 'SECURITY'>('EDIT');
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);
  const [editedChapter, setEditedChapter] = useState<Chapter>(chapters[0]);
  const [savedMsg, setSavedMsg] = useState<string>('');
  const [hostPinInput, setHostPinInput] = useState<string>(
    localStorage.getItem('18_memories_host_pin') || '1818'
  );
  const [pinSavedMsg, setPinSavedMsg] = useState<string>('');

  const handleSelectChapter = (idx: number) => {
    setSelectedChapterIdx(idx);
    setEditedChapter(chapters[idx]);
  };

  const handleSaveChapter = () => {
    const updated = [...chapters];
    updated[selectedChapterIdx] = editedChapter;
    setChapters(updated);
    audioEngine.playSuccess();
    setSavedMsg('Chapter updated successfully!');
    setTimeout(() => setSavedMsg(''), 2000);
  };

  const handleSaveHostPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (hostPinInput.trim()) {
      localStorage.setItem('18_memories_host_pin', hostPinInput.trim());
      audioEngine.playSuccess();
      setPinSavedMsg('Host PIN updated successfully!');
      setTimeout(() => setPinSavedMsg(''), 2500);
    }
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(chapters, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '18_memories_custom_config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintQRCards = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0F10] overflow-y-auto p-4 text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-warmGold" />
          <h2 className="font-serif font-bold text-lg text-warmGold">Host Control Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          {onLockHost && (
            <button
              onClick={onLockHost}
              className="py-1.5 px-3 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-1 hover:bg-rose-500/30 transition-all"
              title="Lock Settings for Participant"
            >
              <Lock size={14} />
              <span>Lock Host Panel</span>
            </button>
          )}
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('EDIT')}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'EDIT'
              ? 'bg-warmGold text-[#0F0F10]'
              : 'bg-white/5 border border-white/10 text-white/70'
          }`}
        >
          Edit Chapters
        </button>
        <button
          onClick={() => setActiveTab('PRINT_QR')}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'PRINT_QR'
              ? 'bg-warmGold text-[#0F0F10]'
              : 'bg-white/5 border border-white/10 text-white/70'
          }`}
        >
          QR Cards 🖨️
        </button>
        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'SECURITY'
              ? 'bg-warmGold text-[#0F0F10]'
              : 'bg-white/5 border border-white/10 text-white/70'
          }`}
        >
          Host Security 🔒
        </button>
      </div>

      {activeTab === 'EDIT' && (
        <div className="space-y-4 max-w-lg mx-auto">
          {/* Chapter Selector Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-white/70">Select Chapter:</label>
            <select
              value={selectedChapterIdx}
              onChange={(e) => handleSelectChapter(Number(e.target.value))}
              className="flex-1 bg-[#1A162B] border border-white/20 rounded-lg p-2 text-xs text-white"
            >
              {chapters.map((ch, idx) => (
                <option key={ch.id} value={idx}>
                  #{ch.id}: {ch.title} ({ch.location})
                </option>
              ))}
            </select>
          </div>

          {/* Edit Chapter Form */}
          <div className="glass-card p-4 space-y-3 text-left border border-white/10 text-xs">
            <div>
              <label className="text-white/60">Chapter Title:</label>
              <input
                type="text"
                value={editedChapter.title}
                onChange={(e) => setEditedChapter({ ...editedChapter, title: e.target.value })}
                className="w-full mt-1 p-2 rounded bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div>
              <label className="text-white/60">Campus Location Name:</label>
              <input
                type="text"
                value={editedChapter.location}
                onChange={(e) => setEditedChapter({ ...editedChapter, location: e.target.value })}
                className="w-full mt-1 p-2 rounded bg-white/5 border border-white/15 text-white"
              />
            </div>

            <div>
              <label className="text-warmGold font-semibold">Hint 1 (Cryptic):</label>
              <textarea
                value={editedChapter.hint1}
                onChange={(e) => setEditedChapter({ ...editedChapter, hint1: e.target.value })}
                className="w-full mt-1 p-2 rounded bg-white/5 border border-white/15 text-white h-14"
              />
            </div>

            <div>
              <label className="text-warmGold font-semibold">Hint 2 (Shared Memory):</label>
              <textarea
                value={editedChapter.hint2}
                onChange={(e) => setEditedChapter({ ...editedChapter, hint2: e.target.value })}
                className="w-full mt-1 p-2 rounded bg-white/5 border border-white/15 text-white h-14"
              />
            </div>

            <div>
              <label className="text-warmGold font-semibold">Hint 3 (Easy):</label>
              <textarea
                value={editedChapter.hint3}
                onChange={(e) => setEditedChapter({ ...editedChapter, hint3: e.target.value })}
                className="w-full mt-1 p-2 rounded bg-white/5 border border-white/15 text-white h-14"
              />
            </div>

            <div>
              <label className="text-white/60">Memory Story Text:</label>
              <textarea
                value={editedChapter.memory}
                onChange={(e) => setEditedChapter({ ...editedChapter, memory: e.target.value })}
                className="w-full mt-1 p-2 rounded bg-white/5 border border-white/15 text-white h-20"
              />
            </div>

            <div>
              <label className="text-white/60">Assigned QR Code Token:</label>
              <input
                type="text"
                value={editedChapter.qrToken}
                onChange={(e) => setEditedChapter({ ...editedChapter, qrToken: e.target.value })}
                className="w-full mt-1 p-2 rounded bg-white/5 border border-white/15 font-mono text-warmGold"
              />
            </div>

            {savedMsg && <p className="text-xs text-emerald-400 font-bold text-center">{savedMsg}</p>}

            <button
              onClick={handleSaveChapter}
              className="w-full py-2.5 rounded-full bg-warmGold text-[#0F0F10] font-bold text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all"
            >
              <Save size={14} />
              <span>Save Chapter Changes</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleExportJSON}
              className="flex-1 py-2.5 rounded-full bg-white/10 border border-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Download size={14} />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onResetProgress}
              className="flex-1 py-2.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Lock size={14} />
              <span>Reset Progress</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'PRINT_QR' && (
        /* Printable QR Code Cards View */
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/10">
            <p className="text-xs text-white/80">Print these 18 QR Cards to hide across campus locations.</p>
            <button
              onClick={handlePrintQRCards}
              className="py-2 px-4 rounded-full bg-warmGold text-[#0F0F10] font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-all"
            >
              <Printer size={14} />
              <span>Print All Cards</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-2">
            {chapters.map((ch) => (
              <div
                key={ch.id}
                className="w-full aspect-[200/240] rounded-xl overflow-hidden border border-warmGold/40 bg-[#0F0F10]"
                dangerouslySetInnerHTML={{
                  __html: QRVerificationEngine.generateQRSVG(ch.qrToken, ch.title, ch.id)
                }}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'SECURITY' && (
        <div className="max-w-md mx-auto space-y-4 text-left">
          <div className="glass-card p-5 space-y-4 border border-warmGold/40">
            <div className="flex items-center gap-2">
              <Lock size={20} className="text-warmGold" />
              <h3 className="font-serif font-bold text-warmGold text-base">Host Passcode Settings</h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Set a passcode to prevent the birthday user from accessing this panel, viewing QR code tokens, or reading answers ahead of time.
            </p>

            <form onSubmit={handleSaveHostPin} className="space-y-3 pt-2">
              <div>
                <label className="text-xs text-white/60 block mb-1">Current Host PIN Passcode:</label>
                <input
                  type="text"
                  value={hostPinInput}
                  onChange={(e) => setHostPinInput(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  placeholder="e.g. 1818"
                  className="w-full p-2.5 rounded bg-white/5 border border-white/20 text-warmGold font-mono font-bold text-base focus:outline-none focus:border-warmGold"
                />
              </div>

              {pinSavedMsg && <p className="text-xs text-emerald-400 font-bold">{pinSavedMsg}</p>}

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-warmGold text-[#0F0F10] font-bold text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all"
              >
                <Save size={14} />
                <span>Save New Host PIN</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

