import AppLayout from '@/layouts/app-layout';
import { TaskHeader, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { format, addDays, isToday, isSameMonth, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay, parseISO, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];
interface DashboardProps {
    totalBoards: number;
    tasks: TaskHeader[];
    today: string;
}

export default function Dashboard() {
    const { totalBoards, tasks, today } = usePage<DashboardProps>().props;
    const [currentDate, setCurrentDate] = useState(parseISO(today));
    const [selectedDate, setSelectedDate] = useState(parseISO(today));

    // Memoized calendar calculations
    const { daysInMonth, monthStart, monthEnd } = useMemo(() => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const startDate = addDays(monthStart, -getDay(monthStart));
        const endDate = addDays(monthEnd, 6 - getDay(monthEnd));
        
        const daysInMonth = eachDayOfInterval({
            start: startDate,
            end: endDate,
        });

        return { daysInMonth, monthStart, monthEnd };
    }, [currentDate]);

    // Memoized task filtering
    const selectedDateTasks = useMemo(() => {
        return tasks.filter(task => 
            isSameDay(parseISO(task.start), selectedDate)
        );
    }, [tasks, selectedDate]);

    const todayTasks = useMemo(() => {
    return tasks.filter(task =>
        isSameDay(parseISO(task.start), parseISO(today))
    );
}, [tasks, today]);


    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => direction === 'prev' 
            ? addDays(startOfMonth(prev), -1)
            : addDays(endOfMonth(prev), 1));
    };

    const handleDateSelect = (day: Date) => {
        setSelectedDate(day);
        if (!isSameMonth(day, currentDate)) {
            setCurrentDate(day);
        }
    };

    const goToToday = () => {
        const todayDate = parseISO(today);
        setCurrentDate(todayDate);
        setSelectedDate(todayDate);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                            Dashboard Overview
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {format(parseISO(today), 'EEEE, d MMMM yyyy', { locale: id })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={goToToday}
                            className="px-3 py-1.5 text-sm rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                            Today
                        </button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Tasks Section */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col h-full">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                                Today's Tasks
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {todayTasks.length} {todayTasks.length === 1 ? 'task' : 'tasks'} scheduled
                            </p>
                        </div>
                        
                        {todayTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                <svg className="w-12 h-12 text-blue-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="text-lg font-medium mb-1">No Tasks Today</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="overflow-y-auto flex-1 p-4">
                                <div className="space-y-3">
                                    {todayTasks.map(task => (
                                        <div
                                            key={task.id}
                                            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                                                    {task.title}
                                                </h3>
                                            </div>

                                            {task.deskripsi && (
                                                <p className="text-gray-600 dark:text-gray-300 my-2 text-sm line-clamp-2">
                                                    {task.deskripsi}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mt-2">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {format(parseISO(task.start), 'd MMM yyyy', { locale: id })}
                                                </div>
                                                {task.dead_line && (
                                                    <div className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {format(parseISO(task.dead_line), 'd MMM yyyy', { locale: id })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats Card */}
                    <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 p-6 shadow-sm overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-10">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full bg-indigo-400 dark:bg-purple-600 animate-float"
                                    style={{
                                        width: `${Math.random() * 10 + 5}px`,
                                        height: `${Math.random() * 10 + 5}px`,
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        animationDuration: `${Math.random() * 10 + 10}s`,
                                        animationDelay: `${Math.random() * 5}s`,
                                    }}
                                />
                            ))}
                        </div>

                        <div className="relative z-10 flex h-full flex-col">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-purple-400 mb-1">
                                    Workspace Analytics
                                </p>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white md:text-2xl">
                                    Your Productivity
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4 my-6">
                                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Boards</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {totalBoards}
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                        +{Math.floor(totalBoards * 0.2)} this month
                                    </p>
                                </div>
                                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Today's Tasks</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {todayTasks.length}
                                    </p>
                                    <p className={`text-xs mt-1 ${
                                        todayTasks.length > 5 ? 'text-red-600 dark:text-red-400' : 
                                        todayTasks.length > 0 ? 'text-blue-600 dark:text-blue-400' : 
                                        'text-green-600 dark:text-green-400'
                                    }`}>
                                        {todayTasks.length > 5 ? 'Busy day!' : 
                                         todayTasks.length > 0 ? 'Keep it up!' : 
                                         'All clear!'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                                
                            </div>
                        </div>
                    </div>

                    {/* Calendar Section */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col h-full">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                                    {format(currentDate, 'MMMM yyyy', { locale: id })}
                                </h3>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => navigateMonth('prev')}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        aria-label="Previous month"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => navigateMonth('next')}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        aria-label="Next month"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 px-2 pt-2 text-center">
                            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                                <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                                    {day}
                                </div>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 p-2 flex-1">
                            {daysInMonth.map((day, i) => {
                                const dayTasks = tasks.filter(task => 
                                    isSameDay(parseISO(task.start), day)
                                );
                                
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleDateSelect(day)}
                                        className={`p-1 rounded-lg flex flex-col items-center transition-colors
                                            ${!isSameMonth(day, currentDate) ? 'text-gray-400 dark:text-gray-600' : 
                                            isToday(day) ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                                            isSameDay(day, selectedDate) ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' :
                                            'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'}
                                        `}
                                        aria-label={`Select date ${format(day, 'd MMMM yyyy')}`}
                                    >
                                        <span className="text-sm font-medium">
                                            {format(day, 'd')}
                                        </span>
                                        {dayTasks.length > 0 && (
                                            <span className={`w-2 h-2 rounded-full mt-1 
                                                ${isSameDay(day, selectedDate) ? 'bg-indigo-600 dark:bg-indigo-300' : 
                                                isToday(day) ? 'bg-blue-600 dark:bg-blue-300' :
                                                'bg-gray-600 dark:bg-gray-300'}`}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                                {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: id })}
                            </h4>
                            {selectedDateTasks.length > 0 ? (
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {selectedDateTasks.map(task => (
                                        <div 
                                            key={task.id} 
                                            className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <span className="text-sm truncate">{task.title}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                                            {format(parseISO(task.start), 'dd MMMM', { locale: id })} - {format(parseISO(task.dead_line), 'dd MMMM yyyy', { locale: id })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    No tasks scheduled for this day
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}