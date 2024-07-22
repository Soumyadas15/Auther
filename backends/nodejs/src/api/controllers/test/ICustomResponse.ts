import { User } from "@prisma/client";

export interface ICustomResponse extends Response {
    user?: User; 
}