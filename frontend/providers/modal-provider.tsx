import { CreateStudentModal } from "@/components/modals/create-student-modal"
import { DeleteModal } from "@/components/modals/delete-modal"
import { EditStudentModal } from "@/components/modals/edit-student-modal"

export const ModalProvider = () => {
    return (
        <>
            <DeleteModal/>
            <CreateStudentModal/>
            <EditStudentModal/>
        </>
    )
}