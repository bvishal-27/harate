import { describe,expect,it } from "vitest";
import  request from "supertest";
import {app} from "../app.js";


describe ("GET /api/health",()=>{
    it("return 200 and status ok",async()=>{
        const res = await request(app).get("/api/health");

        expect (res.status).toBe(200);
        expect(res.body.status).toBe("ok");
    expect(res.body.app).toBe("Harate");
    });
});

describe("error handling",()=>{
    it("return a JSON 404 for unknown routes",async()=>{
        const res = await request(app).get("/api/this-does-not-exxist");

        expect (res.status).toBe(404);
        expect(res.body.success).toBe(false);

    });

    it("return a JSON 400 for a brolen JSON body",async()=>{
        const res = await request(app)
        .post("/api/health")
        .set("Content-Type","application/json")
        .send('{"email": ');

        expect (res.status).toBe(400);
        expect(res.body.message).toBe("Invalid JSON in request body");
    });

    });