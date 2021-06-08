const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const Person = require("./model/phonebook");

const app = express();
app.use(express.json());
app.use(express.static("build"));

app.use(cors());

morgan.token("body", function (request) {
  return JSON.stringify(request.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// get all persons
app.get("/api/persons", (response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// info page
app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    const date = new Date();
    const message = `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`;
    response.send(message);
  });
});

// single phonebook entry
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// delete single entry
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// add entry with post request
app.post("/api/persons", (request, response, next) => {
  // create new person object
  const newPerson = new Person({
    name: request.body.name,
    number: request.body.number,
  });
  console.log(`created ${newPerson}`);

  // save new contact
  newPerson
    .save()
    .then((savedPerson) => {
      console.log("-------------");
      console.log(JSON.stringify(savedPerson));
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

// update contact number
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    number: body.number,
  };

  console.log(body.name, body.number, body.id);

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      console.log("Updated");
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// if none of above endpoints are called
const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "Unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log("error name", error.name);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted id" });
  } else if (error.name === "ValidationError") {
    return response
      .status(400)
      .send({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
