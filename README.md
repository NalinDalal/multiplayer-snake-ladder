# multiplayer-snake-ladder

start db via docker:

```sh
╰─❯ docker run --name snake-ladder-game \
          -e POSTGRES_USER=myuser \
          -e POSTGRES_PASSWORD=mypassword \
          -e POSTGRES_DB=mydb \
          -p 5432:5432 \
          -d postgres:15

97e86f8f0b0607656ba16092b06efe9028ba27359ea9b575b58e68f8ef1fdd2f

```

go to .env, put it like:

```
# Database credentials
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydb
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Full connection URL (many ORMs expect this)
DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}

```
