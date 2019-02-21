// What changes are to be applied to db?
exports.up = function(knex, Promise) {
  return knex.schema.createTable('cohorts', tbl => {
    tbl.increments();

    tbl.string('name', 128).notNullable();
    tbl.timestamps(true, true);
  });
};

// How can I undo the changes made to structure of db?
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('cohorts');
};
