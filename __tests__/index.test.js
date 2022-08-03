const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const articles = require("../db/data/test-data/articles");

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
});

describe("GET: 404 response", () => {
  test("Status:404 responds with an appropriate error message when provided with an incorrect path", () => {
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

describe("2. GET /api/articles/:article_id", () => {
  test("status:200 sends back an article  object with the following properties", () => {
    const article_titles = "Living in the shadow of a great man";
    const art_id = 3;
    return request(app)
      .get(`/api/articles/${art_id}`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(typeof articles).toBe("object");

        expect(articles).toEqual(
          expect.objectContaining({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
          })
        );
      });
  });

  test("GET:400 responds with an appropriate error message when provided with a incorrect article_id submitted)", () => {
    return request(app)
      .get("/api/articles/apples")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

  test("GET: 404 response when submitting and article_id which does not exist in the database", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("Route not found");
      });
  });
});
