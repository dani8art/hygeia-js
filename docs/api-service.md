---
id: api-service.js
title: Service
sidebar_label: Service
---

  **Kind**: global class  

* [Service](#Service)
    * [new Service()](#new_Service_new)
    * [.getJSONSchema()](#Service.getJSONSchema) ⇒ <code>ServiceSchema</code>

<a name="new_Service_new"></a>

### new Service()
Creates an instance of Service.


| Param | Type | Description |
| --- | --- | --- |
| service.name | <code>string</code> | The name of the service. |
| service.health | <code>url</code> | Service endpoint that will be checked. |
| service.method | <code>string</code> | HTTP method that will be used |
| service.timeout | <code>string</code> | Request timeout. |

<a name="Service.getJSONSchema"></a>

### Service.getJSONSchema() ⇒ <code>ServiceSchema</code>
Return the JSON schema of Service Object

**Kind**: static method of [<code>Service</code>](#Service)  
**Returns**: <code>ServiceSchema</code> - JSON Schema of Service Object  
