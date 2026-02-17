import { supabase } from './client';
import { Project, TimeEntry, TimeEntryWithProject } from '@/types';

// Projects
export async function getProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');
    if (error) throw error;
    return data as Project[];
}

export async function createProject(project: Omit<Project, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();
    if (error) throw error;
    return data as Project;
}

export async function deleteProject(id: string) {
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

export async function updateProject(id: string, project: Partial<Project>) {
    const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data as Project;
}

// Time Entries
export async function getTimeEntries() {
    const { data, error } = await supabase
        .from('time_entries')
        .select(`
      *,
      project:projects(*)
    `)
        .order('start_time', { ascending: false });
    if (error) throw error;
    return data as TimeEntryWithProject[];
}

export async function startTimeEntry(entry: Omit<TimeEntry, 'id' | 'created_at' | 'end_time' | 'duration_seconds'>) {
    const { data, error } = await supabase
        .from('time_entries')
        .insert({ ...entry, start_time: new Date().toISOString() })
        .select()
        .single();
    if (error) throw error;
    return data as TimeEntry;
}

export async function stopTimeEntry(id: string) {
    const endTime = new Date().toISOString();

    // First, get the start time to calculate duration
    const { data: entry } = await supabase
        .from('time_entries')
        .select('start_time')
        .eq('id', id)
        .single();

    if (!entry) throw new Error('Entry not found');

    const durationSeconds = Math.floor((new Date(endTime).getTime() - new Date(entry.start_time).getTime()) / 1000);

    const { data, error } = await supabase
        .from('time_entries')
        .update({
            end_time: endTime,
            duration_seconds: durationSeconds
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as TimeEntry;
}

export async function deleteTimeEntry(id: string) {
    const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

export async function updateTimeEntry(id: string, entry: Partial<TimeEntry>) {
    const { data, error } = await supabase
        .from('time_entries')
        .update(entry)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data as TimeEntry;
}
