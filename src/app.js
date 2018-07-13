import express from 'express'
import exphbs from 'express-handlebars'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import flash from 'connect-flash'
import session from 'express-session'
import path from 'path'
import passport from 'passport'

// Load routes
import ideas from './routes/ideas'
import users from './routes/users'

// Passport Config
import passportConfig from './config/passport'
passportConfig(passport)

// DB Config
import * as db from './config/database'

const app = express()

// Connect to mongoose
async function connectToDatabase() {
    try {
        await mongoose.connect(db.mongoURI);
        console.log('MongoDB connected...')
    } catch (err) {
        console.error(err)
    }
}
connectToDatabase()

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Static folder
app.use(express.static(path.join(__dirname, '..', 'public')))

// Method override middleware
app.use(methodOverride('_method'))

// Express session middleware
app.use(session({
    secret: 'lol',
    resave: true,
    saveUninitialized: true
}))

// Passport middlewares (should be used after using express session)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})

// Index route
app.get('/', (req, res) => {
    const title = 'Welcome !'
    res.render('index', {
        title: title
    })
})

let counter = 0
setInterval(() => {
    ++counter
}, 1000)

// About route
app.get('/about', (req, res) => {
    res.render('about', { counter: counter })
})

app.use('/ideas', ideas)
app.use('/users', users)

// Run server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})