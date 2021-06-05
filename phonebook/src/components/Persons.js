import React from "react";

const Persons = ({ persons, search, deletePerson }) => {
  // callback for filter
  const filterPerson = (person) =>
    person.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
    person.number.includes(search);
  return (
    <div>
      <ul>
        {/* show only persons compatible with the search */}
        {persons.filter(filterPerson).map((person) => (
          <li key={person.name}>
            {person.name}: <span>{person.number}</span>
            <button onClick={() => deletePerson(person.id)} className="del-btn">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Persons;
