const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;
//get random quote
app.get('/api/quotes/random', (req,res)=>{
const randomQuote = getRandomElement(quotes);
res.send({ quote: randomQuote });
})
//get all quotes/find quote by author
app.get('/api/quotes', (req,res) => {
    const filterQuotes = quotes.filter(author => {
        return author.person === req.query.person;
      });
    if (req.query.person){
        res.send({quotes: filterQuotes})
    }else {
    res.send({ quotes: quotes });}    
});
// post new quote via query - needs quote and person
app.post('/api/quotes', (req,res) =>{
    const newQuote = {
        quote : req.query.quote,
        person : req.query.person,
        id : quotes[quotes.length-1].id+1,
    };
    if (req.query.quote && req.query.person){
        quotes.push(newQuote);
        res.send({quote : newQuote});
    } else {res.sendStatus(400);}
});
//Add a PUT route for updating quotes in the data.
app.put('/api/quotes/:id',(req,res) => {
    const quoteId = req.params.id;
    let quoteToUpdate = quotes.find( quote => quote.id === Number(req.params.id) );
    if (quoteToUpdate == undefined){
        return res.sendStatus(404);
    }
    if (req.query.person){
        quoteToUpdate.person = req.query.person;
    }
    if (req.query.quote){
        quoteToUpdate.quote = req.query.quote;
    }
    res.send({quote : quoteToUpdate});
});
//Add a DELETE route for deleting quotes from the data array.
app.delete('/api/quotes/:id',(req,res) => {
    const quoteId = req.params.id;
    let quoteToDelete = quotes.find( quote => quote.id === Number(req.params.id) );
    if (quoteToDelete == undefined){
        return res.sendStatus(404);
    }else{
        quotes.splice(Number(quoteId)-1,1);
        res.sendStatus(200); 
    };
   
})
//Add other data to the array, such as the year of each quote, and try to display it on the front-end.
app.use(express.static('public'));
app.listen(PORT);
