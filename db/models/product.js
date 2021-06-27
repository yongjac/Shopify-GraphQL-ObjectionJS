const {Model} = require('objection');

class Product extends Model {
    static get tableName() {
        return 'product';
    }
}

module.exports = Product;