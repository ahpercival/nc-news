const apiRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const topicsRouter = require('./topics-router')
const articlesRouter = require('./articles-router')
const commentsRouter = require('./comments-router')
const userRouter = require('./user-router')

apiRouter
  .route('/')
  .get((req, res) => res.send({ ok: true }))
  .all(methodNotAllowed);

apiRouter.use('/topics', topicsRouter)

apiRouter.use('/articles', articlesRouter)

apiRouter.use('/comments', commentsRouter)

apiRouter.use('/users', userRouter)


module.exports = apiRouter;
