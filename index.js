const express = require("express");
const app = express();
// app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-532532",
  },
  {
    id: 3,
    name: "Dan Avramov",
    number: "12-42-123123",
  },
  {
    id: 4,
    name: "Mary Json",
    number: "123-333333",
  },
  {
    id: 5,
    name: "Mary Json",
    number: "123-333333",
  },
  {
    id: 6,
    name: "Mary Json",
    number: "123-333333",
  },
];

// get all persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// info page
app.get("/info", (request, response) => {
  const date = new Date();
  const message = `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`;
  response.send(message);
});

// single phonebook entry
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(`return person with id ${id}`);
  const person = persons.find((person) => person.id === id);
  person ? response.json(person) : response.status(404).end();
});

// delete single entry
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(`delete id ${id}`);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
