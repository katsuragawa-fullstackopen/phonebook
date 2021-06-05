import React, { useEffect, useState } from "react";
import phonebookServices from "./services/phonebook";
import Filter from "./components/Filter";
import Form from "./components/Form";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  // setup hooks
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [alertMsg, setAlertMsg] = useState(null);
  const [msgStyle, setMsgStyle] = useState();

  useEffect(() => {
    phonebookServices.getContacts().then((contacts) => setPersons(contacts));
  }, []);

  // change the input and set the newName
  const handleNameInput = (e) => {
    setNewName(e.target.value);
  };

  // and the newNumber
  const handleNumberInput = (e) => {
    setNewNumber(e.target.value);
  };

  // change search input
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // event handler when add button in clicked
  const addPerson = (e) => {
    // prevent page reload
    e.preventDefault();
    // create new person object to add
    const newPersonObject = {
      name: newName,
      number: newNumber,
      id: persons[persons.length - 1].id + 1,
    };
    console.log(`Created new person object ${newPersonObject.name}`);

    // check if this person already exist
    if (
      persons.some(
        (person) =>
          person.name.toLocaleLowerCase() ===
          newPersonObject.name.toLocaleLowerCase()
      )
    ) {
      // if it does, check if user want to update it
      if (
        window.confirm(`${newName} already in the Phonebook, wanna update it?`)
      ) {
        const personToUpdate = persons.find(
          (person) => person.name === newName
        );
        newPersonObject.id = personToUpdate.id;
        console.log(newPersonObject.id);
        phonebookServices
          .updateContact(newPersonObject)
          .then((updatedContact) => {
            console.log(
              `Update ${updatedContact.id} ${updatedContact.name} number to ${updatedContact.number}`
            );
            setPersons(
              persons.map((person) =>
                person.id !== updatedContact.id ? person : updatedContact
              )
            );
            setNewName("");
            setNewNumber("");

            setAlertMsg(`Updated contact ${newPersonObject.name}`);
            setMsgStyle("add-message")
            setTimeout(() => {
              setAlertMsg(null);
            }, 2000);
          })
          .catch((error) => {
            console.log(error);
            setNewName("");
            setNewNumber("");

            setAlertMsg(`Sorry, the contact ${newPersonObject.name} was deleted from server`);
            setMsgStyle("sorry-message")
            setTimeout(() => {
              setAlertMsg(null);
            }, 2000);
          });
      } else {
        // if he dont want to update, reset input
        setNewName("");
        setNewNumber("");
      }
    } else {
      // else, add person to phonebook database
      phonebookServices
        .createContact(newPersonObject)
        .then((createdContact) => {
          console.log(`Add new person: ${createdContact.name}`);
          setPersons(persons.concat(createdContact));
          setNewName("");
          setNewNumber("");

          setAlertMsg(`Created new contact ${newPersonObject.name}`);
          setMsgStyle("add-message")
          setTimeout(() => {
            setAlertMsg(null);
          }, 2000);
        });
    }
  };

  // event handler for deleting contacts
  const deletePerson = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    console.log(personToDelete);
    if (window.confirm(`Do you want to delete entry ${personToDelete.name}`)) {
      console.log(`Delete id: ${id}`);
      phonebookServices.deleteContact(id).then(() => {
        const removedList = persons.filter((person) => person.id !== id);
        setPersons(removedList);
      });
    }
  };

  return (
    <div className="container">
      <h2>Phonebook</h2>
      <Filter search={search} handleSearch={handleSearch} />
      <Form
        newName={newName}
        handleNameInput={handleNameInput}
        newNumber={newNumber}
        handleNumberInput={handleNumberInput}
        addPerson={addPerson}
      />
      <Notification message={alertMsg} style={msgStyle} />
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
