import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
    pivot?: {
        role: BoardRole;
    };
}

export interface Board {
    id: number;
    name: string;
    owner_id: number;
    created_at: string;
    updated_at: string;
    task_headers?: TaskHeader[];
    users?: User[];
    encryptedId: string;
    board_users: BoardUser[];
}

export interface TaskHeader {
    id: number;
    title: string;
    deskripsi: string;
    dead_line: string;
    start: string;
    board_id: number;
    created_at: string;
    updated_at: string;
    task_details?: TaskDetail[];
    encryptedId: string;
}

export interface TaskDetail {
    id: number;
    title: string;
    description: string | null;
    isComplet: boolean;
    task_id: number;
    created_at: string;
    updated_at: string;
    encryptedId: string;
}

export enum BoardRole {
    ADMIN = "admin",
    MEMBER = "member",
}

export interface BoardUser {
    readonly id: number;
    readonly user_id: number;
    readonly board_id: number;
    role: BoardRole;
    created_at: string;
    updated_at: string;
}