# Books Database #

## Prerequisites
* Node.js >= 18.0.0
* Npm >= 9.0.0

## Setup ##

#### Server ####
```
cd server
npm install
npm run test
npm start
```

#### Client ####
```
cd client
npm install
npm test
npm start
```

## Docker ##

Build and run both frontend and backend:

```
docker compose up --build
```

App URLs:
- Client: http://localhost:3000
- Server: http://localhost:5001

Stop containers:

```
docker compose down
```

### Docker Dev Mode (Auto Reload)

Run both containers with file watching so code changes apply automatically:

```
npm run docker:dev:start
```

This enables:
- React auto-refresh in `client`
- Server auto-restart via `nodemon` in `server`

Stop dev mode:

```
npm run docker:dev:down
```
