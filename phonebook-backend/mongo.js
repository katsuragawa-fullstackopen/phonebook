const mongoose = require("mongoose");

// some input missing
if (process.argv.length < 5 && process.argv.length > 3) {
  console.log(
    "Missing input, example: 'node mongo.js <yourpassword> Anna 040-1234556'"
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://katsuragawa:${password}@cluster0.pa5e7.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personsSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("person", personsSchema);

// if process started with <password> <name> <number>, creat a new contact
if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`New contact ${result.name} added`);
    mongoose.connection.close();
  });
}

// if process it's started with only <password>, return all contacts
if (process.argv.length === 3) {
  console.log("Phonebook:");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name, person.number);
      mongoose.connection.close();
    });
  });
}
