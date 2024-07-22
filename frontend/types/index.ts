export type User = {
    name?: string,
    email?: string,
    image?: string,
    role: 'GUEST' | 'ADMIN',
}
export type Student = {
    name?: string,
    email?: string,
    classId?: string,
    course?: string,
    number?: string,
}