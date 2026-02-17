"use client";

import { useState, useMemo } from "react";
import { useTimeTracker } from "@/hooks/use-time-tracker";
import { format, startOfDay, startOfWeek, startOfMonth, isWithinInterval, endOfDay } from "date-fns";
import { Download, ChevronLeft, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Reports() {
    const { entries, loading } = useTimeTracker();
    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

    const filteredEntries = useMemo(() => {
        const now = new Date();
        let start: Date;

        if (period === 'day') start = startOfDay(now);
        else if (period === 'week') start = startOfWeek(now, { weekStartsOn: 1 });
        else start = startOfMonth(now);

        return entries.filter(e => {
            if (!e.end_time) return false;
            return isWithinInterval(new Date(e.start_time), { start, end: endOfDay(now) });
        });
    }, [entries, period]);

    const stats = useMemo(() => {
        const projectMap: Record<string, { name: string; color: string; total: number }> = {};
        let grandTotal = 0;

        filteredEntries.forEach(e => {
            const pid = e.project_id || 'none';
            if (!projectMap[pid]) {
                projectMap[pid] = {
                    name: e.project?.name || 'No Project',
                    color: e.project?.color || '#e5e7eb',
                    total: 0
                };
            }
            const duration = e.duration_seconds || 0;
            projectMap[pid].total += duration;
            grandTotal += duration;
        });

        return { projects: Object.values(projectMap), grandTotal };
    }, [filteredEntries]);

    const exportCSV = () => {
        const headers = ['Task', 'Project', 'Start', 'End', 'Duration (s)'];
        const escapeCSV = (val: string | number) => {
            const s = String(val);
            if (s.includes(',') || s.includes('"') || s.includes('\n')) {
                return `"${s.replace(/"/g, '""')}"`;
            }
            return s;
        };

        const rows = filteredEntries.map(e => [
            escapeCSV(e.task_name),
            escapeCSV(e.project?.name || 'No Project'),
            escapeCSV(e.start_time),
            escapeCSV(e.end_time || ''),
            escapeCSV(e.duration_seconds || 0)
        ]);

        const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
        // Add UTF-8 BOM for Excel compatibility
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `report-${period}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    if (loading) return null;

    return (
        <main className="min-h-screen p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-muted-text hover:text-accent transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Timer
                </Link>
                <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all text-sm"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            <header className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Time Reports</h1>
                <p className="text-muted-text">Analyze your productivity and project distributions.</p>
            </header>

            <section className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
                {(['day', 'week', 'month'] as const).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-8 py-2 rounded-xl text-sm font-bold uppercase transition-all ${period === p ? 'bg-white shadow-sm text-accent' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {p}
                    </button>
                ))}
            </section>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="soft-card p-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">Project Distribution</h3>
                            <div className="text-2xl font-bold text-accent">{formatDuration(stats.grandTotal)}</div>
                        </div>

                        <div className="space-y-6">
                            {stats.projects.length === 0 && <div className="text-center py-20 text-gray-400 italic">No data for this period</div>}
                            {stats.projects.map((p) => (
                                <div key={p.name} className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                            {p.name}
                                        </span>
                                        <span>{formatDuration(p.total)}</span>
                                    </div>
                                    <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                backgroundColor: p.color,
                                                width: `${(p.total / stats.grandTotal) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="soft-card p-8 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center">
                        <BarChart3 className="w-8 h-8 text-accent" />
                    </div>
                    <h4 className="font-bold">Summary</h4>
                    <p className="text-sm text-muted-text leading-relaxed">
                        You've tracked a total of <span className="text-accent font-bold">{stats.grandTotal > 0 ? formatDuration(stats.grandTotal) : 'no time'}</span> for the current {period}.
                    </p>
                </div>
            </div>
        </main>
    );
}
