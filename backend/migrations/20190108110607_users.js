exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function(table) {
    table.increments();
    table
      .string("email")
      .notNullable()
      .unique("email");
    table
      .string("firstname")
      .notNullable();
    table
      .string("lastname")
      .notNullable();
    table
      .string("image");
    table
      .string("title");
    table
      .string("filter");
    table
      .string("location");
    table
      .string("github");
    table
      .string("linkedin");
    table
      .string("portfolio");
    table
      .string("badge");
    table
      .string("summary");
    table
      .string("access_token");
    table
      .string("places");
    table
      .string("topskills");
    table
      .string("addskills");
    table
      .string("familiar");
    table
      .string("places");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
