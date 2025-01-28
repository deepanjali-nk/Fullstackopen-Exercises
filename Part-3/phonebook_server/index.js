const express = require('express');
const app = express();
const cors = require('cors');
const { Person } = require('./mongo');  // Import the Person model from db.js

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
    response.json(persons);
    })
    .catch(error => {
      console.log(error);
      response.status(500).json({ error: 'Database fetch failed' });
    });
});

app.get('/info', (request, response) => {
  const d = new Date();
  Person.countDocuments({})
    .then(count => {
      const infoMessage = `
        <p>Phonebook has info for ${count} people</p>
        <p>${d}</p>`;
      response.send(infoMessage);
    })
    .catch(err => {
      response.status(500).json({ error: 'Unable to fetch info' });
    });
});
app.get("/api/persons/:id",((request,response,next)=>{
  Person.findById(request.params.id).then(note=>{
    if(note){
      response.json(note);
    }else{
      response.status(404).send(`Theres no note at ${request.params.id}`);    }
  })
  .catch(error=>{
    next(error);
  })

}))

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;
  const person = new Person({ name, number });
  person.save()
    .then(savedPerson => {
      response.status(201).json(savedPerson);
    })
    .catch(err => {
      response.status(400).json({ error: 'Error saving person' });
    });
});

const PORT = process.env.PORT? process.env.PORT: 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});