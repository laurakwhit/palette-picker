const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json())
app.use(express.static('public'));

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      response.status(200).json(projects);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes/:project_id', (request, response) => {
  const { project_id } = request.params;

  database('palettes').where('project_id', project_id).select()
    .then(palettes => {
      if (palettes.length) {
        response.status(200).json(palettes);
      } else {
        response.status(404).json({ 
          error: `Could not find palettes for a project with id ${project_id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/palette/:palette_id', (request, response) => {
  const { palette_id } = request.params;

  database('palettes').where('id', palette_id).select()
    .then(palettes => {
      if (palettes.length) {
        response.status(200).json(palettes);
      } else {
        response.status(404).json({ 
          error: `Could not find a palette with id ${palette_id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/projects/:project_id/palettes', (request, response) => {
  const { project_id } = request.params;
  const palette = {...request.body, project_id};

  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if (!palette[requiredParameter]) {
      return response
      .status(422)
      .send({ error: `Expected format: { name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('projects').where('id', project_id).select()
    .then(project => {
      if (project.length) {
        database('palettes').insert(palette, 'id')
          .then(palette => {
            return response.status(201).json({ id: palette[0] })
          })
          .catch(error => {
            return response.status(500).json({ error });
          });
      } else {
        return response.status(404).json({ 
          error: `Could not find project with id ${project_id}`
        });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.delete('/api/v1/palettes/:palette_id', (request, response) => {
  const { palette_id } = request.params;

  database('palettes').where('id', palette_id).del()
    .then( () => {
      response.status(204)
    })
    .catch(error => {
      return response.status(500).json({ error })
    })
});

app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}.`);
});
