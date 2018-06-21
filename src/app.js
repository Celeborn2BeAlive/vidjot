import express from 'express'
import exphbs from 'express-handlebars'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import './models/Idea'

const app = express()

// Connect to mongoose
async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://localhost/vidjot-dev');
        console.log('MongoDB connected...')
    } catch(err) {
        console.error(err)
    }
}
connectToDatabase()

const Idea = mongoose.model('ideas')

// Handlebars Middleware
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

// Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add')
})

// Edit Idea Form
app.get('/ideas/edit/:id', async (req, res) => {
    const idea = await Idea.findOne({
        _id: req.params.id
    })
    res.render('ideas/edit', {
        idea: idea
    })
})

app.get('/ideas', async (req, res) => {
    const ideas = await Idea.find({}).sort({ date: 'descending' })
    res.render('ideas/index', {
        ideas: ideas
    })
})

// Process form
app.post('/ideas', async (req, res) => {
    let errors = []
    
    if (!req.body.title) {
        errors.push({ text: 'Please add a title' })
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add some details' })
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
        return
    }

    const newUser = { ...req.body } 
    const idea = await new Idea(newUser).save()
    res.redirect('/ideas')
})

// Run server
const port = 5000;
app.listen(port, () =>  {
	console.log(`Server started on port ${port}`)
})