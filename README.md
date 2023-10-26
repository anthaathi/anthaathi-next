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

### Highlights

Form Builder
https://stackblitz.com/edit/stackblitz-starters-9be5dj?file=src%2FApp.tsx

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

## Screenshots
![image](https://github.com/anthaathi/anthaathi-next/assets/29942725/ac754672-a8a0-48fb-b281-388346e4001c)
![image](https://github.com/anthaathi/anthaathi-next/assets/29942725/582a2413-6589-475b-9878-c5bbaae9d89e)
![image](https://github.com/anthaathi/anthaathi-next/assets/29942725/7179ef72-5f40-465f-b4ad-a38a553ea789)
![image](https://github.com/anthaathi/anthaathi-next/assets/29942725/ee8df6af-9bbf-447b-a936-abd48fa813a1)
![image](https://github.com/anthaathi/anthaathi-next/assets/29942725/d43c4a3a-8506-4025-b962-09b02090ee8f)
![image](https://github.com/anthaathi/anthaathi-next/assets/29942725/0fdf1d1f-31e0-45c8-930f-d960cfffc0b1)
![image](https://github.com/anthaathi/anthaathi-next/assets/29942725/7a9b7fbf-d2a8-4ce2-ac39-49975fc81385)
![image](https://github.com/anthaathi/anthaathi-next/assets/29942725/4f1c88ec-d81a-482c-b682-c434aabc9630)
![image](https://github.com/anthaathi/anthaathi-next/assets/29942725/0ddff74c-f3a0-41a1-b09f-b282182750c0)

## Looking to Collaborate?

Hey there, we're a development studio based in Kolhapur. We're passionate about crafting solutions using React, Angular, NodeJS, Go, Quarkus, and Java. If you're excited about creating something impactful and think we'd be a good fit, I'd love to hear from you!

Reach out to me directly at [omkar@anthaathi.co](mailto:omkar@anthaathi.co). Let's make something amazing together!

## License

- This project is licensed under the GPL-3.0 license.
- All other logos and trademarks are the property of Anthaathi Private Limited.
