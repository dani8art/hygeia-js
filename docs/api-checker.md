---
id: api-checker.js
title: Checker
sidebar_label: Checker
---

  **Kind**: global class  

* [Checker](#Checker)
    * [new Checker()](#new_Checker_new)
    * _instance_
        * [.useStore(store)](#Checker+useStore) ⇒ <code>this</code>
        * [.check()](#Checker+check) ⇒ <code>Promise.&lt;HealthReport&gt;</code>
    * _static_
        * [.request(service)](#Checker.request) ⇒ <code>Promise.&lt;Measure&gt;</code>

<a name="new_Checker_new"></a>

### new Checker()
Creates an instance of Checker.


| Param | Type | Description |
| --- | --- | --- |
| options.store | <code>Store</code> | Store where services will be gotten. |
| options.reporters | <code>Array.&lt;Reporter&gt;</code> | Reporters where HealtReport will be sent. |

**Example**  
```js
const { Checker } = require('hygeia-js');
const { MemoryStore } = require('hygeia-js/stores/store-memory');
const { EmailReporter } = require('hygeia-js/reporters/reporter-email');

const myChecker = new Checker({ 
     store: new MemoryStore(data),   
     reporters: [ new EmailReporter(options) ] 
});

myChecker.check().then(done).catch(errorHandler);
```
<a name="Checker+useStore"></a>

### checker.useStore(store) ⇒ <code>this</code>
Set the store of the checker

**Kind**: instance method of [<code>Checker</code>](#Checker)  

| Param | Type | Description |
| --- | --- | --- |
| store | <code>Store</code> | Store where services will be gotten. |

**Example**  
```js
myChecker.useStore(new FileStore('./path/to/file'))
``` 
<a name="Checker+check"></a>

### checker.check() ⇒ <code>Promise.&lt;HealthReport&gt;</code>
It will check the status of every services in the `Store`, generating
a `HealthReport`

**Kind**: instance method of [<code>Checker</code>](#Checker)  
**Example**  
```js
myChecker.check().then(healthReport => console.log(healthReport));
``` 
<a name="Checker.request"></a>

### Checker.request(service) ⇒ <code>Promise.&lt;Measure&gt;</code>
Make an HTTP/S request for checking the status of `Service`.

**Kind**: static method of [<code>Checker</code>](#Checker)  

| Param | Type | Description |
| --- | --- | --- |
| service | <code>Service</code> | Service that will be checked. |

**Example**  
```js
const service = {
  name: 'google',
  health: 'https://www.google.es',
  method: 'GET'
};

Checker.request(service).then(measure => console.log(measure));
``` 
