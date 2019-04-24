const data = require('../data');
const { formatDate, createRef } = require("../../utils/seeding_functions")


exports.seed = (knex, Promise) => {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('topics')
        .insert(data.topicData)
        .returning('*')
    }).then(() => {
      return knex('users')
        .insert(data.userData)
        .returning('*')
    }).then(() => {
      return knex('articles')
        .insert(formatDate(data.articleData))
        .returning('*')
    }).then((articleRows) => {
      const { commentData } = data
      const amendedDate = formatDate(commentData)
      console.log(createRef(articleRows, 'title', 'article_id'))

      // format the comment data




      amendedDate.forEach(object => { object.created_by })


      return knex('comments')
        .insert()
        .returning('*')
    })
    .then((data) => { console.log('!?! NO ERRORS !?!') })
};
