import express from 'express'
import exphbs from 'express-handlebars'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import flash from 'connect-flash'
import session from 'express-session'
import path from 'path'

// Load routes
import ideas from './routes/ideas'
import users from './routes/users'

const app = express()

// Connect to mongoose
async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://localhost/vidjot-dev');
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

app.use(flash())

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

// Index route
app.get('/', (req, res) => {
    const title = 'Welcome !'
    res.render('index', {
        title: title
    })
})

// About route
app.get('/about', (req, res) => {
    res.render('about')
})

app.use('/ideas', ideas)
app.use('/users', users)

// Run server
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})