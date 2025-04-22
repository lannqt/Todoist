import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoaderCircle } from 'lucide-react';
import type { Board, BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Props {
    boards: Board[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Board',
        href: '/boards',
    },
];

export default function Board({ boards }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        name: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/boards/store`, {
            onSuccess: () => {
                reset();
                setIsDialogOpen(false);
                toast.success("Board Successfully Added", {
                    description: "Successfully Created Board!",
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Board" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">My Boards</h1>
                    <Button onClick={() => setIsDialogOpen(true)}>Add Board</Button>
                </div>

                {/* List Boards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {boards.map((board) => (
                        <Link
                            key={board.id}
                            href={`/boards/${board.encryptedId}`}
                            className="group relative aspect-video overflow-hidden rounded-lg border border-gray-200/80 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-gray-700/50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950"
                        >
                            {/* Animated Gradient Background */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-blue-100/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 dark:via-purple-900/10" />

                            {/* Floating Particles */}
                            <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-10 pointer-events-none">
                                {[...Array(15)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute rounded-full bg-indigo-400/70 animate-float dark:bg-purple-500/70"
                                        style={{
                                            width: `${Math.random() * 8 + 4}px`,
                                            height: `${Math.random() * 8 + 4}px`,
                                            top: `${Math.random() * 100}%`,
                                            left: `${Math.random() * 100}%`,
                                            animationDuration: `${Math.random() * 15 + 10}s`,
                                            animationDelay: `${Math.random() * 5}s`,
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Interactive Glow Effect */}
                            <div className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-700 [background:radial-gradient(400px_circle_at_var(--x)_var(--y),rgba(99,102,241,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 dark:[background:radial-gradient(400px_circle_at_var(--x)_var(--y),rgba(139,92,246,0.15),transparent_70%)]" />

                            {/* Content */}
                            <div className="relative z-10 flex h-full flex-col justify-between p-6">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-purple-400 mb-1">
                                        Board
                                    </p>

                                    {/* Board Name with Hover Effect */}
                                    <h3 className="mt-3 text-2xl font-bold text-gray-800 transition-all duration-300 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-purple-400">
                                        {board.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm backdrop-blur-sm dark:bg-gray-900/90 dark:text-purple-400">
                                    View Board
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
                {/* Dialog Tambah Board */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">
                                Add New Board
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={submit} className="space-y-4">
                            <Input
                                placeholder="Nama Board"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            <DialogFooter>
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="default"
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}