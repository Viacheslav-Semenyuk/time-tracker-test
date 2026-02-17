"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Square,
  Trash2,
  Plus,
  BarChart2,
  Loader2,
  Check,
  X,
  Edit3,
  ChevronDown
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTimeTracker } from "@/hooks/use-time-tracker";

// Separate View component to isolate hooks from early loading return
function DashboardView({ tracker }: { tracker: ReturnType<typeof useTimeTracker> }) {
  const {
    projects,
    entries,
    activeEntry,
    handleStart,
    handleStop,
    handleAddProject,
    handleDeleteProject,
    handleUpdateProject,
    handleDelete,
    handleUpdate,
    recentTaskNames
  } = tracker;

  const [taskName, setTaskName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState("00:00:00");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#5c7cfa");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState(""); // hh:mm format
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [editProjectColor, setEditProjectColor] = useState("");

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeEntry) {
      interval = setInterval(() => {
        const start = new Date(activeEntry.start_time).getTime();
        const now = new Date().getTime();
        const diff = Math.floor((now - start) / 1000);
        const h = Math.floor(diff / 3600).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        setElapsed(`${h}:${m}:${s}`);
      }, 1000);
    } else {
      setElapsed("00:00:00");
    }
    return () => clearInterval(interval);
  }, [activeEntry]);

  const onStart = async () => {
    if (!taskName.trim()) return;
    await handleStart(taskName, selectedProjectId);
    setTaskName("");
  };

  const onAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    await handleAddProject(newProjectName, newProjectColor);
    setNewProjectName("");
    setIsAddingProject(false);
  };

  const startEditing = (entry: any) => {
    if (!entry.end_time) return; // Prevent editing running tasks
    setEditingId(entry.id);
    setEditTaskName(entry.task_name);
    setEditProjectId(entry.project_id);
    const seconds = entry.duration_seconds || 0;
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    setEditTime(`${h}:${m}:${s}`);
  };

  const onSaveEdit = async () => {
    if (!editingId) return;
    const parts = editTime.split(':').map(Number);
    let seconds = 0;

    if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      seconds = parts[0] * 3600 + parts[1] * 60;
    }

    await handleUpdate(editingId, {
      task_name: editTaskName,
      project_id: editProjectId,
      duration_seconds: seconds
    });
    setEditingId(null);
  };

  const startEditingProject = (p: any) => {
    setEditingProjectId(p.id);
    setEditProjectName(p.name);
    setEditProjectColor(p.color);
  };

  const onSaveProjectEdit = async () => {
    if (!editingProjectId) return;
    await handleUpdateProject(editingProjectId, {
      name: editProjectName,
      color: editProjectColor
    });
    setEditingProjectId(null);
  };

  return (
    <>
      <datalist id="recent-tasks">
        {recentTaskNames.map(name => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <section className="soft-card p-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-white to-gray-50/50">
        <div className="space-y-1">
          <h2 className="text-muted-text text-sm font-medium tracking-wide uppercase">
            {activeEntry ? "Active Session" : "Ready to start?"}
          </h2>
          <div className="flex items-baseline gap-3">
            <h1 className={`text-5xl font-semibold tracking-tight transition-colors ${activeEntry ? 'text-accent' : 'text-gray-300'}`}>
              {elapsed}
            </h1>
            {activeEntry && (
              <span className="text-muted-text font-medium">
                {activeEntry.task_name} {activeEntry.project ? `(${activeEntry.project.name})` : ''}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {activeEntry ? (
            <button onClick={handleStop} className="h-16 px-8 rounded-full bg-red-500 text-white font-semibold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-500/20 cursor-pointer">
              <Square className="w-5 h-5 fill-current" />
              Stop Timer
            </button>
          ) : (
            <div className="text-sm text-muted-text italic">Start a task below to begin</div>
          )}
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <section className="md:col-span-2 space-y-6">
          <h3 className="text-xl font-semibold px-2">New Task</h3>
          <div className="soft-card p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border border-black/5">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What are you working on?"
              list="recent-tasks"
              className="flex-1 px-6 py-4 bg-transparent outline-none text-lg"
              onKeyDown={(e) => e.key === 'Enter' && onStart()}
            />
            <div className="flex items-center gap-2 px-2">
              <div className="relative group/select">
                <select
                  value={selectedProjectId || ""}
                  onChange={(e) => setSelectedProjectId(e.target.value || null)}
                  className="appearance-none bg-gray-100 pl-4 pr-10 py-2 rounded-xl text-sm outline-none cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <option value="">No Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover/select:text-accent transition-colors" />
              </div>
              <button
                onClick={onStart}
                disabled={activeEntry !== null || !taskName.trim()}
                className="aspect-square h-14 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent/80 transition-colors cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                <Play className="w-6 h-6 fill-current ml-1" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-text uppercase tracking-wider px-2">Recent Tasks</h4>
            {entries.length === 0 && <div className="text-center py-10 text-gray-400 italic">No entries yet</div>}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {entries.map((entry) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={entry.id}
                    className="soft-card p-6 flex items-center justify-between group hover:border-accent/20 transition-colors border border-transparent"
                  >
                    {editingId === entry.id ? (
                      <div className="flex-1 flex flex-col sm:flex-row items-center gap-4">
                        <input className="flex-1 px-4 py-2 bg-gray-50 rounded-lg outline-none text-sm" value={editTaskName} onChange={(e) => setEditTaskName(e.target.value)} />
                        <div className="relative group/select">
                          <select
                            value={editProjectId || ""}
                            onChange={(e) => setEditProjectId(e.target.value || null)}
                            className="appearance-none bg-gray-50 pl-4 pr-10 py-2 rounded-lg text-sm outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <option value="">No Project</option>
                            {projects.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover/select:text-accent transition-colors" />
                        </div>
                        <input className="w-24 px-4 py-2 bg-gray-50 rounded-lg outline-none text-sm font-mono text-center" value={editTime} onChange={(e) => setEditTime(e.target.value)} placeholder="hh:mm" />
                        <div className="flex items-center gap-2">
                          <button onClick={onSaveEdit} className="p-2 bg-accent text-white rounded-full hover:scale-110 transition-transform cursor-pointer">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-2 bg-gray-100 text-gray-400 rounded-full hover:scale-110 transition-transform cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.project?.color || '#e5e7eb' }} />
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700">{entry.task_name}</span>
                            <span className="text-xs text-muted-text">{entry.project?.name || 'No Project'} • {format(new Date(entry.start_time), 'MMM d, HH:mm')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-gray-400 font-mono italic">
                            {entry.duration_seconds
                              ? `${Math.floor(entry.duration_seconds / 3600).toString().padStart(2, '0')}:${Math.floor((entry.duration_seconds % 3600) / 60).toString().padStart(2, '0')}:${(entry.duration_seconds % 60).toString().padStart(2, '0')}`
                              : entry.end_time ? '00:00:00' : 'Running...'}
                          </span>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditing(entry)}
                              disabled={!entry.end_time}
                              className="p-2 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              title={!entry.end_time ? "Stop timer to edit" : "Edit task"}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              disabled={!entry.end_time}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              title={!entry.end_time ? "Stop timer to delete" : "Delete task"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-semibold">Projects</h3>
            <Link href="/reports" className="flex items-center gap-2 px-3 py-1.5 text-accent hover:bg-accent/5 rounded-lg transition-all group/report">
              <BarChart2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Reports</span>
            </Link>
          </div>
          <div className="soft-card p-6 space-y-4">
            {projects.map((p) => (
              <div key={p.id} className="p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                {editingProjectId === p.id ? (
                  <div className="space-y-3">
                    <input
                      autoFocus
                      className="w-full px-3 py-1.5 bg-white border border-accent/20 rounded-lg outline-none text-sm"
                      value={editProjectName}
                      onChange={(e) => setEditProjectName(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 relative group/color">
                        <input
                          type="color"
                          className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-none bg-transparent"
                          value={editProjectColor}
                          onChange={(e) => setEditProjectColor(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={onSaveProjectEdit}
                        className="flex-1 py-1.5 bg-accent text-white text-[10px] font-bold rounded uppercase cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingProjectId(null)}
                        className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="font-medium text-gray-700">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {confirmDeleteId === p.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              handleDeleteProject(p.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button onClick={() => setConfirmDeleteId(null)} className="p-1 text-gray-400 cursor-pointer">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditingProject(p)}
                            className="p-1.5 text-gray-400 hover:text-accent cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(p.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isAddingProject ? (
              <form onSubmit={onAddProject} className="space-y-3 pt-4 border-t border-gray-100">
                <input
                  autoFocus
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg outline-none text-sm"
                  placeholder="Project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 relative group/color">
                    <input
                      type="color"
                      className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-none bg-transparent"
                      value={newProjectColor}
                      onChange={(e) => setNewProjectColor(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="flex-1 py-2 bg-accent text-white text-xs font-bold rounded-lg uppercase cursor-pointer">Add</button>
                  <button type="button" onClick={() => setIsAddingProject(false)} className="px-4 py-2 text-xs font-bold text-gray-400 uppercase cursor-pointer">Cancel</button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingProject(true)}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 font-medium hover:border-accent/40 hover:text-accent transition-all cursor-pointer"
              >
                + New Project
              </button>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default function Home() {
  const tracker = useTimeTracker();

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto space-y-12 pb-24">
      {tracker.loading ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
        </div>
      ) : (
        <DashboardView tracker={tracker} />
      )}
    </main>
  );
}
