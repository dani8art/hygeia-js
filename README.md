<h1 align="center">
  <a href="https://hygeia.darteaga.com"><img src="https://hygeia.darteaga.com/img/hygeia-logo.png" alt="Hygeia"></a>
  <p align="center">Hygeia JS</p>
</h1>

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/dani8art/hyegia-js/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/hygeia-js.svg?style=flat)](https://www.npmjs.com/package/hygeia-js) [![CircleCI](https://circleci.com/gh/dani8art/hygeia-js.svg?style=svg&circle-token=8069e6f68b6fe5b7f2034ec0efa9e7429697c129)](https://circleci.com/gh/dani8art/hygeia-js) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]() [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest) [![jest](https://facebook.github.io/jest/img/jest-badge.svg)](https://github.com/facebook/jest) 


Hygeia is a modular health checking tool, It is written in Javascript and designed and thought for deploying in many different scenarios such as [AWS Lambda](https://github.com/dani8art/hygeia-lambda-healthcheck), [Express Middleware](), [Hapi Plugin]() or [Moleculer Service]().

* **Modular:** Hygeia was designed to be as configurable as it was possible, its modular design makes it different and it allows you to use several tools for checking the status of services.
* **Deployment agnostic:** It can be used in many different environments, Javascript allows you to use it on a background process in Node.js, as an endpoint of in a RESTful API or as an AWS Lambda function.

[Learn how to use Hygeia JS in your projects](https://hygeia.darteaga.com/docs/gs-installation.html).

## Documentation

You can find the Hygeia documentation [on the website](https://hygeia.darteaga.com).  
It is divided into several sections:

* [Quick Start](https://hygeia.darteaga.com/docs/gs-checking-status.html)
* [Advanced Guides](https://hygeia.darteaga.com/docs/health-checking-lambda-aws.html)
* [API Reference](https://hygeia.darteaga.com/docs/api-checker.js.html)
* [Tutorial](https://hygeia.darteaga.com/docs/health-checking-lambda-aws.html)
* [Where to Get Support](https://hygeia.darteaga.com/docs/where-to-get-support.html)
* [Contributing Guide]()

You can improve it by sending pull requests to [this repository]().

## Examples

We have several examples [on the website](https://hygeia.darteaga.com/docs/gs-checking-status.html). Here is the first one to get you started:

```jsx
const store = new MemoryStore({
  data: [{ name: 'google', health: 'https://www.google.es', method: 'GET' }]
});
const reporters = [new EmailReporter({email: 'example@example.com', policy: 'always'})];

const checker = new Checker({store, reporters});

checker.check()
    .then(() => console.log('Status checked for all the services.'))
    .then((err => console.log(err)));
```

## Installation

Hygeia is available as a npm package: `hygeia-js` on [npm](https://www.npmjs.com/package/hygeia-js). 

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

We have adopted a Code of Conduct from Facebook Open Source that we expect project participants to adhere to. Please read [the full text](https://code.fb.com/codeofconduct/) so that you can understand what actions will and will not be tolerated.

### [Contributing Guide]()

> TODO

`<<search for contributing guide>>`

### Good First Issues

To help you get your feet wet and get you familiar with our contribution process, we have a list of [good first issues](https://github.com/facebook/react/labels/good%20first%20issue) that contain bugs which have a relatively limited scope. This is a great place to get started.

### License

Hygeia is [MIT licensed](./LICENSE).

