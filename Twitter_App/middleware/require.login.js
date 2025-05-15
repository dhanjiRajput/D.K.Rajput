const requireLogin=(req, res, next)=> {
  if (!req.session.userId) return res.status(401).json({ message: 'Login required' });
  next();
}

module.exports=requireLogin;