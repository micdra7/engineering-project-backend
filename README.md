This is a backend repository for my engineering project. This app support features such as:

- videocalls,
- chat,
- task management (similar to e.g. Trello),
- simple games during videocalls (so far quizzes),
- profile edit,
- users management (for admins),
- games and game data management (for admins).

# Available environment variables

- PORT - port this app will be running on,
- DB_HOST - host address of database,
- DB_PORT - database port,
- DB_NAME - database name,
- DB_USER - database user,
- DB_PASSWORD - database user password,
- DB_NAME_TEST - test database name (used for e2e testing),
- SALT_OR_ROUNDS - rounds for bcrypt hashing,
- JWT_SECRET - secret to prepare JWT token,
- JWT_VALID_PERIOD - valid period of access tokens,
- JWT_REFRESH_VALID_PERIOD - valid period of refresh tokens.

## Sample .env file

```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=database
DB_USER=user
DB_PASSWORD=password
DB_NAME_TEST=test_database
SALT_OR_ROUNDS=10
JWT_SECRET=lorem_ipsum_dolor_sit_amet
JWT_VALID_PERIOD=4h
JWT_REFRESH_VALID_PERIOD=2d
```
