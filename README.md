<h1 align="center">
  <a href="https://hygeia-js.herokuapp.com"><img src="https://hygeia-js.herokuapp.com/img/hygeia-logo.svg" alt="Hygeia"></a>
  <p align="center">Hygeia JS</p>
</h1>

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/dani8art/hyegia-js/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/hygeia-js.svg?style=flat)](https://www.npmjs.com/package/hygeia-js) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

Hygeia is a modular health checking tool, It is writen in JavaScript and designed and thougth for deploying in many differents scenarios such as: [AWS Lambda](), [Express Middleware](), [Hapi Plugin]() or [Moleculer Service]().

* **Modular:** Hygeia was designed to be as configurable as it was possible, its modular design makes it different and it allows you to use several tools for checking the status of services.
* **Deployment agnostic:** It can be used in many differents scenarios, JavaScript allows you to use it on a background process wrote and launch in Node JS, as an endpoint of a RESTful API or as an AWS Lambda function.

[Learn how to use Hygeia JS in your own project](https://hygeia-js.herokuapp.com/docs/gs-installation.html).

## Documentation

You can find the Hygeia documentation [on the website](https://hygeia-js.herokuapp.com).  
It is divided into several sections:

* [Quick Start](https://hygeia-js.herokuapp.com/docs/gs-checking-status.html)
* [Advanced Guides](https://hygeia-js.herokuapp.com/docs/health-checking-lambda-aws.html)
* [API Reference](https://hygeia-js.herokuapp.com/docs/api-checker.html)
* [Tutorial](https://hygeia-js.herokuapp.com/docs/health-checking-lambda-aws.html)
* [Where to Get Support](https://hygeia-js.herokuapp.com/docs/where-to-get-support.html)
* [Contributing Guide]()

You can improve it by sending pull requests to [this repository]().

## Examples

We have several examples [on the website](https://hygeia-js.herokuapp.com/docs/gs-checking-status.html). Here is the first one to get you started:

```jsx
const checker = new Checker({
  store: {
    data: [
      {
        name: 'google',
        health: 'https://www.google.es',
        method: 'GET',
      },
      {
        name: 'error',
        health: 'http://www.google.com:81',
        method: 'GET',
      },
    ]
});

checker.check()
    .then(() => console.log('Status checked for all the services.'))
    .then((err => console.log(err)));
```

## Installation

Hygeia is available as the `hygeia-js` package on [npm](https://www.npmjs.com/package/hygeia-js). 

### NPM

```shell
npm i hygeia-js --save
```
### YARN

```shell
yarn add hygeia-js
```

## Contributing

The main purpose of this repository is to continue to evolve Hygeia core, making it faster and easier to use. Development of Hygeia happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving Hygeia.

### [Code of Conduct](https://code.fb.com/codeofconduct/)

We has adopted a Code of Conduct from Facebook Open Source that we expect project participants to adhere to. Please read [the full text](https://code.fb.com/codeofconduct/) so that you can understand what actions will and will not be tolerated.

### [Contributing Guide]()

> TODO

`<<search for contributing guide>>`

### Good First Issues

To help you get your feet wet and get you familiar with our contribution process, we have a list of [good first issues](https://github.com/facebook/react/labels/good%20first%20issue) that contain bugs which have a relatively limited scope. This is a great place to get started.

### License

Hygeia is [MIT licensed](./LICENSE).
