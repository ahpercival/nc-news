exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: 'Route Not Found' });
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};

exports.handle400 = (err, req, res, next) => {
  const codes = {
    4001: 'Incorrect order_by - please use asc or desc',
    4002: 'Invalid article ID'
  }
  if (codes[err.code]) {
    res.status(400).send({ msg: codes[err.code] });
  }
  else {
    next(err);
  }
};

// exports.handle404 = (err, req, res, next) => {
//   const codes = {
//     4041: 'No article found',
//   }
//   if (codes[err.code]) {
//     res.status(404).send({ msg: codes[err.code] });
//   }
//   else {
//     next(err);
//   }
// };