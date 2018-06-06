import express from 'express'

const app = express()

// Index route
app.get('/', (req, res) => {
    res.send('INDEX')
})

// About route
app.get('/about', (req, res) => {
    res.send('ABOUT')
})

const port = 5000;
app.listen(port, () =>  {
    console.log(`Server started on port ${port}`)
})