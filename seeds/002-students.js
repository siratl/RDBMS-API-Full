exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students')
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex('students').insert([
        { name: 'Sam', cohort_id: 1 },
        { name: 'Tim', cohort_id: 1 },
        { name: 'Justin', cohort_id: 1 },
        { name: 'Nick', cohort_id: 2 },
        { name: 'Anna', cohort_id: 2 },
        { name: 'Joe', cohort_id: 2 },
        { name: 'Hick', cohort_id: 3 },
        { name: 'Harry', cohort_id: 3 },
        { name: 'Harmoine', cohort_id: 4 },
      ]);
    });
};
