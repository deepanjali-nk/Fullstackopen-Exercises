import { useState } from 'react'


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('');

  const handleName = (event) => {
    event.preventDefault();
    const  nameExists = persons.find(person => person.name === newName)
    if (nameExists) {
      alert(`${newName} is already added to phonebook`);
    }
    else{
      setPersons(persons.concat({ name: newName }))
    }
    setNewName('')
  }

  const handleChange = (event) => {
    setNewName(event.target.value);
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleName}>
        <div>
          name: <input value={newName} onChange={handleChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map(person => <p key={person.name}>{person.name}</p>)}
      </div>
    </div>
  )
}

export default App