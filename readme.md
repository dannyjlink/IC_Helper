# Vue, Electron

## Purpose
I made this app originally to help my mom, who was an instructional coach in public schools. She needed the ability to feed test score spreadsheets in and get a 'postcard' of each student that has all their test scores at a glance, instead of needing to comb through multiple spreadsheets with hundreds of rows to get one students test results. I made this feature work, but upon building, we realized we couldn't install the application on systems managed by the IT department. 
It was a great exercise in front-end development and design that I did during an internship where I was also using Vue and Electron. 

### Project setup

This step must be run in an environment that supports `sed`, e.g. Bash.

```
yarn install
```

### Development: start app and hot-reload (with DevTools)

```
yarn electron:serve
```

### Development: start app and hot-reload (without DevTools)

```
yarn electron:demo
```

### Production: package app and create installer

```
yarn electron:build
```

### Lints and fixes files

```
yarn lint
```

### Visual Studio Code

Visual Studio Code is recommended for development.

Tips:

- Format current file: `Shift`+`Alt`+`F`
- Format file on save: File > Preferences > Settings > Text Editor > Formatting > Format On Save

Recommended Extensions:

- [Veuter](https://marketplace.visualstudio.com/items?itemName=octref.vetur): Vue tooling. Includes formatter for Vue files.
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): Capable of formatting many file types, used here for GraphQL files. This introduces a choice between multiple formatters for many file types. We use it only when no other formatter exists. Vue files are handled by Vueter, JavaScript files are handled by default VSCode JS support.

## Structure

| Path               |               | Description                                       |
| ------------------ | ------------- | ------------------------------------------------- |
| public/            |               | Files directly hosted                             |
|                    | favicon.ico   | Favicon (no effect in Electron)                   |
|                    | global.css    | Global CSS                                        |
|                    | index.html    | Index HTML that Vue components are loaded into    |
| src/               |               | Files packaged by webpack                         |
|                    | assets/       | Assets (e.g. images) referenced by components     |
|                    | components/   | General Vue components used within pages          |
|                    | mixins/       | Vue mixins used by components                     |
|                    | pages/        | Top-level components which function as pages      |
|                    | App.vue       | Root component                                    |
|                    | background.js | Main file for Electron main process               |
|                    | main.js       | Main file for Electron renderer process           |
|                    | vue-router.js | Vue Router config                                 |
| .gitignore         |               | .gitignore                                        |
| babel.config.js    |               | Babel config                                      |
| package.json       |               | Project definition (e.g. scripts, dependencies)   |
| readme.md          |               | Thanks for reading!                               |
| babel.config.js    |               | Vue config                                        |
