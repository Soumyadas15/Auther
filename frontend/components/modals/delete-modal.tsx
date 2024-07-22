"use client"

import { Modal } from "./modal"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { useCallback, useState, useTransition } from "react"
import { useModal } from "@/hooks/use-modal-store"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { deleteStudent } from "@/actions/student/delete-student.action"
import { useToast } from "../ui/use-toast"


export const DeleteModal = () => {

    const { toast } = useToast();
    const { isOpen, onClose, type, studentId } = useModal();
    const isModalOpen = isOpen && type === "deleteModal";
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleClose = useCallback(() => {
        onClose();
    }, [])

    const onSubmit = async () => {
        setLoading(true)
        setLoading(true);
        startTransition(() => {
            deleteStudent(studentId!)
                .then(() => {
                    toast({
                        variant: "success",
                        title: "Success",
                        description: "Successfuly deleted student",
                    })
                })
                .catch((error) => {
                    toast({
                        variant: "destructive",
                        title: "Failed",
                        description: "Something went wrong",
                    })
                })
                .finally(() => {
                    setLoading(false);
                    handleClose();
                    router.refresh();
                })
        })
    }
    
    return (
        <div>
            <Modal
                title="Delete student"
                description="Are you sure you want to delete this student?"
                onClose={handleClose}
                onSubmit={onSubmit}
                actionLabel="Delete"
                secondaryAction={handleClose}
                secondaryActionLabel="Cancel"
                isOpen={isModalOpen}
                actionLabelVariant="destructive"
                disabled={loading}
            />
        </div>
    )
}