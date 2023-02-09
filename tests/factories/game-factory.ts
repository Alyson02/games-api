import { prisma } from "config/database";
import { faker } from "@faker-js/faker"
import { Game } from "@prisma/client";

export async function createGame(consoleId: number) {
    return await prisma.game.create({
        data: {
            title: faker.name.firstName(),
            consoleId: consoleId
        }
    })
}