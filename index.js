const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

//********************************** COHORTS ENDPOINTS ****************************/

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
    const deleted = await db('cohorts')
      .where({ id: req.params.id })
      .del();

    if (deleted) {
      res
        .status(200)
        .json({ message: `Sucessfully Deleted id: ${req.params.id}.` });
    } else {
      res.status(404).json({
        message: `Cohort with the specified id: ${req.params.id} not found.`,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//********************************** STUDENTS ENDPOINTS ****************************/

// **************** RETURN ALL STUDENTS **************//
server.get('/api/students', async (req, res) => {
  try {
    const students = await db('students');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json(error);
  }
});

// **************** RETURN SPECIFIC STUDENT **************//
server.get('/api/students/:id', async (req, res) => {
  try {
    const student = await db('students')
      .join('cohorts', 'students.cohort_id', 'cohorts.id')
      .select('students.id', 'students.name', 'cohorts.name as cohort')
      .where('students.id', req.params.id);
    if (student.length) {
      res.status(200).json(student[0]);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// **************** ADD NEW STUDENT **************//
server.post('/api/students', async (req, res) => {
  if (!req.body.name || !req.body.cohort_id) {
    res
      .status(412)
      .json({ error: 'Name and Cohort_id are required parameters.' });
  }
  try {
    const { name, cohort_id } = req.body;
    const student = await db('students').insert({ name, cohort_id });

    res.status(201).json({ message: 'Sucessfully added.', student });
  } catch (error) {
    const message = errors[error.errno] || 'Constraint Violation!';
    res.status(500).json({ message });
  }
});

// **************** UPDATE STUDENT **************//
server.put('/api/students/:id', async (req, res) => {
  if (!req.body.name || !req.body.cohort_id) {
    res
      .status(412)
      .json({ error: 'Please Update both name and cohort_id fields.' });
  }
  try {
    const count = await db('students')
      .where({ id: req.params.id })
      .update(req.body);

    if (count) {
      const student = await db('students')
        .where({ id: req.params.id })
        .first();
      res.status(201).json({ message: 'Sucessfully Updated.', student });
    } else {
      res.status(404).json({
        message: `Student with the specified id: ${req.params.id} not found.`,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// **************** DELETE STUDENT **************//
server.delete('/api/students/:id', async (req, res) => {
  try {
    const deleted = await db('students')
      .where({ id: req.params.id })
      .del();

    if (deleted) {
      res
        .status(200)
        .json({ message: `Sucessfully Deleted id: ${req.params.id}.` });
    } else {
      res.status(404).json({
        message: `Student with the specified id: ${req.params.id} not found.`,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//****************** SERVER ********************/
const port = 4400;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
