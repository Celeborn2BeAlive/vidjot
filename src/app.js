import express from 'express'
import exphbs from 'express-handlebars'
import mongoose from 'mongoose'

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

// Handlebars Middleware
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

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

// Run server
const port = 5000;
app.listen(port, () =>  {
	console.log(`Server started on port ${port}`)
})