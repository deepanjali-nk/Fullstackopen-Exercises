require('dotenv').config();  
const mongoose = require("mongoose");

// if (process.argv.length < 3) {
//   console.log("give password ,name,number as arguments");
//   process.exit(1);
// }

const url = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);

mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number,
});
const Person = mongoose.model("Person", phonebookSchema);

if (process.argv.length === 3) {
  Person.find().then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];
  const person = new Person({ name, number });
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
module.exports = { Person };