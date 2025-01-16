const express = require('express');
const app = express();
app.use(express.json());

let notes =
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request,response)=>{
    response.json(notes);
})
app.get('/info',(request,response)=>{
    const d = new Date();
    const infoMessage= `
        <p>Phonebook has info for ${notes.length} people</p>
        <p>${d}</p>`;
    response.send(infoMessage);
    
})

app.get('/api/persons/:id',(request,response)=>{
    const getId= (request.params.id);
    const myNotes= notes.filter((note)=>note.id === getId);

    if(notes){
        response.json(myNotes);
    } else{
      response.status(404);
    }
})

app.delete('/api/persons/:id',(request,response)=>{
  const myId= (request.params.id);
  notes= notes.filter((note)=>note.id !== myId);
  response.status(204).send('okay');
})

app.post('/api/persons',(request,response)=>{
  const newNote= request.body;
  console.log(newNote)
  newNote.id= Math.floor(Math.random() *1000000);
  const name= newNote.name;
  const number= newNote.number;
  if (!name || !number) {
    return response.status(400).json({ error: 'content missing' });
  }
  else if (notes.find(note => note.name === name)) {
    return response.status(400).json({ error: 'name must be unique' });
  }
  notes.push(newNote)
  response.status(201).json(newNote);
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});