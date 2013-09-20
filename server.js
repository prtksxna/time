var express = require('express');
var lists = require("./routes/lists");
var tasks = require("./routes/tasks");

var app = express();

app.use(express.json());

app.get('/lists', lists.findAll);
app.get('/lists/:id', lists.findById);
app.post('/lists', lists.add);
app.put('/lists/:id', lists.update);
app.delete('/lists/:id', lists.delete);

app.get('/tasks', tasks.findAll);
app.get('/tasks/:list_id', tasks.findByList);
app.post('/tasks/:list_id', tasks.add);
app.put('/tasks/:list_id/:id', tasks.update);
app.delete('/tasks/:list_id/:id', tasks.delete);


app.listen(4242);
console.log('Listening on port 4242...');
