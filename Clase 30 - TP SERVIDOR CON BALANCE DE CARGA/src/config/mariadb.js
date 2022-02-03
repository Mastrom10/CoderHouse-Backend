const options = {
    client: 'mysql',
    connection: process.env.MARIADB_URL
}

module.exports = { options }