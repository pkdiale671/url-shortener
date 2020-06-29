const express = require('express')
const mongoose = require('mongoose')
const ShortURL = require('./models/shortURL')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

// ENDPOINTS ~ ROUTES
app.get('/', async (req, res) => {
    const shortURLs = await ShortURL.find()
    res.render('index', { shortURLs: shortURLs })
})

app.post('/shortURL', async (req, res) => {
    await ShortURL.create({ full: req.body.fullURL })
    res.redirect('/')
})

app.get('/:shortURL', async (req,res) => {
    const shortURL = await ShortURL.findOne({ short: req.params.shortURL })
    if (shortURL == null)
        return 

    shortURL.clicks++
    shortURL.save()

    res.redirect(shortURL.full)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("Server is runnning...")
})