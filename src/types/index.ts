export interface Project {
    id: string;
    name: string;
    color: string;
    created_at: string;
}

export interface TimeEntry {
    id: string;
    task_name: string;
    project_id: string | null;
    start_time: string;
    end_time: string | null;
    duration_seconds: number | null;
    created_at: string;
}

export type TimeEntryWithProject = TimeEntry & {
    project: Project | null;
};
