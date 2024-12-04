import { useState, useEffect } from 'react'
import Filter from './Filter'
import Person from './Person' 
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let myAxios=axios.get('http://localhost:3001/persons')
    myAxios.then(response => {
      console.dir(response.data);
      setPersons(response.data);
    })
  }, [])
  const handleSubmit = (event) => {
    event.preventDefault();
    const  nameExists = persons.find(person => person.name === newName)
    if (nameExists) {
      alert(`${newName} is already added to phonebook`);
    }
    else{
      setPersons(persons.concat({ name: newName, number: newNumber }))
    }
    setNewName('');
    setNewNumber('');

  }

  const handleChange = (event) => {
    setNewName(event.target.value);
  }
  const handleNumber = (event) => {
    setNewNumber(event.target.value);
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const filteredPersons= persons.filter(person=> person.name.toLowerCase().includes(filter.toLowerCase()));
  
  return (
    <div>
      <h2>Phonebook</h2>
      <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        <Person personsToShow={filteredPersons} />
      </div>
    </div>
  )
}

export default App