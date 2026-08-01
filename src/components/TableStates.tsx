import {AlertCircle, RefreshCw, Inbox} from "lucide-react";

export function TableSkeleton({rows = 8}: {rows?: number}) {
    return (
        <div className="animate-pulse">
            {Array.from({length: rows}).map((_, index) => (
                <div key={index} className="flex items-center gap-4 border-b border-slate-100 px-4 py-4">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-slate-200"/>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 rounded bg-slate-200"/>
                        <div className="h-2.5 w-20 rounded bg-slate-100"/>
                    </div>
                    <div className="h-3 w-16 rounded bg-slate-200"/>
                    <div className="h-3 w-12 rounded bg-slate-100"/>
                    <div className="h-6 w-24 rounded bg-slate-100"/>
                </div>
            ))}
        </div>
    );
}

interface ErrorStateProps {
    message: string;
    onRetry: () => void;
}

export function ErrorState({message, onRetry}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
            <AlertCircle size={28} className="text-red-500"/>
            <p className="text-sm text-slate-700">{message}</p>
            <button
                type="button"
                onClick={onRetry}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2
                    text-sm text-white transition-colors hover:bg-blue-700"
            >
                <RefreshCw size={15}/>
                נסה שוב
            </button>
        </div>
    );
}

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel: string;
    onAction: () => void;
}

export function EmptyState({title, description, actionLabel, onAction}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
            <Inbox size={28} className="text-slate-300"/>
            <p className="text-sm font-semibold text-slate-700">{title}</p>
            <p className="text-xs text-slate-400">{description}</p>
            <button
                type="button"
                onClick={onAction}
                className="mt-2 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm text-white
                    transition-colors hover:bg-blue-700"
            >
                {actionLabel}
            </button>
        </div>
    );
}

export function StaleFeedBanner() {
    return (
        <div className="border-b border-amber-100 bg-amber-50 px-4 py-1.5 text-xs text-amber-700">
            הנתונים אינם מתעדכנים כרגע
        </div>
    );
}