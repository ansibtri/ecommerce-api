const sessionChecker = () => (req, res, next) => {
    const user = req.session.user;
  if (user) {
    return res.status(200).send(JSON.stringify({"message":"User Logged In","data":user}));
  } else {
    next();
  }
};