const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const articles = require("../db/data/test-data/articles");
const jestSorted = require("jest-sorted");
const { TestWatcher } = require("jest");

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
  test("return a 404 on content not found on an extended article_id", () => {
    return request(app)
      .get("/api/articles/500/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("comment not found");
      });
  });
});

//POST comments
describe("10. POST /api/articles/:article_id/comments", () => {
  test("to post a comment with the below object properties present", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "hello this is the username",
      })
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual({
          comment_id: expect.any(Number),
          body: "hello this is the username",
          article_id: 1,
          author: "butter_bridge",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });

  test("error message is returned if the username is not within the database", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "sharon_takhar",
        body: "hello this is the username",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("Bad Request");
      });
  });

  test("error message is returned if the post request is missing", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({
        body: "hello this is the username",
      })
      .expect(200)
      .then((response) => {
        expect(response.body.msg).toEqual("Missing key");
      });
  });
});

//ORDER, SORY BY  & FILTER BY COMMENTS
describe("11. GET /api/articles by query", () => {
  test("article was returned when sorted by author and ordered ASC", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=ASC")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSorted("author", { ascending: true });
      });
  });

  test("article was returned when filtered by the topic", () => {
    return request(app)
      .get("/api/articles?topic=cats&sort_by=author")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(body).toEqual({
          articles: [
            {
              article_id: 5,
              title: "UNCOVERED: catspiracy to bring down democracy",
              topic: "cats",
              author: "rogersop",
              body: "Bastet walks amongst us, and the cats are taking arms!",
              created_at: "2020-08-03T13:14:00.000Z",
              votes: 0,
              comment_count: 2,
            },
          ],
        });
      });
  });

  test("should return with the articles defaulting to descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(12);
        expect(articles).toEqual([
          {
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            comment_count: 2,
          },
          {
            article_id: 6,
            title: "A",
            topic: "mitch",
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 0,
            comment_count: 1,
          },
          {
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 0,
            comment_count: 0,
          },
          {
            article_id: 12,
            title: "Moustache",
            topic: "mitch",
            author: "butter_bridge",
            body: "Have you seen the size of that thing?",
            created_at: "2020-10-11T11:24:00.000Z",
            votes: 0,
            comment_count: 0,
          },
          {
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            comment_count: 2,
          },
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            comment_count: 11,
          },
          {
            article_id: 9,
            title: "They're not exactly dogs, are they?",
            topic: "mitch",
            author: "butter_bridge",
            body: "Well? Think about it.",
            created_at: "2020-06-06T09:10:00.000Z",
            votes: 0,
            comment_count: 2,
          },
          {
            article_id: 10,
            title: "Seven inspirational thought leaders from Manchester UK",
            topic: "mitch",
            author: "rogersop",
            body: "Who are we kidding, there is only one, and it's Mitch!",
            created_at: "2020-05-14T04:15:00.000Z",
            votes: 0,
            comment_count: 0,
          },
          {
            article_id: 4,
            title: "Student SUES Mitch!",
            topic: "mitch",
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            created_at: "2020-05-06T01:14:00.000Z",
            votes: 0,
            comment_count: 0,
          },
          {
            article_id: 8,
            title: "Does Mitch predate civilisation?",
            topic: "mitch",
            author: "icellusedkars",
            body: "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
            created_at: "2020-04-17T01:08:00.000Z",
            votes: 0,
            comment_count: 0,
          },
          {
            article_id: 11,
            title: "Am I a cat?",
            topic: "mitch",
            author: "icellusedkars",
            body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
            created_at: "2020-01-15T22:21:00.000Z",
            votes: 0,
            comment_count: 0,
          },
          {
            article_id: 7,
            title: "Z",
            topic: "mitch",
            author: "icellusedkars",
            body: "I was hungry.",
            created_at: "2020-01-07T14:08:00.000Z",
            votes: 0,
            comment_count: 0,
          },
        ]);
      });
  });

  test("api query returns err message 400 when incorrect sort_by query entered", () => {
    return request(app)
      .get("/api/articles?sort_by=bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });

  test("api query returns err message 400 when incorrect order query entered", () => {
    return request(app)
      .get("/api/articles?order=bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});

//DELETE COMMENTS
describe("12.DELETE api/comments/:comment_id", () => {
  test("return a 400 err if the path for the comment_id does not euqal a number", () => {
    return request(app)
      .delete("/api/comments/rhubarb")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
  test("return a 204 err if the path for the comment_id does not equal a number", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
});

//ENDPOINT

describe("GET /api", () => {
  test("return a 200 ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/topics": {
            description: "serves an array of all topics",
            queries: [],
            exampleResponse: {
              topics: [{ slug: "football", description: "Footie!" }],
            },
          },
          "GET /api/articles": {
            description: "serves an array of all topics",
            queries: ["author", "topic", "sort_by", "order"],
            exampleResponse: {
              articles: [
                {
                  title: "Seafood substitutions are increasing",
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  created_at: 1527695953341,
                },
              ],
            },
          },
        });
      });
  });
});
