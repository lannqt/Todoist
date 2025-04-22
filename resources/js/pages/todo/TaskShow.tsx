import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, CalendarIcon, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { TaskHeader, TaskDetail } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { AlertCircle } from "lucide-react";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
// import {
//     Form,
//     FormControl,
//     FormDescription,
//     FormField,
//     FormItem,
//     FormLabel,
// } from "@/components/ui/form"

interface Props {
    taskHeader: TaskHeader & {
        task_details?: TaskDetail[];
    };
    encryptedTaskHeaderId: string;
}

export default function TaskHeaderShow({ taskHeader, }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<{ headerId: number, detailId: number } | null>(null);

    const { data, setData, put, processing, reset } = useForm<{
        title: string;
        description: string;
        isComplet: boolean;  // Change from 'false' to 'boolean'
        task_id: number;
    }>({
        title: "",
        description: "",
        isComplet: false,
        task_id: taskHeader.id
    });
    const [taskDetails, setTaskDetails] = useState<{ title: string, description: string, isComplet: boolean, task_id: number }[]>([]);
    const handleAddTaskDetail = () => {
        setTaskDetails([
            ...taskDetails,
            {
                title: data.title,
                description: data.description,
                isComplet: data.isComplet,
                task_id: data.task_id
            }
        ]);
        reset();
    };
    const handleReset = () => {
        reset();
        setTaskDetails([]);
    }
    const openAddDialog = () => {
        reset();
        setEditIndex(null);
        setIsDialogOpen(true);
    };
    const openEditDialog = (index: number) => {
        const detail = taskHeader.task_details?.[index];
        if (!detail) return;

        setData({
            // ...data,
            title: detail.title ?? "",
            description: detail.description ?? "",
            isComplet: !!detail.isComplet,
            task_id: taskHeader.id
        });
        setEditIndex(index);
        setIsDialogOpen(true);
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editIndex === null) {
            router.post(`/task_headers/${taskHeader.id}/multiDetail`, { data: taskDetails }, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        } else {
            const taskDetailId = taskHeader.task_details?.[editIndex]?.id;
            if (!taskDetailId) return;

            put(`/task_details/${taskDetailId}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const prepareDelete = (headerId: number, detailId: number) => {
        setTaskToDelete({ headerId, detailId });
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (!taskToDelete) return;

        router.delete(`/task/${taskToDelete.headerId}/${taskToDelete.detailId}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                toast.success("Task Successfully Deleted", {
                    description: "Task has been deleted!",
                });
            },
            onError: (error) => {
                toast.error("Failed to delete task.", error);
                console.error("Failed to delete task: ", error);
            }
        });
    };

    return (
        <AppLayout>
            <Head title={taskHeader.title} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 ">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Task Header Card */}
                    <div className="flex-1 rounded-2xl bg-gradient-to-br from-white via-white to-indigo-50 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 dark:hover:shadow-gray-800/70">
                        {/* Header with decorative accent */}
                        <div className="relative mb-6">
                            <div className="absolute -left-3 top-0 h-8 w-1.5 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600 dark:from-purple-500 dark:to-indigo-600"></div>
                            <div className="space-y-1">
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                                    {taskHeader.title}
                                </h1>
                                {taskHeader.deskripsi && (
                                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                                        {taskHeader.deskripsi}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Date Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Start Date Card */}
                            <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-700/50 dark:hover:bg-gray-700/70">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-inner dark:bg-purple-900/30 dark:text-purple-400">
                                    <CalendarIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Start</p>
                                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                        {taskHeader.start ? (
                                            format(new Date(taskHeader.start), "d MMMM yyyy", { locale: id })
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-500">-</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Deadline Date Card */}
                            <div className={`flex items-center gap-4 rounded-xl p-4 shadow-sm transition-all duration-300 hover:shadow-md ${taskHeader.dead_line && new Date(taskHeader.dead_line) < new Date()
                                ? "bg-red-50 dark:bg-red-900/20 hover:bg-red-100/70 dark:hover:bg-red-900/30"
                                : "bg-white dark:bg-gray-700/50 hover:bg-gray-50/70 dark:hover:bg-gray-700/70"
                                }`}>
                                <div className={`flex h-12 w-12 items-center justify-center rounded-full shadow-inner ${taskHeader.dead_line && new Date(taskHeader.dead_line) < new Date()
                                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-indigo-100 text-indigo-600 dark:bg-purple-900/30 dark:text-purple-400"
                                    }`}>
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Deadline</p>
                                    <p className={`text-lg font-medium ${taskHeader.dead_line && new Date(taskHeader.dead_line) < new Date()
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-gray-800 dark:text-gray-200"
                                        }`}>
                                        {taskHeader.dead_line ? (
                                            format(new Date(taskHeader.dead_line), "d MMMM yyyy", { locale: id })
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-500">-</span>
                                        )}
                                    </p>
                                    {taskHeader.dead_line && new Date(taskHeader.dead_line) < new Date() && (
                                        <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                                            The deadline has passed
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='justify-end flex'>
                    {/* Add Task Button - Floating on mobile, side on desktop */}
                    <div className="lg:self-end">
                        <Button
                            className="w-full lg:w-auto flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-6 px-8 rounded-xl"
                            onClick={openAddDialog}
                        >
                            <Plus className="w-5 h-5" />
                            <span className="text-lg font-medium">New Task</span>
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {taskHeader.task_details?.map((taskDetail, index) => (
                        <Card
                            key={taskDetail.id}
                            className={cn(
                                "group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                                taskDetail.isComplet
                                    ? "border-green-500/20 dark:border-green-500/30 bg-green-50/50 dark:bg-green-900/10"
                                    : "border-gray-200/80 dark:border-gray-700 bg-white dark:bg-gray-800/90"
                            )}
                        >
                            {/* Glow effect */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                taskDetail.isComplet
                                    ? "from-green-500/5 to-emerald-400/5"
                                    : "from-indigo-500/5 to-purple-500/5"
                            )}></div>

                            <CardHeader className="relative z-10">
                                <CardTitle className="text-xl font-bold text-gray-800 dark:text-white line-clamp-2">
                                    {taskDetail.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="relative z-10 space-y-4">
                                {taskDetail.description && (
                                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 min-h-[60px]">
                                        {taskDetail.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between gap-2">
                                    <Badge
                                        className={cn(
                                            "py-1.5 px-3 rounded-full font-medium transition-all",
                                            taskDetail.isComplet
                                                ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/80 dark:text-green-200"
                                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/80 dark:text-yellow-200"
                                        )}
                                    >
                                        {taskDetail.isComplet ? (
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                        )}
                                        {taskDetail.isComplet ? "Complete" : "Pending"}
                                    </Badge>

                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 rounded-full hover:bg-gray-200/70 dark:hover:bg-gray-700/80"
                                            onClick={() => openEditDialog(index)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>

                                        {!taskDetail.isComplet && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 rounded-full hover:bg-red-100/70 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
                                                        onClick={() => prepareDelete(taskHeader.id, taskDetail.id)}
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="max-w-md">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-lg">
                                                            Konfirmasi Penghapusan
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                                            You will delete this task:
                                                            <span className="font-semibold text-gray-800 dark:text-white block mt-1">
                                                                "{taskDetail.title}"
                                                            </span>
                                                            <span className="block mt-2">
                                                                This action cannot be undone.
                                                            </span>
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="border-gray-300 dark:border-gray-600">
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={handleDelete}
                                                            className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
                                                        >
                                                            <Trash className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </div>
                            </CardContent>

                            {/* Status indicator bar */}
                            <div className={cn(
                                "absolute bottom-0 left-0 right-0 h-1.5",
                                taskDetail.isComplet
                                    ? "bg-green-500/80"
                                    : "bg-yellow-500/80"
                            )}></div>
                        </Card>
                    ))}
                </div>

                {/* Jika tidak ada task details */}
                {taskHeader.task_details?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-lg text-gray-400 mb-4">No tasks!</p>
                    </div>
                )}
            </div>

            {/* Dialog untuk Tambah/Edit Task Detail */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if (!open) {
                    handleReset();
                    setIsDialogOpen(false);
                } else {
                    setIsDialogOpen(true);
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        {/* <DialogTitle>{editIndex === null ? "Tambah Task Detail" : "Edit Task Detail"}</DialogTitle> */}
                    </DialogHeader>
                    <div className="flex justify-between items-center">
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            {editIndex === null ? "Tambah Task Detail" : "Edit Task Detail"}
                        </DialogTitle>
                        {editIndex === null && (
                            <Button
                                type="button"
                                onClick={handleAddTaskDetail}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Task
                            </Button>
                        )}
                    </div>
                    <hr />
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Input */}
                        <div className="grid grid-cols-1 gap-4">
                            <label htmlFor="title" className="text-sm font-medium">Title Task</label>
                            <Input
                                id="title"
                                placeholder="Masukkan Judul Task"
                                value={data.title}
                                onChange={(e) => setData("title", e.target.value)}
                                className="  p-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                            />
                            <Input
                                id="task_id"
                                type='hidden'
                                placeholder="Masukkan Judul Task"
                                value={data.task_id}

                                className="  p-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                            />

                        </div>

                        {/* Description Input */}
                        <div className="grid grid-cols-1 gap-3">
                            <label htmlFor="description" className="text-sm font-medium">Description Task</label>
                            <Textarea
                                id="description"
                                placeholder="Masukkan Deskripsi Task"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                className="w-fullp-2 rounded-md focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                            />

                        </div>

                        {/* Completion Checkbox */}
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="isComplet"
                                checked={data.isComplet}
                                onCheckedChange={(checked) => {
                                    console.log("Checked value:", checked);
                                    setData("isComplet", checked === true);
                                }}
                                className="h-5 w-5 text-indigo-600 border-gray-300 rounded-md"
                            />
                            <label
                                htmlFor="isComplet"
                                className="text-sm font-medium"
                            >
                                Mark as completed
                            </label>
                        </div>

                        <DialogFooter className="flex justify-between mt-4">
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={() => {
                                    setIsDialogOpen(false);
                                    handleReset(); // Reset form ketika tombol batal diklik
                                }}
                                className="w-1/4"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                type="submit"
                                disabled={processing}
                                className="w-1/4"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>

                    {/* Daftar Task yang ditambahkan */}
                    {editIndex === null && taskDetails.length > 0 && (
                        <div className="border-t pt-4 mt-4 border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Added Task Details:
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {taskDetails.map((task, index) => (
                                    <div
                                        key={index}
                                        className="p-3 rounded-lg border border-gray-300 dark:border-white focus:ring-2 focus:ring-white"
                                    // className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500"

                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {task.title || "No Title"}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {task.description || "No Description"}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={task.isComplet ? "default" : "secondary"}
                                                className="ml-2"
                                            >
                                                {task.isComplet ? "Complete" : "Pending"}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}