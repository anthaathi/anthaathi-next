<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/anthaathi/anthaathi">
    <img src="https://anthaathi.org/logo.png" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">Anthaathi</h3>
  <p align="center">
    Monorepo for projects of Anthaathi.
  </p>
</div>

[![Open in Coder](https://coder.anthaathi.internal/open-in-coder.svg)](https://coder.anthaathi.internal/templates/kubernetes/workspace?mode=auto&param.cpu=4&param.memory=8&param.git_repo=git%40gitlab.anthaathi.internal%3Aanthaathi%2Fanthaathi-next.git)

### Pre-requisites

- [Node.js](https://nodejs.org/en/) (lts)
- [Yarn](https://yarnpkg.com/) (3.x.x)
- [Docker](https://www.docker.com/) (latest)
- [Caddy](https://caddyserver.com/docs/install)

### Installation

```shell
# Install caddy for your OS
# Install Kratos

# Run required docker compose for postgres and kratos service
docker compose -f ./manifests/anthaathi-dev/compose.yml up -d

export DATABASE_URL=postgres://postgres:pgpassword@localhost:1143

# Run this command in new tab
yarn
yarn workspace @anthaathi/graphql-gateway db:migrate
yarn workspace @anthaathi/graphql-gateway seed
yarn dev
```

Fix in container
```
sudo bash -c "sudo echo \"127.0.0.1 auth.anthaathi.localhost\" >> /etc/hosts"
```
