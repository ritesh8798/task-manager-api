const asyncWrapper = (fn) => {
  //                    ↑ fn = your controller function

  return (req, res, next) => {
    //  ↑ returns a NEW function — express can call this

    Promise.resolve(fn(req, res, next))
      //              ↑ runs your controller
      .catch(next);
    //          ↑ if error — sends to errorHandler automatically
  };
};

module.exports = asyncWrapper;
