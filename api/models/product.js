const knex = require('../../db/knex');

class Product {
    constructor(name, description, price) {
        this.name = name;
        this.description = description;
        this.price = price
    }

    async Create() {
        return knex('products')
            .insert({
                name: this.name,
                description: this.description,
                price: this.price
            });
    }

    async Save() {
        return knex('products')
            .where('id', this.id)
            .update({
                name: this.name,
                description: this.description,
                price: this.price
            });
    }

    async LoadById(id) {
        const product = await knex('products').where('id', id);
        this.Load(product);
    }

    Load(product) {
        this.id = product[0].id;
        this.name = product[0].name;
        this.description = product[0].description;
        this.price = product[0].price;
    }

    static async Delete(id) {
        return knex('products').where('id', id).del();
    }

    static async GetProducts(){
        return knex('products');
    }

    static async GetProductById(id){
        return knex('products').where('id', id);
    }
}

module.exports = Product;