const dbSetup = require('./db/db-setup');
const express = require('express');
const app = express();
const Product = require('./db/models/product');
const Variant = require('./db/models/variant');
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLID
} = require('graphql');

dbSetup();

async function main() {
    const products = await Product.query();
    const variants = await Variant.query();

    const ProductType = new GraphQLObjectType({
        name: 'Product',
        description: 'This represents a product',
        fields: () => ({
            id: { type: GraphQLNonNull(GraphQLID) },
            title: { type: GraphQLNonNull(GraphQLString) },
            status: { type: GraphQLString },
            variants: {
                type: new GraphQLList(VariantType),
                resolve: (product) => {
                    return variants.filter(variant => variant.product_id === product.id)
                }
            }
        })
    })

    const VariantType = new GraphQLObjectType({
        name: 'Variant',
        description: 'This represents a variant of a product',
        fields: () => ({
            id: { type: GraphQLNonNull(GraphQLID) },
            product_id: { type: GraphQLNonNull(GraphQLID) },
            title: { type: GraphQLNonNull(GraphQLString) },
            barcode: { type: GraphQLString },
            product: {
                type: VariantType,
                resolve: (variant) => {
                    return products.find(product => product.id === variant.product_id)
                }
            }
        })
    })

    const RootQueryType = new GraphQLObjectType({
        name: 'Query',
        description: 'Root Query',
        fields: () => ({
            product: {
                type: ProductType,
                description: 'A Single Product',
                args: {
                    id: { type: GraphQLID }
                },
                resolve: async (parent, args) => products.find(product => product.id === args.id)
            },
            products: {
                type: new GraphQLList(ProductType),
                description: 'List of All Products',
                resolve: () => products
            },
            variant: {
                type: VariantType,
                description: 'A Single Product Variant',
                args: {
                    id: { type: GraphQLID }
                },
                resolve: (parent, args) => variants.find(variant => variant.id === args.id)
            },
            variants: {
                type: new GraphQLList(VariantType),
                description: 'List of All Product Variants',
                resolve: () => variants
            }
        })
    })

    const RootMutationType = new GraphQLObjectType({
        name: 'Mutation',
        description: 'Root Mutation',
        fields: () => ({
            addProduct: {
                type: ProductType,
                description: 'Add a product',
                args: {
                    title: { type: GraphQLNonNull(GraphQLString) },
                    status: { type: GraphQLString }
                },
                resolve: (parent, args) => {
                    const product = { id: products.length + 1, title: args.title, status: args.status }
                    products.push(product);
                    return product
                }
            },
            addVariant: {
                type: VariantType,
                description: 'Add a variant',
                args: {
                    product_id: { type: GraphQLNonNull(GraphQLID) },
                    title: { type: GraphQLNonNull(GraphQLString) },
                    barcode: { type: GraphQLString }
                },
                resolve: (parent, args) => {
                    const variant = {
                        id: variants.length + 1, 
                        product_id: args.product_id,
                        title: args.title,
                        barcode: args.barcode
                    }
                    variants.push(variant);
                    return variant;
                }
            }
        })
    })

    const schema = new GraphQLSchema({
        query: RootQueryType,
        mutation: RootMutationType
    })

    app.use('/graphql', graphqlHTTP({
        schema: schema,
        graphiql: true
    }))

    app.listen(8080, () => console.log('server running on port 8080'));
}

main();