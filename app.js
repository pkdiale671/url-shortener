// external libraries
const express = require('express')
const mongoose = require('mongoose')
require('dotenv/config')

// instantiations
const ShortURL = require('./models/shortURL')
const app = express()

/*mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})*/

mongoose.connect(process.env.DB_CONNECTION, { 
        useUnifiedTopology: true,  
        useNewUrlParser: true  
    },
    () => console.log("DB Connected!")
)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))


// ENDPOINTS 

// homepage
app.get('/', (req, res) => {
    res.render('index', { shortURL: {} })
})

// create and shorten the url
app.post('/shortenURL', (req, res) => {
    const newShortUrl = new ShortURL({
        full: req.body.fullURL 
    })

    newShortUrl.save()
    newShortUrl['short'] = "nibbl.ga/" + newShortUrl['short']
    /*console.log(newShortUrl['short'])
    console.log(newShortUrl)*/
    res.render('index', { shortURL: newShortUrl })
})

// redirect to actual link via shortened URL
app.get('/:shortURL', async (req,res) => {
    ShortURL.find({ "short": req.params.shortURL }, function(err, url) {
        if (err) {
            console.log(err)
        } else {
            res.redirect(url.full)
        }
    })

    /*const shortURL = await ShortURL.findOne({ short: req.params.shortURL })
    if (shortURL == null)
        return 
    res.redirect(shortURL.full)*/


})

const PORT = process.env.PORT || 1234
app.listen(PORT, () => {
    console.log("Server is listening on port", PORT)
})