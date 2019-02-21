exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('cohorts')
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex('cohorts').insert([
        { name: 'Web14' },
        { name: 'Web15' },
        { name: 'Web16' },
      ]);
    });
};
