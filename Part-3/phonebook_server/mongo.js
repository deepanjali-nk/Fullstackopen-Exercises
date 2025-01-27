const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password,name and number as argument')
  process.exit(1)
}

const password = process.argv[2]
const url =`mongodb+srv://deepanjali:${password}@phonebook-cluster.otpcb.mongodb.net/?retryWrites=true&w=majority&appName=Phonebook-Cluster`
mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Person = mongoose.model('Person', phoneSchema)

if(process.argv.length === 3){
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
}
else if(process.argv.length === 5){
    const name = process.argv[3];
    const number = process.argv[4];
    const person = new Person({ name, number });
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close()
    })
}
