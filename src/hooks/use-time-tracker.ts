"use client";

import { useState, useEffect, useCallback } from 'react';
import { getProjects, getTimeEntries, startTimeEntry, stopTimeEntry, createProject, deleteTimeEntry, updateTimeEntry, deleteProject, updateProject } from '@/lib/supabase/queries';
import { Project, TimeEntryWithProject } from '@/types';

export function useTimeTracker() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [entries, setEntries] = useState<TimeEntryWithProject[]>([]);
    const [activeEntry, setActiveEntry] = useState<TimeEntryWithProject | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        try {
            const [p, e] = await Promise.all([getProjects(), getTimeEntries()]);
            setProjects(p);
            setEntries(e);

            const active = e.find(entry => !entry.end_time);
            setActiveEntry(active || null);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const handleStart = async (taskName: string, projectId: string | null) => {
        if (activeEntry) return;
        const newEntry = await startTimeEntry({ task_name: taskName, project_id: projectId, start_time: new Date().toISOString() });
        await refreshData();
        return newEntry;
    };

    const handleStop = async () => {
        if (!activeEntry) return;
        await stopTimeEntry(activeEntry.id);
        await refreshData();
    };

    const handleAddProject = async (name: string, color: string) => {
        await createProject({ name, color });
        await refreshData();
    };

    const handleDeleteProject = async (id: string) => {
        try {
            await deleteProject(id);
            await refreshData();
        } catch (err) {
            console.error("Failed to delete project:", err);
            alert("Failed to delete project. It might have active entries.");
        }
    };

    const handleUpdateProject = async (id: string, proj: Partial<Project>) => {
        try {
            await updateProject(id, proj);
            await refreshData();
        } catch (err) {
            console.error("Failed to update project:", err);
        }
    };

    const handleDelete = async (id: string) => {
        await deleteTimeEntry(id);
        await refreshData();
    };

    const handleUpdate = async (id: string, entry: Partial<any>) => {
        await updateTimeEntry(id, entry);
        await refreshData();
    };

    const recentTaskNames = Array.from(new Set(entries.map(e => e.task_name)));

    return {
        projects,
        entries,
        activeEntry,
        loading,
        recentTaskNames,
        handleStart,
        handleStop,
        handleAddProject,
        handleDeleteProject,
        handleUpdateProject,
        handleDelete,
        handleUpdate,
        refreshData
    };
}
