// import { getStudents } from "@/actions/student/get-students.actions";
import { columns } from "@/components/users/columns"
import { DataTable } from "@/components/users/data-table";

const UserPage = async () => {

    // const users = await getStudents();

    return (
        <div className="h-full w-full bg-background transition duration-300 px-4 md:px-14 pt-[6rem]">
            <div className="flex h-[15%] w-full items-start flex-col gap-2">
                <h1 className="text-foreground font-semibold text-4xl transition duration-100">Users</h1>
                <p className="text-muted-foreground transition duration-300">Manage your users, change their roles.</p>
                <hr className="w-full mt-2 b-[1px] bg-muted-foreground transition duration-300"/>
            </div>
            <div className="mt-4">
                {/* <DataTable columns={columns} data={users}/> */}
            </div>
        </div>
    )
}
export default UserPage;