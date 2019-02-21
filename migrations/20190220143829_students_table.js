// What changes are to be applied to db?
exports.up = function(knex, Promise) {
  return knex.schema.createTable('students', tbl => {
    tbl.increments();

    tbl.string('name', 128).notNullable();
    tbl
      .integer('cohort_id')
      .unsigned()
      .references('id')
      .inTable('cohorts')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    tbl.timestamps(true, true);
  });
};

// How can I undo the changes made to structure of db?
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('students');
};
