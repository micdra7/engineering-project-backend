export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    validFor: process.env.JWT_VALID_PERIOD,
    refreshValidFor: process.env.JWT_REFRESH_VALID_PERIOD,
  },
  saltOrRounds: parseInt(process.env.SALT_OR_ROUNDS, 10) || 10,
});
