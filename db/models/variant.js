const {Model} = require('objection');

class Variant extends Model {
    static get tableName() {
        return 'variant';
    }

    static get relationMappings() {
        const Product = require('./product');
        return {
            product: {
                relation: Model.BelongsToOneRelation,
                modelClass: Product,
                join: {
                    from: 'variant.product_id',
                    to: 'product.id',
                }
            }
        }
    }
}

module.exports = Variant;