const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

//********************************** ENDPOINTS ****************************/

// **************** RETURN ALL COHORTS **************//
server.get('/api/cohorts', async (req, res) => {
  try {
    const cohorts = await db('cohorts');
    res.status(200).json(cohorts);
  } catch (error) {
    res.status(500).json(error);
  }
});

// **************** RETURN SPECIFIC COHORT **************//
server.get('/api/cohorts/:id', async (req, res) => {
  try {
    const cohorts = await db('cohorts')
      .where({ id: req.params.id })
      .first();
    res.status(200).json(cohorts);
  } catch (error) {
    res.status(500).json(error);
  }
});

// **************** ADD NEW COHORT **************//
const errors = {
  '19': 'A unique name is REQUIRED, No duplicate name allowed.',
};
server.post('/api/cohorts', async (req, res) => {
  try {
    const [id] = await db('cohorts').insert(req.body);
    const cohort = await db('cohorts')
      .where({ id })
      .first();

    res.status(201).json({ message: 'Sucessfully added.', cohort });
  } catch (error) {
    const message = errors[error.errno] || 'Constraint Violation!';
    res.status(500).json({ message });
  }
});

// **************** UPDATE COHORT **************//
server.put('/api/cohorts/:id', async (req, res) => {
  try {
    const count = await db('cohorts')
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const cohort = await db('cohorts')
        .where({ id: req.params.id })
        .first();
      res.status(201).json({ message: 'Sucessfully Updated.', cohort });
    } else {
      res.status(404).json({
        message: `Cohort with the specified id: ${req.params.id} not found.`,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// **************** RETURN STUDENTS OF SPECIFIC COHORT **************//
server.get('/api/cohorts/:id/students', async (req, res) => {
  try {
    const students = await db('students').where({ cohort_id: req.params.id });

    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json(error);
  }
});

// **************** DELETE COHORT **************//
server.delete('/api/cohorts/:id', async (req, res) => {
  try {
    const count = await db('cohorts')
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(204).json({ message: 'Sucessfully Deleted.' });
    } else {
      res.status(404).json({
        message: `Cohort with the specified id: ${req.params.id} not found.`,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const port = 4400;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
