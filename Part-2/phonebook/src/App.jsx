import { useState, useEffect } from 'react'
import Filter from './Filter'
import Person from './Person' 
import axios from 'axios'
import noteUpdate from './services/notes'
import Notification from './Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    let myAxios= noteUpdate.getAll();
    myAxios.then(response => {
      console.dir(response);
      setPersons(response);
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
  
    let nameExists = persons.find(person => person.name === newName);
  
    if (nameExists) {
      const confirmUpdate = window.confirm(
        `${newName} is already in the phonebook, replace the old number with the new one?`
      );
  
      if (confirmUpdate) {
        const updatedPerson = { ...nameExists, number: newNumber };
        noteUpdate
          .update(nameExists.id, updatedPerson)
          .then(response => {
            setPersons(persons.map(person => (person.id !== nameExists.id ? person : response)));
            setNotification(`Updated ${newName}`);
            setTimeout(() => setNotification(''), 5000);
          })
          .catch((error) => {
            if(error.response.status ===404){
              setNotification(
                `Information of ${newName} has already been removed from the server`
              );
              setTimeout(() => setNotification(''), 5000);
              setPersons(persons.filter(person => person.id !== nameExists.id));
            }
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };
      noteUpdate
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setNotification(`Added ${newName}`);
          setTimeout(() => setNotification(''), 5000);
        })
        .catch(() => {
          setNotification(`Error: Could not add ${newName}`);
          setTimeout(() => setNotification(''), 5000);
        });
    }
  };
  

  const handleDelete = (id, name) => {
    const result= window.confirm(`Delete ${name} ?`);
    if(result){
      let myPromise= noteUpdate.deletePerson(id);
      myPromise.then(response => {
        console.dir(response);
        setPersons(persons.filter(person => person.id !== id));
      })
    }
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
         <Notification message={notification} />
      </div>
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
        <Person personsToShow={filteredPersons} deleteData={handleDelete}  />
      </div>
    </div>
  )
}

export default App