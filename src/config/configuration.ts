export default () => ({
    port: 3000,
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT ?? '3306', 10),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'mysql',
        name: process.env.DB_NAME || 'nestjs',
        sync: process.env.DB_SYNC === 'true',
    },
});
