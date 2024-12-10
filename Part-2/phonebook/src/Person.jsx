import React from 'react';

const Persons = ({ personsToShow, deleteData }) => {
  return (
    <div>
      {personsToShow.map(person => (
        <div key={person.name}>
          {person.name} {person.number} 
          <button onClick={()=>{
            deleteData(person.id,person.name)}}>delete</button>

        </div>
      ))}
    </div>
  );
};

export default Persons;
