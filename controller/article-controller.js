const { fetchArticleData, fetchArticleByID, updateArticleVote } = require('../models/article-model')

const getArticleData = (req, res, next) => {
    const order = ['asc', 'desc']

    if (req.query.hasOwnProperty('order_by') && !order.includes(req.query.order_by)) {
        return next({ code: '4001' })
    }

    fetchArticleData(req.query)
        .then(articles => {
            if (req.query.hasOwnProperty('author') && articles.length === 0) { return Promise.reject({ code: 4042 }) }
            if (req.query.hasOwnProperty('topic') && articles.length === 0) { return Promise.reject({ code: 4043 }) }
            return res.status(200).send({ articles })
        })
        .catch(next)

}

const getArticleByID = (req, res, next) => {

    if (!!req.params.article_id.match(/([A-Za-z])/)) {
        return next({ code: '4002' })
    }

    fetchArticleByID(req.params.article_id).then(article => {
        if (article.length === 0) {
            return Promise.reject({ code: '4041' })
        }
        return res.status(200).send({ article })
    })
        .catch(next)

}

const patchArticleVote = (req, res, next) => {
    updateArticleVote(req.params, req.body).then(article => {
        res.status(200).send({ article });
    })
        .catch(err => { console.log(err) })
}




module.exports = {
    getArticleData,
    getArticleByID,
    patchArticleVote,
}