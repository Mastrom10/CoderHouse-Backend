let con = {
    host: 'localhost',
    user: 'root',
    password: 'cocacola',
    port: 3306
}

let options = {
    client: 'mysql',
    connection: con
}

let knex = require('knex')(options)



// Create database coderhouse;
knex.raw('CREATE DATABASE IF NOT EXISTS coderhouse').then(() => {
    console.log('Database coderhouse created')
    knex.destroy();
    con.database = 'coderhouse'
    knex = require('knex')({ client: 'mysql', connection: con })

    knex.raw(`create table productos (
        id int not null,
        title varchar(64),
        price float,
        thumbnail varchar(200),
        primary key(id)
       );`).then(() => {
        console.log('Tabla productos creada')

        let productos = [
            {
                id: 1,
                title: 'Pizza',
                price: 100,
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/pizza-fast-food-bake-bread-128.png'
            },
            {
                id: 2,
                title: 'Patitas de pollo',
                price: 200,
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/fried-chicken-thigh-fast-food-128.png'
            },
            {
                id: 3,
                title: 'Mazorca',
                price: 50,
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/grilled-corn-vegetable-organic-plant-128.png'
            },
            {
                id: 4,
                title: 'Burger',
                price: 150,
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/hamburger-fast-food-patty-bread-128.png'
            },
            {
                id: 5,
                title: 'Papas Fritas',
                price: 40,
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/french-fries-snacks-fast-food-128.png'
            },
            {
                id: 6,
                title: 'Manzanas',
                price: 5,
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/street-food-and-food-trucker-1/64/fruit-organic-plant-orange-vitamin-128.png'
            }
        ]

        knex('productos').insert(productos).then(() => {
            console.log('Productos insertados')
            process.exit()
        }
        )

    }
    )
})
    .catch((err) => {
        console.log(err)
        process.exit()
    }
)


