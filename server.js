const express = require('express')
const { writeFile } = require('fs')
const path = require('path')
const notes = ('./db/db.json')
const fs = require('fs')
var uniqid = require('uniqid')

const PORT = 3001;

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

// GET Route for notes database
app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './db/db.json'))
);

// POST Route for new note
app.post('/api/notes', (req, res) => {
    const { title, text, id } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uniqid()
    };
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err){
            console.error(err)
        } else {
        const dataBase = JSON.parse(data)
        dataBase.push(newNote)
           
        fs.writeFile(`./db/db.json`, JSON.stringify(dataBase), (err) => 
        err
            ? console.error(err)
            :console.log('Note save successful'))
    }})
  
    const response = {
      status: 'success',
      body: newNote,
    };
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting review');
  }
})
