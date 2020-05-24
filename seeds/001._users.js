const bcrypt = require('bcrypt');
const saltRounds = 12;
exports.seed = function(knex) {

      return knex('users').insert([
        {username: 'amalia', email: 'amaliacaldare20@gmail.com', password: bcrypt.hashSync('12345678900', saltRounds)},
        {username: 'emilia', email: 'emilia@gmail.com', password: bcrypt.hashSync('mypassword', saltRounds)}
      ]);
};
