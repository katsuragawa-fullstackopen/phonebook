const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("build"));

const cors = require("cors");
app.use(cors());

const morgan = require("morgan");
morgan.token("body", function (request, response) {
  return JSON.stringify(request.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

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

// add entry with post request
app.post("/api/persons", (request, response) => {
  // check name and number content
  if (!request.body.name || !request.body.number) {
    response.status(400).json({ error: "Content missing" });
  }
  // check if it's a duplicate
  if (persons.find((person) => person.name === request.body.name)) {
    response.status(409).json({ error: "Name must be unique" });
  }
  // create new person object and add to persons list
  const newPerson = {
    id: request.body.id,
    name: request.body.name,
    number: request.body.number,
  };
  persons.push(newPerson);
  // return persons
  response.json(persons);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
