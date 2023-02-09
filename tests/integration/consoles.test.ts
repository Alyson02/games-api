import { Console } from "@prisma/client";
import app, { init } from "app";
import { prisma } from "config/database"
import supertest from "supertest";
import { createConsole } from "../factories/console-factory";
import { cleanDb } from "../helpers";

const api = supertest(app);

beforeAll(async () => {
    await init();
    await cleanDb();
});

beforeEach(async () => {
    await cleanDb()
});

describe("POST /consoles", () => {

    it("Should respond with status 422 when body is invalid", async () => {
        const res = await api.post("/consoles");
        expect(res.statusCode).toBe(422);
    })

    it("Should respond with status 409 when create new console already existis", async () => {
        const newConsole = await createConsole();
        const res = await api.post("/consoles").send({ name: newConsole.name });
        expect(res.statusCode).toBe(409);
    })

    it("Should respond with status 200 when body is valid", async () => {
        const res = await api.post("/consoles").send({ name: "playstation" });
        expect(res.statusCode).toBe(201);
    })
})

describe("GET /consoles", () => {

    it("Should respond with status 200 and empty array", async () => {
        const res = await api.get("/consoles");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    })

    it("Should respond with status 200 and body", async () => {
        await createConsole();
        const res = await api.get("/consoles");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.arrayContaining([{
            id: expect.any(Number),
            name: expect.any(String)
        }]));
    })
})


describe("GET /consoles/:id", () => {

    it("Should respond with status 404 when console dont exist", async () => {
        const res = await api.get("/consoles/4000");
        expect(res.statusCode).toBe(404);
    })

    it("Should respond with status 200 and body when console exist", async () => {
        const newConsole = await createConsole();
        const res = await api.get(`/consoles/${newConsole.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject<Console>({
            id: expect.any(Number),
            name: expect.any(String)
        });
    })
})