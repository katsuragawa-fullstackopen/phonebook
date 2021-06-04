const express = require("express");
const app = express();

const persons = [
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
