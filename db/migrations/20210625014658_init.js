
exports.up = function(knex) {
    return knex.schema.createTable('product', (table) => {
        table.bigint('id').notNullable().unique();
        table.string('title').notNullable();
        table.string('status');
        table.timestamps(true, true);
    }).createTable('variant', (table) => {
        table.bigint('id').notNullable();
        table.bigint('product_id')
            .notNullable()
            .references('id')
            .inTable('product');
        table.string('title').notNullable();
        table.string('barcode');
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex
        .schema
        .dropTableIfExists('variant')
        .dropTableIfExists('product');
};
