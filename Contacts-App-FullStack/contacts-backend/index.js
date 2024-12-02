const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

const requestLogger = (req, res, next) => {
  console.log(`Request Method: ${req.method}`);
  console.log(`Request URL: ${req.url}`);
  console.log("Request body:", req.body);
  console.log("------------");
  next();
};

app.use(requestLogger);

const port = 3001;

let contacts = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" },
];

app.get("/api/contacts", (req, res) => {
  res.json(contacts);
});

app.get("/api/info", (req, res) => {
  res.send(`<h1> Contacts Web Server </h1>
    <p> Number of contacts: ${contacts.length} </p>`);
});

app.get("/api/contacts/:id", (req, res) => {
  const contact = contacts.find((m) => m.id === Number(req.params.id));
  if (!contact) {
    res.status(404).json({ error: "Contact not found" });
  } else {
    res.json(contact);
  }
});

app.post("/api/contacts", (req, res) => {
  const { name, email } = req.body;
  const contactFind = contacts.find((m) => m.email === String(email));
  if (contactFind) {
    return res.status(409).json({ error: "Email already exists" });
  } else if (!name) {
    return res.status(400).json({ error: "Name is required" });
  } else if (!email) {
    return res.status(400).json({ error: "Email is required" });
  } else {
    const contact = {
      id: `${Date.now()}${Math.floor(Math.random() * 10000)}`,
      name,
      email,
    };
    contacts.push(contact);
    return res.status(201).json(contact);
  }
});

app.delete("/api/contacts/:id", (req, res) => {
  const contact = contacts.find((m) => m.id === Number(req.params.id));
  if (!contact) {
    res.status(404).json({ error: "Contact not found!" });
  } else {
    contacts = contacts.filter((m) => m.id != req.params.id);
    res.status(204).json({ message: "Contact deleted successfully" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
