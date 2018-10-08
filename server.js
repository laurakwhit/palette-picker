const environment = process.env.NODE_ENV || 'development'; // if NODE_ENV is not defined in global environment, use development
const configuration = require('./knexfile')[environment]; // require environment's settings from knexfile.js
const database = require('knex')(configuration); // connect to DB via knex using environment's settings 
const express = require('express'); // import express function
const app = express(); // create app variable by invoking express function 
const bodyParser = require('body-parser'); // imporl body parser module

app.set('port', process.env.PORT || 3000); // if PORT is not defined in global environment, use 3000
app.use(bodyParser.json()); // tell app to use json
app.use(express.static('public')); // server static file, looks for index.html

app.get('/api/v1/projects', (request, response) => { // 
  database('projects').select() // select projects table
    .then((projects) => {
      response.status(200).json(projects) // if projects is selected, send a status code of 200 and the projects data as json
    })
    .catch((error) => {
      response.status(500).json({ error }) // if there was an error selecting projects table, send a status code of 500 and the error as json
    });
});

app.get('/api/v1/palettes/:project_id', (request, response) => {
  const { project_id } = request.params; // deconstruct project id from request parameters

  database('palettes').where('project_id', project_id).select() // select rows with matching project id in palettes table
    .then(palettes => {
      if (palettes.length) {
        response.status(200).json(palettes); // if palettes are selected, send a status code of 200 and the palettes data as json
      } else {
        response.status(404).json({ 
          error: `Could not find palettes for a project with id ${project_id}` // if there are no palettes matching the project id, send a status code of 404 and a specific error as json
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error }); // if there was an error selecting palettes table, send a status code of 500 and the error as json
    });
});

app.get('/api/v1/palette/:palette_id', (request, response) => {
  const { palette_id } = request.params; // deconstruct palette id from request parameters

  database('palettes').where('id', palette_id).select() // select row where palette id matches the id in the palettes table
    .then(palette => {
      if (palette.length) {
        response.status(200).json(palette[0]) // if palette is selected, send a status code of 200 and the palette data as json
      } else {
        response.status(404).json({ 
          error: `Could not find a palette with id ${palette_id}` // if there is no matching palette, send a status code of 404 and a specific error as json
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });  // if there was an error selecting palettes table, send a status code of 500 and the error as json
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body; // set project equal to the request body

  for (let requiredParameter of ['name']) { // set requiredParameter to array to loop over 
    if (!project[requiredParameter]) { // if there is not a key of one of the items in requriedParameter on the request body, send a status of 422 with a specific error as json
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('projects').insert(project, 'id') // insert new row with project data in projects table
    .then(project => {
      response.status(201).json({ id: project[0] }) // if project is sucessfully inserted, send a status code of 201 and the project id as json
    })
    .catch(error => {
      response.status(500).json({ error }); // if project is not inserted, send a status code of 500 and an error as json
    });
});

app.post('/api/v1/projects/:project_id/palettes', (request, response) => {
  const { project_id } = request.params; // deconstruct project id from request parameters
  const palette = {...request.body, project_id}; // create object with request body and project id

  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) { // set requiredParameter to array to loop over
    if (!palette[requiredParameter]) { // if there is not a key of one of the items in requriedParameter on the request body, send a status of 422 with a specific error as json
      return response
      .status(422)
      .send({ error: `Expected format: { name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('projects').where('id', project_id).select() // select row with matching id from projects table
    .then(project => {
      if (project.length) { 
        database('palettes').insert(palette, 'id') // insert new row in palettes table
          .then(palette => {
            return response.status(201).json({ id: palette[0] })  // if palette is sucessfully inserted, send a status code of 201 and the project id as json
          })
          .catch(error => {
            return response.status(500).json({ error }) // if palette is not inserted, send a status code of 500 and an error as json
          });
      } else {
        return response.status(404).json({ // if no project is returned then there is no row with matching id, send a status code of 404 and a specific error as json
          error: `Could not find project with id ${project_id}`
        });
      }
    })
    .catch(error => {
      return response.status(500).json({ error }); // if there is an error selecting projects table, send a status code of 500 and an error as json
    });
});

app.delete('/api/v1/palettes/:palette_id', (request, response) => {
  const { palette_id } = request.params; // deconstruct palette id from request parameters

  database('palettes').where('id', palette_id).del() // delete row with matching id from palettes table
    .then( () => {
      response.status(204) // if row is deleted sucessfully, send a status code of 204
    })
    .catch(error => {
      return response.status(500).json({ error }) // if there is an error selecting palettes table, send a status code of 500 and an error as json
    })
});

app.listen(app.get('port'), () => { // app listens on port (which is set on line 8) for connections and returns an http.Server object
  console.log(`App is running on ${app.get('port')}.`);
});
