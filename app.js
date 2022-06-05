const express = require('express');
require('./config/passport-setup');
require('./config/mongoose-setup');
const { cookieKey } = require('./config/keys');
const passport = require('passport');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/auth');
const pagesController = require('./controllers/pages');
const additionalController = require('./controllers/additional');
const { isUser, isAdmin } = require('./controllers/middlewares');
const userRouter = require('./routes/user');
const deleteRouter = require('./routes/delete');
const editRouter = require('./routes/edit');
const addRouter = require('./routes/add');
const Entry = require('./models/Entry');
const Person = require('./models/Person');

const app = express();

app.set('view engine', 'ejs');
app.use(cookieSession({ maxAge: 2 * 60 * 60 * 1000, keys: [cookieKey] }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);

app.get('/', pagesController.home);

app.get('/details/:id', pagesController.details);

app.get('/person/:id', pagesController.person);

app.get('/search-list', additionalController.searchList);

app.get('/list/more/:p', pagesController.listMore);

app.get('/list', pagesController.list);

app.get('/profile', isUser, pagesController.profile);

app.use('/user', isUser, userRouter);

app.use('/delete', isAdmin, deleteRouter);

app.use('/edit', isAdmin, editRouter);

app.use('/add', isAdmin, addRouter);

app.use((req, res) => {
    res.status(404).render('404', { user: req.user });
});

const server = app.listen(process.env.PORT || 3000);