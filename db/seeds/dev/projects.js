
exports.seed = function(knex, Promise) {
  return knex('palettes').del() 
    .then(() => knex('projects').del()) 

    .then(() => {
      return Promise.all([
        knex('projects').insert({
          name: 'EXAMPLE PROJECT'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            { name: 'Example Palette', color1: '#668586', color2: '#82AEB1', color3: '#93C6D6', color4: '#A7ACD9', color5: '#9E8FB2', project_id: project[0] }
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) 
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};