export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  database: {
    url: process.env.DB_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});
