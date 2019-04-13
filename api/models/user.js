const knex = require('../../db/knex');

class User {
    constructor(first_name, last_name, email, password, address, role) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email
        this.password = password;
        this.address = address;
        this.role = role;
    }

    async Create() {
        return knex('users')
            .insert({
                first_name: this.first_name,
                last_name: this.last_name,
                email: this.email,
                password: this.password,
                address: this.address,
                role: this.role
            });
    }

    async Save() {
        return knex('users')
            .where('id', this.id)
            .update({
                first_name: this.first_name,
                last_name: this.last_name,
                email: this.email,
                password: this.password,
                address: this.address,
                role: this.role
            });
    }

    async LoadByEmail(email) {
        const user = await knex('users').where('email', email);
        this.Load(user);
    }

    async LoadById(id) {
        const user = await knex('users').where('id', id);
        this.Load(user);
    }

    Load(user) {
        this.id = user[0].id;
        this.first_name = user[0].first_name;
        this.last_name = user[0].last_name;
        this.email = user[0].email;
        this.password = user[0].password;
        this.address = user[0].address;
        this.role = user[0].role;
    }

    static findByEmail(email) {
        return knex('users').where('email', email);
    }

}

module.exports = User;