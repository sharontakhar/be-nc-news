const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("1. GET /api/topics", () => {
  test("status:200 sends back an array of topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toEqual(expect.any(Array));

        response.body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });

  test("POST:404 responds with an appropriate error message when provided with a bad topic (no description)", () => {
    return request(app)
      .post("/api/teams")
      .send({
        slug: "Bad Slug",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Route not found");
      });
  });
});
