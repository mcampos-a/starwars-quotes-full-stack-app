console.log('May Node be with you')

const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const dbConnectionString = "mongodb+srv://mCampos:DataBaseService117@cluster0.t5ara.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

MongoClient.connect(dbConnectionString)
    .then(client => {
        console.log('Connected to Database');
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')

        //we render HTML with this based on what we get from the online mongoDB
        app.set('view engine', 'ejs')
        app.use(express.urlencoded({ extended: true }))
        //make the public main.js folder accessible to the public 
        app.use(express.static('public'))
        //this teaches our server to read JSON 
        app.use(express.json())
        //sends app landing page
        app.get('/', (req, res) =>{
            quotesCollection.find().toArray()
                .then(results=> {
        //This renders our embeded javascript file (ejs)
                    res.render('index.ejs', { quotes: results })
                    console.log(results)
                })
                .catch(error => console.error(error))
        
        })
        //grabs the name and quote submitted
        app.post('/quotes',(req, res)=>{
            console.log('Hello worldhopper take this form entry. It will go into your mongoDB')
            console.log(req.body)
        //This will grab what is entered into our name and quote forms and send it to our mongoDB
            quotesCollection
                .insertOne(req.body)
                .then(result => {
                    // console.log(result)
        //This line redericts the user ot the form/landing page after the submit button is hit
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        app.put('/quotes', (req, res)=>{
        //Find and replace the first yoda quote with a Darth Vader quote
            quotesCollection
                .findOneAndUpdate(
                    {name: 'Yoda'},
                    {
                        $set: {
                            name: req.body.name,
                            quote: req.body.quote,
                        },
                    },
                    {
                        upsert: true,
                    }
                )
                .then(result => {
                    res.json('Success')
                })
                .catch(error => console.error(error))
        })
        app.delete('/quotes', (req, res)=> {
            quotesCollection
                .deleteOne({ name:req.body.name })
                .then(result => {
                    if(result.deletedCount === 0){
                        return res.json('No quote to delete')
                    }
                    res.json('Deleted Darth Vaders quote')
                })
                .catch(error => console.error(error))
        })

        app.listen(3000, function(){
            console.log('listen on 3000')
        })

    })
    .catch(error => console.error(err));









