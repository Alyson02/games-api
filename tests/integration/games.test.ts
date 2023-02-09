import { Game } from "@prisma/client";
import app, { init } from "app";
import supertest from "supertest";
import { createConsole } from "../factories/console-factory";
import { createGame } from "../factories/game-factory";
import { cleanDb } from "../helpers";

const api = supertest(app);

beforeAll(async () => {
    await init();
    await cleanDb();
});

beforeEach(async () => {
    await cleanDb()
});

describe("POST /games", () => {

    it("Should respond with status 422 when body is invalid", async () => {
        const res = await api.post("/games");
        expect(res.statusCode).toBe(422);
    })

    it("Should respond with status 409 when create new console already existis", async () => {
        const newConsole = await createConsole();
        const newGame = await createGame(newConsole.id);
        const res = await api.post("/games").send({ title: newGame.title, consoleId: newConsole.id });
        expect(res.statusCode).toBe(409);
    })

    it("Should respond with status 200 when body is valid", async () => {
        const newConsole = await createConsole();
        const res = await api.post("/games").send({ title: "playstation2", consoleId: newConsole.id });
        expect(res.statusCode).toBe(201);
    })
})


describe("GET /games", () => {

    it("Should respond with status 200 and empty array", async () => {
        const res = await api.get("/games");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    })

    it("Should respond with status 200 and body", async () => {
        const newConsole = await createConsole();
        await createGame(newConsole.id);

        const res = await api.get("/games");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            consoleId: expect.any(Number),
        })]));
    })
})

describe("GET /games/:id", () => {

    it("Should respond with status 404 when console dont exist", async () => {
        const res = await api.get("/games/4000");
        expect(res.statusCode).toBe(404);
    })

    it("Should respond with status 200 and body when game exist", async () => {
        const newConsole = await createConsole();
        const newGame = await createGame(newConsole.id);

        const res = await api.get(`/games/${newGame.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject<Game>({
            id: expect.any(Number),
            title: expect.any(String),
            consoleId: expect.any(Number),
        });
    })
})