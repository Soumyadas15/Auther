"use client"

import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form"
import { Modal } from "@/components/modals/modal"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { useCallback, useEffect, useState, useTransition } from "react"
import { useModal } from "@/hooks/use-modal-store"
import { useRouter } from "next/navigation"
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentSchema } from "@/schemas"
import { useToast } from "@/components/ui/use-toast"
import { updateStudent } from "@/actions/student/update-student.action"

export const EditStudentModal = () => {

    const router = useRouter();
    const { toast } = useToast();

    const { isOpen, onClose, type, student, studentId } = useModal();
    const isModalOpen = isOpen && type === "editStudentModal"

    // Create a form hook with empty default values
    const form = useForm<z.infer<typeof StudentSchema>>({
        resolver: zodResolver(StudentSchema),
        defaultValues: {
          name: '',
          email: '',
          classId: '',
          course: '',
          phone: '',
        },
    });

    // Update form default values when student data changes
    useEffect(() => {
        if (student) {
            form.reset({
                name: student.name || '',
                email: student.email || '',
                classId: student.classId || '',
                course: student.course || '',
                phone: student.number || '',
            });
        }
    }, [student, form]);

    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    const onSubmit = (values: z.infer<typeof StudentSchema>) => {
        if (!studentId) {
            toast({
                variant: "destructive",
                title: "Failed",
                description: "Student ID is missing",
            });
            return;
        }
        
        setLoading(true);
        startTransition(() => {
            updateStudent(values, studentId)
                .then(() => {
                    toast({
                        variant: "success",
                        title: "Success",
                        description: "Successfully updated student",
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

    const handleClose = useCallback(() => {
        form.reset();
        onClose();
    }, [form, onClose]);

    const bodyContent = (
        <Form {...form}>
            <div className="flex flex-col w-full gap-2">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input 
                                    className="focus-visible:ring-transparent focus:ring-0" 
                                    placeholder="Name" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input 
                                    className="focus-visible:ring-transparent focus:ring-0" 
                                    placeholder="Email" 
                                    type="email"
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="classId"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input 
                                    className="focus-visible:ring-transparent focus:ring-0" 
                                    placeholder="ID" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input 
                                    className="focus-visible:ring-transparent focus:ring-0" 
                                    placeholder="Course" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input 
                                    className="focus-visible:ring-transparent focus:ring-0" 
                                    placeholder="Phone" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </Form>
    );

    return (
        <Modal
            title="Edit Student Details"
            description="Update student information"
            onClose={handleClose}
            onSubmit={form.handleSubmit(onSubmit)}
            actionLabel="Save"
            secondaryAction={handleClose}
            secondaryActionLabel="Cancel"
            isOpen={isModalOpen}
            body={bodyContent}
            disabled={loading}
        />
    );
}