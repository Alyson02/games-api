import {prisma} from "config/database";
import {faker} from "@faker-js/faker"
import { Console } from "@prisma/client";

export async function createConsole(){
    return await prisma.console.create({
        data: {
            name: "faker.name.firstName()"
        }
    })
}