---
id: gs-checking-status
title: Checking Status
---

Hygeia JS can check services with a few line of code and it is so easy to be configure.

## Setup configuration

We recomend to create a new file called `.hygeia.cfg.js` but you can keep it on your `index.js`. This object will configure both the store and the reporters. 

> Please see [Reporters]() and [Stores]() sections. 

```javascript
const hygeiaConfig = {
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
    },
    reporter: {
        email: 'admin@darteaga.com',
        policy: 'always',
    },
};
```

## Create a checker

```javascript
const store = new MemoryStore(hygeiaConfig.store);
const reporter = new MemoryStore(hygeiaConfig.reporter);

const checker = new Checker({store, reporter});

checker.check()
    .then(() => console.log('Status checked for all the services.'))
    .then((err => console.log(err)));
```

## Run checker

```sh
node index
```
