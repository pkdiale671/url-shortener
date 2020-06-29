const express = require('express')
const mongoose = require('mongoose')
const ShortURL = require('./models/shortURL')
require('dotenv/config')
const app = express()

/*mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})*/

mongoose.connect(
    "mongodb://pkdiale671:<AlucardHellsing73007662>@cluster0-shard-00-00-driqj.mongodb.net:27017,cluster0-shard-00-01-driqj.mongodb.net:27017,cluster0-shard-00-02-driqj.mongodb.net:27017/<URLs>?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",    
    { 
        useUnifiedTopology: true,  
        useNewUrlParser: true  
    },
    () => console.log("DB connection successful")
)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))


// ENDPOINTS ~ ROUTES
app.get('/', (req, res) => {
    res.render('index', {shortURL: ""})
})

app.post('/shortURL', (req, res) => {
    let full_url = req.body.fullURL
    console.log(full_url)
    //ShortURL.create({ full: full_url })
    let url = new ShortURL({
        full: full_url
    })
    url.save()
    console.log('created!')
    //const shortURL = ShortURL.find( { full: full_url } )
    //console.log("shorturl here: ", shortURL)
    let shortURL = ""
    res.render('index', { shortURL: shortURL })
})

app.get('/:shortURL', async (req,res) => {
    const shortURL = await ShortURL.findOne({ short: req.params.shortURL })
    if (shortURL == null)
        return 

    res.redirect(shortURL.full)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server is runnning...")
})