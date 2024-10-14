import request from "supertest";
import {app} from "../../src/app";

const getRequest = () => {
    return request(app)
}

describe('/courses', () => {

    beforeAll(async () => {
        await getRequest().delete("/__tests__/data");
        const res = await getRequest().get("/courses");
        console.log("Courses after delete:", res.body);

    });

    it("should return 200 and an empty array", async () => {
        await getRequest()
            .get("/courses")
            .expect(200, [])


    });

    it("should return 404 for not existing course", async () => {
        await getRequest()
            .get("/courses/1")
            .expect(404)


    })




})