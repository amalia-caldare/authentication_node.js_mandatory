
exports.seed = function(knex) {
      return knex('users').insert([
        {username: 'amalia', email: 'amaliacaldare20@gmail.com', password: '$2b$12$be6phplKjcm8XFbxVLBCVeaTM28QCzwgF8.OwLwMgJQWF2U4KNO/C'},
        {username: 'emilia', email: 'emilia@gmail.com', password: '$2b$12$be6phplKjcm8XFbxVLBCVeaTM28QCzwgF8.OwLwMgJQWF2U4KNO/C'}
      ]);
};
