const isUser = (req, res, next) => {
    if(req.user) next();
    else res.status(404).render('404', { user: req.user });
}

const isAdmin = (req, res, next) => {
    if(req.user && req.user?.role == 0) next();
    else res.status(404).render('404', { user: req.user });
}

module.exports = { isUser, isAdmin };