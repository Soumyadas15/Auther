import { Student } from "@/types";
import { create } from "zustand";

export type ModalType = "createStudentModal" | "deleteModal" | "editStudentModal";

interface ModalStore {
    type: ModalType | null;
    isOpen: boolean;
    studentId: string | null;
    student: Student | null;
    onOpen: (type: ModalType, studentId?: string, student?: Student) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    studentId: null,
    student: null,
    onOpen: (type, studentId, student) => set({ type, isOpen: true, studentId, student }),
    onClose: () => set({ type: null, isOpen: false, studentId: null, student: null }),
}));