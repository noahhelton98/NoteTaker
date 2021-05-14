//Import modules
const express = require("express");
const path = require("path");
const fs = require("fs");

// creating the express server
const app = express();
// Setting Initial port for listeners
var PORT = process.env.PORT || 3001;
//Set up app
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


//load index html and let you go to notes html when you click the button
app.get('/', (req, res) => {
    res.json(path.join(__dirname, "public/index.html"));
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});


//Get notes and display them 
app.get("/api/notes", function(req, res){    
    res.sendFile(path.join(__dirname, "./db/db.json"));
})

app.get("/api/notes", function(req, res) {
    res.json(path.join(__dirname, "./db/db.json"));
});  

//Write a new note and save it
app.post("/api/notes", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let id = (savedNotes.length).toString();
    newNote.id = id;
    savedNotes.push(newNote);
    //Write to json file
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})


//Delete notes - need to do it based on id 
app.delete("/api/notes/:id", (req, res) => {
    let allNotes = JSON.parse(fs.readFileSync("./db.json"));
    let noteId = req.params.id
    // after deleting note, filter out the rest to display
    allNotes = allNotes.filter(data => {
        return data.id != noteId;
    })
    fs.writeFileSync("./db.json", JSON.stringify(allNotes));
    res.json(allNotes);
});


//Listener
app.listen(PORT, () => {
    console.log(`App listening on localhost:${PORT}`);
  });