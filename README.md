## [NuxtJS][1] SPA web client for DNS3L

`docker pull ghcr.io/dns3l/web`

[1]: https://nuxtjs.org/

### Configuration

| variable | note | default |
| --- | --- | --- |
| ENVIRONMENT | `production` or other deployments | |
| BASE_URL | base URL of the web client | `http://localhost:3000` |
| API_URL | `dns3ld` API endpoint | `${BASE_URL}/api` |
| MOCK_URL | API mocking endpoint for development | `${BASE_URL}/mock` |
| AUTH_URL | (DNS3L) OIDC provider endpoint | `${BASE_URL}/auth/.well-known/openid-configuration` |
| CLIENT_ID | OIDC client ID | `dns3l-app` |
| DAEMON_CLIENT_ID | `dns3ld` token validation (https://github.com/dns3l/dns3l-core/issues/59) | `dns3ld` |

Mount a custom Nuxt config to `/etc/nuxt.config.js` if environment based template seems not sufficient.

## Nuxt development

### Install node, npm, yarn

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install nodejs
sudo npm install -g npm@8.5.5
sudo npm install --global yarn
```

```bash
# install dependencies
$ yarn install

# devel server with hot reload
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

### Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

#### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

#### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

#### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).

#### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

#### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

#### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.
Example: `/static/robots.txt` is mapped as `/robots.txt`.
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

#### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).
