import { useState } from 'react';
import { format, addDays, isToday, isSameMonth, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { id } from 'date-fns/locale';

// ... (other imports remain the same)

export default function Dashboard() {
    const { totalBoards, tasks: taskHeaders, today } = usePage().props;
    const [currentDate, setCurrentDate] = useState(new Date(today));
    const [selectedDate, setSelectedDate] = useState(new Date(today));

    // Calendar logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = addDays(monthStart, -getDay(monthStart));
    const endDate = addDays(monthEnd, 6 - getDay(monthEnd));
    
    const daysInMonth = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const nextMonth = () => setCurrentDate(addDays(monthEnd, 1));
    const prevMonth = () => setCurrentDate(addDays(monthStart, -1));
    const goToToday = () => {
        setCurrentDate(new Date(today));
        setSelectedDate(new Date(today));
    };

    // Filter taskHeaders for selected date
    const selectedDateTasks = taskHeaders.filter(task => 
        isSameDay(new Date(task.start), selectedDate)
    );

    // Group tasks by board for better organization
    const tasksByBoard = taskHeaders.reduce((acc, task) => {
        if (!acc[task.board_id]) {
            acc[task.board_id] = [];
        }
        acc[task.board_id].push(task);
        return acc;
    }, {});

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6">
                {/* ... (other sections remain the same) */}

                {/* Calendar Section */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-white dark:bg-gray-800">
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                                    {format(currentDate, 'MMMM yyyy', { locale: id })}
                                </h3>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={prevMonth}
                                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={goToToday}
                                        className="px-2 py-1 text-sm rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                                    >
                                        Today
                                    </button>
                                    <button 
                                        onClick={nextMonth}
                                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 p-2 text-center">
                            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                                <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                                    {day}
                                </div>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 p-2 flex-1">
                            {daysInMonth.map((day, i) => {
                                const dayTasks = taskHeaders.filter(task => 
                                    isSameDay(new Date(task.start), day)
                                );
                                
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDate(day)}
                                        className={`min-h-[60px] p-1 rounded-lg flex flex-col items-start 
                                            ${!isSameMonth(day, currentDate) ? 'text-gray-400 dark:text-gray-600' : 
                                            isToday(day) ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                                            isSameDay(day, selectedDate) ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' :
                                            'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'}
                                        `}
                                    >
                                        <span className="text-sm font-medium self-center">
                                            {format(day, 'd')}
                                        </span>
                                        <div className="w-full mt-1 space-y-1">
                                            {dayTasks.slice(0, 2).map(task => (
                                                <div 
                                                    key={task.id}
                                                    className={`text-xs p-1 rounded truncate 
                                                        ${task.priority === 'high' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                                        task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                                        'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'}`}
                                                >
                                                    {task.title}
                                                </div>
                                            ))}
                                            {dayTasks.length > 2 && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                                    +{dayTasks.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                                Tasks for {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: id })}
                            </h4>
                            {selectedDateTasks.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedDateTasks.map(task => (
                                        <div key={task.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <h5 className="font-medium text-gray-800 dark:text-gray-200">
                                                    {task.title}
                                                </h5>
                                                {task.priority && (
                                                    <span className={`px-2 py-1 text-xs rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                                                        {task.priority}
                                                    </span>
                                                )}
                                            </div>
                                            {task.deskripsi && (
                                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                                    {task.deskripsi}
                                                </p>
                                            )}
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Deadline: {task.dead_line ? format(new Date(task.dead_line), 'd MMM yyyy', { locale: id }) : 'No deadline'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-4 text-center">
                                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No tasks scheduled for this day
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}