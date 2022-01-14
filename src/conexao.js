const knex = require("knex")({
    client: "pg",
    connection: {
        host: "localhost",
        user: "postgres",
        password: "93052929",
        database: "market_cubos",
        host: "ec2-67-202-36-228.compute-1.amazonaws.com",
        user: "ssrgfutmgzrcch",
        password: "15456765a867cf6c26c3a76d52478dd8e8c909300535d5831076c36c486d60da",
        database: "d1ahtrdg3sqj29",
        port: 5432,
        ssl: {
            rejectUnauthorized: false
        }
    },
});

module.exports = knex;




