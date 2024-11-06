# 🏬 SuperSell Server

SuperSell is a marketplace inspired by eBay and Aliexpress where users can sell, buy, create their own store, add reviews to products, create wishlists and shopping carts. Supersell Server is a REST API created with Node.js, Nest.js, Drizzle, MySQL, Kafka and Docker.

- [Table of Content](#table-of-content)
- [Non-Functional Requirements](#non-func-features)
- [Functional Requirements](#func-features)
- [How To Run](#how-to-run)
  - [Requirements](#requirements)
  - [Running SuperSell Server](#rodando-o-matricula-instituicao)
- [Tests](#tests)

### Non-Functional Requirements

- [ ] SuperSell Server should be developed using the following technologies: Node.js, Nest.js, TypeScript, MySQL, Drizzle and Docker.
- [ ] Supersell External Services should be a microservice responsible for dealing with emailing, payment and delivery logistics.
- [ ] Supersell Server should comunicate with Supersell External Services via Event Driven Architecture pattern.
- [ ] Supersell Server should use Kafka localy as message broker.
- [ ] REST API should use prefix: '/api/v1/'
- [ ] Should feature a seeder for data.
- [ ] Docker container for the database.
- [ ] Docker container for the application.
- [ ] Docker container for Kafka locally.
- [ ] Create Github documentation.
- [ ] Create Swagger REST API documentation.
- [ ] Implement security configuration: SQL Injection, XSS Protection, Security Headers, Rate limiting, HPP & CORS etc.
- [ ] Should include unit and integration tests.
- [ ] Implement server configuration: Nginx, SSL, Domain, PM2 etc.
- [ ] Create basic CI/CD and Github Actions pipeline.
- [ ] Server should be deployed in production to Amazon AWS EC2 and later to AWS ECS.
- [ ] Database should be deployed in production to AWS RDS.
- [ ] Server should use in production AWS S3 to store static files such as images and etc.
- [ ] Server should use in production AWS SQS as a message broker.
- [ ] Server should use in production AWS SES as an emailing service.
- [ ] Database trigger to calculate product and user rating.
- [ ] Should feature a log system.
- [ ] Should use REDIS as a cache system.\*

### Functional Requirements

[Requirements documentation](docs/requirements.md)

### Requirements

Before you start, you should have installed in your machine the following tools:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/) and [Docker](https://www.docker.com/). Preferably Node.js version >= v18.
To edit the code you can use a code editor like [VSCode](https://code.visualstudio.com/).

### 🔥 Running SuperSell Server

- Clone this repository

```bash
git clone git@github.com:augustojs1/supersell_server_v2.git
```

- Cd into the project directory

```bash
cd supersell_server_v2
```

- Create a new .env file

```bash
touch .env
```

- Fill in the keys in .env with values

```bash
# Database
# Dev
DATABASE_URL=
```

- Create new development.env environment variable file inside the configuration folder

```bash
touch infra/config/env/development.env
```

- Fill in the keys in development.env with values

```bash
# Port
PORT=

# Database
DATABASE_URL=

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=
```

- Install the project dependencies

```bash
npm install
```

- Start the Docker container

```bash
docker-compose up -d
```

- Push the tables to database

- Run the project

```bash
npm run start:dev
```

- Project runs locally on: http://localhost:PORT

### 👨‍🔬 Tests

- Run the application tests

```bash
npm run test
```
