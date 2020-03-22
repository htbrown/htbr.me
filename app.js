const express = require('express'),
    ejs = require('ejs'),
    log = require('hexalogger'),
    app = express();

const config = require('./config.js');

const r = require('rethinkdb');

r.connect({
    db: config.db
}, (err, conn) => {
    r.dbConn = conn;
    if (err) {
        log.warn('Error when connecting to database. Is it down?')
    } else {
        log.success('Connected to database.')
    }
});

app.set('view engine', 'ejs');
app.use('/static', express.static('static'));

const passport = require('passport');
const Strategy = require('passport-discord').Strategy;
let scopes = ['identify', 'guilds'];

passport.serializeUser((user, done) => {
    done(null, user)
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new Strategy({
    clientID: config.discord.id,
    clientSecret: config.discord.secret,
    callbackURL: config.callbackURL,
    scope: scopes
}, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
        return done(null, profile);
    })
}));

const session = require('express-session');

app.use(session({
    secret: 'jkshdfgjkhdgfahjklldsfghsfdgbndsfghsdftynsfgbdfghdsftudfgbscdfgbsfgth',
    resave: false,
    saveUninitialized: false
}));

const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/login')
};

app.use(passport.initialize());
app.use(passport.session());


const favicon = require('serve-favicon');
app.use(favicon('./static/img/logo.png'))

app.get('/login', passport.authenticate('discord', {
    scopes
}));

app.get('/login/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/dashboard')
})

app.get('/logout', checkAuth, (req, res) => {
    req.logout();
    res.redirect('/');
})

app.get('/dashboard', checkAuth, async (req, res) => {
    if (config.discord.authedIDs.includes(req.user.id)) {
        (await r.table('urls').run(r.dbConn, (err, c) => c.toArray((err, results) => res.render('dashboard', {data: results, req, res}))));
    } else {
        res.render('403')
    }
})

app.get('/remove/:id', checkAuth, async (req, res) => {
    if (config.discord.authedIDs.includes(req.user.id)) {
        if (req.params.id) {
            let exists = (await r.table('urls').get(req.params.id).run(r.dbConn));
            if (!exists) {
                res.render('404');
            } else {
                (await r.table('urls').get(req.params.id).delete().run(r.dbConn));
                log.info(`Deleted redirect with ID ${req.params.id}`);
                res.redirect('/dashboard');
            }
        } else {
            res.render('404');
        }
    } else {
        res.render('403');
    }
});

app.use(express.json());
app.use(express.urlencoded());

app.post('/create', checkAuth, async (req, res) => {
    let id = req.body.id;
    let url = req.body.url;

    if (config.discord.authedIDs.includes(req.user.id)) {
        let exists = (await r.table('urls').get(id).run(r.dbConn));
        if (id == 'login' || id == 'logout' || id == 'dashboard' || id == 'remove' || id == 'create') return;
        if (!exists) {
            r.table('urls').insert({id: id, url: url}).run(r.dbConn, err => {
                if (err) return log.error(`Something went wrong with the database.\n${err}`)
            });
            log.info(`Created redirect with the ID ${id}`)
            return res.sendStatus(201);
        }
    }
})

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/:id', async (req, res) => {
    if (req.params.id) {
        let urlData = (await r.table('urls').get(req.params.id).run(r.dbConn));
        if (!urlData) return res.render('404');
        res.render('redirect', {
            urlData
        })
    }
})

app.listen(config.port, () => {
    log.info(`Listening on port ${config.port}`)
})