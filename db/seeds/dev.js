const fetch = require("node-fetch");
require('dotenv').config({path:__dirname+'/./../../.env'});

const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;
const shop = process.env.SHOP;

const products_url = "https://"+api_key+":"+api_secret+"@"+shop+"/admin/api/2021-04/products.json";
async function getProducts() {
  const response = await fetch(products_url);
  return response.json();
}

const variants_url = "https://"+api_key+":"+api_secret+"@"+shop+"/admin/api/2021-04/variants.json";
async function getVariants() {
  const response = await fetch(variants_url);
  return response.json();
}

exports.seed = async function (knex) {
  let productsData;
  try {
      productsData = await getProducts();
  } catch (err) {
      console.error(err);
  }

  let products = productsData.products.map(product => ({ 
    id: product.id,
    title: product.title,
    status: product.status
  }));

  let variantsData;
  try {
    variantsData = await getVariants();
  } catch (err) {
      console.error(err);
  }

  let variants = variantsData.variants.map(variant => ({ 
    id: variant.id,
    product_id: variant.product_id,
    title: variant.title,
    barcode: variant.barcode
  }));

  // truncate all existing tables
  await knex.raw('TRUNCATE TABLE "variant" CASCADE');
  await knex.raw('TRUNCATE TABLE "product" CASCADE');
  
  await knex('product').insert(products)

  await knex('variant').insert(variants)
};
