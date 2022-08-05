const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const articles = require("../db/data/test-data/articles");
const jestSorted = require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

//error handing
describe("GET:404 response", () => {
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

//get the topics
describe("1.GET /api/topics", () => {
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

//get articles by id
describe("2.GET /api/articles/:article_id", () => {
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
        expect(response.body.msg).toEqual("article not found");
      });
  });

  test("to return an article id with a comment count expect of 2", () => {
    const incrementedVotes = {};
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toEqual({
          article_id: 5,
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          comment_count: 2,
          created_at: "2020-08-03T13:14:00.000Z",
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          votes: 0,
        });
      });
  });

  test("to return an article id with an article count of zero expected", () => {
    const incrementedVotes = {};
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toEqual({
          article_id: 7,
          title: "Z",
          topic: "mitch",
          author: "icellusedkars",
          body: "I was hungry.",
          created_at: expect.any(String),
          votes: 0,
          comment_count: 0,
        });
      });
  });
});

//patch inc_votes
describe("3.PATCH /api/articles/:article_id", () => {
  test("status:200, responds with the incremented votes", () => {
    const incrementedVotes = { inc_votes: 12 };
    return request(app)
      .patch("/api/articles/3")
      .send(incrementedVotes)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Object.keys(articles).length).toBe(7);
        expect(articles).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 12,
        });
      });
  });

  test("status:200, responds with the incremented votes", () => {
    const incrementedVotes = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/3")
      .send(incrementedVotes)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Object.keys(articles).length).toBe(7);
        expect(articles).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: -100,
        });
      });
  });

  test("GET:400 responds with an appropriate error message when provided an incorrect request to increment votes)", () => {
    const incrementedVotes = { inc_votes: "bananas" };
    return request(app)
      .patch("/api/articles/3")
      .send(incrementedVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

  test("GET:200 response when no incrementVotes is added, inc_votes expected to default to a value of 0", () => {
    const incrementedVotes = {};

    return request(app)
      .patch("/api/articles/3")
      .send(incrementedVotes)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
        });
      });
  });
});

describe("3.PATCH error 404", () => {
  test("GET:404 when submitted an incorrect path of 'artifacts' not articles", () => {
    const incrementedVotes = {};
    return request(app)
      .patch("/api/artifacts/3")
      .send(incrementedVotes)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("Route not found");
      });
  });
});

//get users
describe("4.GET /api/users", () => {
  test("status:200 sends back an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users).toEqual(expect.any(Array));
        response.body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

//get articles
describe("5.GET /api/articles", () => {
  test("status:200 sends back an array of articles objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              article_id: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });

  test("the array to be ordered by date to be in DESC order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect([{ articles }]).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("Errors for/api/articles", () => {
  test("the array to be ordered by date to be in DESC order", () => {
    return request(app)
      .get("/api/art")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("Route not found");
      });
  });
});

//get comments
describe("9.GET /api/articles/:article_id/comments", () => {
  test("return an object of comments with the following properties", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
        });
      });
  });
  test("return a 400 on content not found on an extended article_id", () => {
    return request(app)
      .get("/api/articles/500/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("comment not found");
      });
  });
});
