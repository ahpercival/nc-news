process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../app');
const connection = require('../db/connection');
const chai = require("chai");
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);

const request = supertest(app);

describe.only('The API endpoint - /api', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe('/', () => {
    describe('GET Request', () => {
      describe('Status 200 - OK', () => {
        it('/ - Responds true when reaching correct endpoint', () => {
          return request
            .get('/api')
            .expect(200)
            .then(({ body }) => {
              expect(body.ok).to.equal(true);
            });
        });
      });

      describe('Status 404 - Not Found', () => {
        it('/ - should return a Status 404 - Not Found with error msg if route is invalid', () => {
          return request
            .get('/api/topic')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.eql('Route Not Found')
            });
        });
      });
    });

    describe('The topics endpoint - /api/topics', () => {
      describe('/', () => {
        describe('GET Request', () => {
          describe('Status 200 - OK', () => {
            it('/ - Responds with an array of topic objects', () => {
              return request
                .get('/api/topics')
                .expect(200)
                .then(({ body }) => {
                  expect(body.topics).to.be.an("array")
                  expect(body.topics[0]).to.contain.keys('description', 'slug')
                });
            });
          });
        });
      });
    });

    describe('The articles endpoint - /api/articles', () => {
      describe('/', () => {
        describe('GET Request', () => {
          describe('Status 200 - OK', () => {
            it(' / - Responds with an array of article objects with correct keys', () => {
              return request
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                  expect(body.articles).to.be.an("array")
                  expect(body.articles[0]).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
                });
            });

            it(' / - Should be ordered by descending date order as default', () => {
              return request
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                  expect(body.articles).to.be.an("array")
                  expect(body.articles[0]).to.contain.keys('author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
                  expect(body.articles).to.be.descendingBy('created_at')
                });
            });

          })
        })
      })

      describe('/?', () => {
        describe('GET Request', () => {
          describe('Status 200 - OK', () => {
            it('/?author= - filters the articles by the username value', () => {
              return request
                .get('/api/articles/?author=rogersop')
                .expect(200)
                .then(({ body }) => {
                  expect(body.articles[0].author).to.eql('rogersop')
                });
            });

            it('/?topic= - filters the articles by the topic value if passed valid topic', () => {
              return request
                .get('/api/articles/?topic=cats')
                .expect(200)
                .then(({ body }) => {
                  expect(body.articles[0].topic).to.eql('cats')
                });
            });

            it('/?sort_by= - sorts the articles by column when passed any valid column (defaults to date)', () => {
              return request
                .get('/api/articles/?sort_by=author')
                .expect(200)
                .then(({ body }) => {
                  expect(body.articles).to.be.descendingBy('author')
                });
            });

            it('/?order_by= - orders articles in descending order', () => {
              return request
                .get('/api/articles/?order_by=desc')
                .expect(200)
                .then(({ body }) => {
                  expect(body.articles).to.be.descendingBy('created_at')
                });
            });

            it('/?order_by= - orders articles in ascending order', () => {
              return request
                .get('/api/articles/?order_by=asc')
                .expect(200)
                .then(({ body }) => {
                  expect(body.articles).to.be.ascendingBy('created_at')
                });
            });

          });

          describe('Status 400 - Bad Request', () => {

            it('/?sort_by= - should return 400 with message when passed invalid sort_by query', () => {
              return request
                .get('/api/articles/?sort_by=a')
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Unable to sort by undefined column')
                });
            });

            it('/?order_by= - should return 400 with message when passed invalid order_by query', () => {
              return request
                .get('/api/articles/?order_by=a')
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Invalid Request - please order_by asc or desc')
                });
            });

          });

          describe('Status 404 - Not Found', () => {
            it('/?author= - should return 404 with message when passed invalid author query', () => {
              return request
                .get('/api/articles/?author=a')
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.eql('No articles found by that author')
                });
            });

            it('/?topic= - should return 404 with message when passed invalid topic query', () => {
              return request
                .get('/api/articles/?topic=a')
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.eql('No articles found relating to that topic')
                });
            });

          });
        });
      });

      describe('/:article_id', () => {
        describe('GET Request', () => {
          describe('Status 200 - OK', () => {
            it('/:article_id - should return a Status 200 - OK with an article when passed valid article id', () => {
              return request
                .get('/api/articles/1')
                .expect(200)
                .then(({ body }) => {
                  expect(body.article[0].title).to.eql('Living in the shadow of a great man')
                });
            });
          });


          describe('Status 400 - Bad Request', () => {
            it('/:articleID - should return a Status 400 - Bad Request with error msg when passed invalid article_id', () => {
              return request
                .get('/api/articles/a')
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.eql('Invalid article ID')
                });
            });
          });

          describe('Status 404 - Not Found', () => {

            it('/:article_id - should return a Status 404 - Not Found with error msg if article does not exist', () => {
              return request
                .get('/api/articles/500000')
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.eql('No article found')
                });
            });

          });
        });

        describe('PATCH Request', () => {
          describe('Status 200 - OK', () => {
            it('/:article_id - Responds with the updated article', () => {
              const newVote = 0
              const vote = { inc_votes: newVote }
              return request
                .patch('/api/articles/1')
                .send(vote)
                .expect(200)
                .then(({ body }) => {
                  expect(body.article.votes).to.eql(100)
                  expect(body.article).to.contain.keys('author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes')
                })
            });

            it('/:article_id - Will increment article vote by one (as specified by request object)', () => {
              const newVote = 1
              const vote = { inc_votes: newVote }
              return request
                .patch('/api/articles/1')
                .send(vote)
                .expect(200)
                .then(({ body }) => {
                  expect(body.article.votes).to.eql(101)
                })
            });
            it('/:article_id - Will decrement article vote by ninty-nine (as specified by request object)', () => {
              const newVote = -99
              const vote = { inc_votes: newVote }
              return request
                .patch('/api/articles/1')
                .send(vote)
                .expect(200)
                .then(({ body }) => {
                  expect(body.article.votes).to.eql(1)
                })
            });
          });
        });
      });

      describe('/:article_id/comments', () => {
        describe('GET Request', () => {
          describe('Status 200 - OK', () => {
            it('/ - Responds with an array of comments for the given article ID', () => {
              return request
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                  body.comments.forEach(comment => {
                    console.log(comment)
                    expect(comment).to.contain.keys('comment_id', 'votes', 'created_at', 'author', 'body')
                  })
                });
            })
            it('/ - Should be ordered by created_at as default', () => {
              return request
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.be.descendingBy('created_at')
                });
            })
          });
        });

        describe('POST Request', () => {
          describe('Status 200 - OK', () => {
            it.only('Request body accepts an object with "username" & "body" properties', () => {
              const newComment = { username: 'icellusedkars', body: 'hello' }
              return request
                .post('/api/articles/1/comments')
                .send(newComment)
                .expect(200)
                .then(({ body }) => {
                  expect(body.comments).to.contain.keys('comment_id', 'votes', 'created_at', 'author', 'body')
                  expect(body.comments.author).to.eql('icellusedkars')
                  expect(body.comments.body).to.eql('hello')
                })
            });
          });

        });

        describe('/?', () => {
          describe('GET Request', () => {
            describe('Status 200 - OK', () => {
              it('/?sort_by= - sorts the comments by column when passed any valid column', () => {
                return request
                  .get('/api/articles/1/comments/?sort_by=author')
                  .expect(200)
                  .then(({ body }) => {
                    expect(body.comments).to.be.descendingBy('author')
                  });
              });

              it('/?order_by= - orders comments in descending order', () => {
                return request
                  .get('/api/articles/1/comments/?order_by=desc')
                  .expect(200)
                  .then(({ body }) => {
                    expect(body.comments).to.be.descendingBy('created_at')
                  });
              });
              it('/?order_by= - orders articles in ascending order', () => {
                return request
                  .get('/api/articles/1/comments/?order_by=asc')
                  .expect(200)
                  .then(({ body }) => {
                    expect(body.comments).to.be.ascendingBy('created_at')
                  });
              });

            });
            describe('Status 400 - Bad Request', () => {
              it('/?sort_by= - should return 400 with message when passed invalid sort_by query', () => {
                return request
                  .get('/api/articles/1/comments/?sort_by=a')
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('Unable to sort by undefined column')
                  });
              });
              it('/?order_by= - should return 400 with message when passed invalid order_by query', () => {
                return request
                  .get('/api/articles/1/comments/?order_by=a')
                  .expect(400)
                  .then(({ body }) => {
                    expect(body.msg).to.eql('Invalid Request - please order_by asc or desc')
                  });
              });
            });

          });
        });

      });

    });
  });
});



