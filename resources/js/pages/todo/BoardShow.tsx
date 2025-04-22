import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { Head, Link, useForm } from '@inertiajs/react';
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, PlusCircle, Trash } from "lucide-react";
import { useState } from 'react';
import { Board, User } from '@/types';
import { toast } from "sonner";
import { DatePicker } from '@/components/ui/date-picker';
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, ClipboardList, Plus, Clock } from "lucide-react";

interface Props {
    board: Board;
    users: User[];
    existingUserIds: number[];
    // totalTaskDetails: [];
}

export default function BoardShow({ board, users: InitialUsers, existingUserIds }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialogInvite, setIsDialogInvite] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filteredUsers = InitialUsers.filter(user => !existingUserIds.includes(user.id));

    const [selectedUsers, setSelectedUsers] = useState<{ id: number | null, role: string }[]>([{ id: null, role: "member" }]);

    const addUserRow = () => setSelectedUsers([...selectedUsers, { id: null, role: "member" }]);
    const removeUserRow = (index: number) => setSelectedUsers(selectedUsers.filter((_, i) => i !== index));

    const updateUserSelection = (index: number, userId: number) => {
        const updatedUsers = [...selectedUsers];
        updatedUsers[index].id = userId;
        setSelectedUsers(updatedUsers);
    };

    const updateRoleSelection = (index: number, role: string) => {
        const updatedUsers = [...selectedUsers];
        updatedUsers[index].role = role;
        setSelectedUsers(updatedUsers);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { post: postInvite, processing: processingInvite, reset: resetInvite } = useForm();

    const inviteFriend = (e: React.FormEvent) => {
        e.preventDefault();
        const users = selectedUsers
            .filter(user => user.id !== null)
            .map(user => ({
                user_id: user.id,
                board_id: board.id,
                role: user.role,
            }));
        if (users.length === 0) {
            toast.error("Pilih setidaknya satu pengguna untuk diundang.");
            return;
        }
        router.post(`/boards/${board.encryptedId}/invite`, { users }, {
            onSuccess: () => {
                setIsDialogInvite(false);
                resetInvite();
                toast.success("User Berhasil Diundang");
            },
            onError: () => {
                toast.error("Gagal mengundang pengguna.");
            },
        });
    };


    const { data, setData, post, processing, reset } = useForm({
        title: "",
        deskripsi: "",
        dead_line: "",
        start: "",
        board_id: board.id,
        task_details: [{ title: "", description: "", isComplete: false }],
    });

    const addTaskDetail = () => {
        setData("task_details", [...data.task_details, { title: "", description: "", isComplete: false }]);
    };

    const removeTaskDetail = (index: number) => {
        setData("task_details", data.task_details.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/boards/${board.id}/task_headers`, {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
                toast.success("Task Successfully Added", {
                    description: "A new task has been added to the board.",
                });
            },
        });
    };
    const handleRemoveUser = (userId: number) => {
        router.post(
            route('boards.remove-user', board.encryptedId),
            { user_id: userId },
            {
                onSuccess: () => {
                    toast.success("User successfully deleted.");
                },
                onError: (errors: Record<string, string>) => {
                    toast.error(errors.error || "Failed to delete user.");
                },
            }
        );
    };

    return (
        <AppLayout>
            <Head title={board.name} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <h1 className="text-2xl font-bold truncate">{board.name}</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>New Task</Button>
                        <Button variant="outline" onClick={() => setIsDialogInvite(true)}>Invite Users</Button>
                    </div>
                </div>

                {/* List Users */}
                <div className="flex flex-wrap gap-3">
                    {board.users?.length ? (
                        board.users.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center gap-2 p-2 border rounded-lg shadow-sm relative"
                            >
                                <span className="font-medium">{user.name}</span>
                                {user.pivot?.role && (
                                    <Badge variant="secondary">{user.pivot.role}</Badge>
                                )}

                                {/* Titik 3 */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="text-red-500 hover:underline"><Trash className="w-5 h-5" /></button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Sure delete {user.name}?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleRemoveUser(user.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">There are no users on this board.</p>
                    )}
                </div>


                {/* List Task Headers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                    {board.task_headers?.length ? (
                        (board.task_headers ?? []).map((taskHeader) => {
                            const completedTasks = taskHeader.task_details?.filter(td => td.isComplet).length || 0;
                            const totalTasks = taskHeader.task_details?.length || 0;
                            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                            const isUrgent = taskHeader.dead_line && new Date(taskHeader.dead_line) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

                            return (
                                <Link
                                    key={taskHeader.id}
                                    className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-purple-500 hover:-translate-y-1"
                                    href={`/boards/${board.encryptedId}/task/${taskHeader.encryptedId}`}
                                >
                                    {isUrgent && (
                                        <div className="absolute top-3 -right-8 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-8 py-1 transform rotate-45 shadow-lg z-10 flex items-center justify-center">
                                            <span className="whitespace-nowrap">URGENT!</span>
                                        </div>
                                    )}

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-indigo-50/30 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative z-10 p-5 h-full flex flex-col">
                                        {/* Task Header */}
                                        <div className="mb-4">
                                            <h2 className="text-xl font-bold mb-1 text-gray-800 dark:text-white line-clamp-2">
                                                {taskHeader.title}
                                            </h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                                                {taskHeader.deskripsi || "No description"}
                                            </p>
                                        </div>

                                        {/* Dates section */}
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-5 h-5 flex-shrink-0 text-indigo-500 dark:text-purple-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Start Date</p>
                                                    <p className="text-sm text-gray-700 dark:text-gray-200">
                                                        {taskHeader.start ? (
                                                            format(new Date(taskHeader.start), "d MMM yyyy", { locale: id })
                                                        ) : (
                                                            <span className="text-gray-400">Not Set</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Clock className="w-5 h-5 flex-shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Deadline</p>
                                                    <p className={`text-sm ${isUrgent ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-gray-700 dark:text-gray-200'}`}>
                                                        {taskHeader.dead_line ? (
                                                            format(new Date(taskHeader.dead_line), "d MMM yyyy", { locale: id })
                                                        ) : (
                                                            <span className="text-gray-400">Not set</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-auto">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-500 dark:text-gray-400">Progress</span>
                                                <span className="font-medium text-indigo-600 dark:text-purple-400">
                                                    {progress}% ({completedTasks}/{totalTasks})
                                                </span>
                                            </div>

                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                                <div
                                                    className="h-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 dark:from-purple-400 dark:to-purple-600 transition-all duration-500 ease-out"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>

                                            {/* Visual task indicators */}
                                            {totalTasks > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {taskHeader.task_details?.map((task, index) => (
                                                        <div
                                                            key={index}
                                                            className={`w-2 h-2 rounded-full ${task.isComplet ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                                            title={task.title}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-12">
                            <ClipboardList className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">No tasks available</p>
                            <p className="text-gray-400 text-sm mt-1">Create your first task to get started</p>
                            <Button className="mt-4" variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Task
                            </Button>
                        </div>
                    )}
                </div>

                {/* Dialog Tambah Task */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">Add New Task</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Input
                                            id="title"
                                            placeholder="Masukkan judul task"
                                            value={data.title}
                                            onChange={(e) => setData("title", e.target.value)}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Textarea
                                            id="description"
                                            placeholder="Masukkan deskripsi task"
                                            value={data.deskripsi}
                                            onChange={(e) => setData("deskripsi", e.target.value)}
                                            className="min-h-[100px]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Start
                                        </label>
                                        <DatePicker
                                            value={data.start}
                                            onChange={(date) => setData("start", date ? format(date, "yyyy-MM-dd") : "")}
                                        //   className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Deadline
                                        </label>
                                        <DatePicker
                                            value={data.dead_line}
                                            onChange={(date) => setData("dead_line", date ? format(date, "yyyy-MM-dd") : "")}
                                        //   className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Task Details Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium leading-none">Detail Task</h3>

                                <div className="space-y-3">
                                    {data.task_details.map((taskDetail, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-3 items-start">
                                            <div className="col-span-5 space-y-1">
                                                <Input
                                                    placeholder="Judul detail"
                                                    value={taskDetail.title}
                                                    onChange={(e) => {
                                                        const updatedDetails = [...data.task_details];
                                                        updatedDetails[index].title = e.target.value;
                                                        setData("task_details", updatedDetails);
                                                    }}
                                                />
                                            </div>

                                            <div className="col-span-6 space-y-1">
                                                <Input
                                                    placeholder="Deskripsi"
                                                    value={taskDetail.description}
                                                    onChange={(e) => {
                                                        const updatedDetails = [...data.task_details];
                                                        updatedDetails[index].description = e.target.value;
                                                        setData("task_details", updatedDetails);
                                                    }}
                                                />
                                            </div>

                                            <div className="col-span-1 flex justify-end pt-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeTaskDetail(index)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <Trash size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full mt-2"
                                        onClick={addTaskDetail}
                                    >
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        Add Detail Task
                                    </Button>
                                </div>
                            </div>

                            {/* Dialog Footer */}
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto"
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    Save Task
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Dialog Invite Users */}
                <Dialog open={isDialogInvite} onOpenChange={setIsDialogInvite}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite Users</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                            {selectedUsers.map((user, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Select onValueChange={(value) => updateUserSelection(index, Number(value))}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Users" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {InitialUsers
                                                .filter(user => !existingUserIds.includes(user.id))
                                                .map((usr) => (
                                                    <SelectItem key={usr.id} value={usr.id.toString()}>
                                                        {usr.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <Select onValueChange={(value) => updateRoleSelection(index, value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="member">Member</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {index > 0 && (
                                        <Button variant="ghost" onClick={() => removeUserRow(index)}>
                                            <Trash size={18} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" onClick={addUserRow} className="mt-2">
                            <PlusCircle size={18} className="mr-2" /> Add Another User
                        </Button>
                        <DialogFooter>
                            <Button variant="secondary" onClick={() => setIsDialogInvite(false)}>Cancel</Button>
                            <Button variant="default" onClick={inviteFriend} disabled={processingInvite}>
                                {processingInvite && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Invite
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}