---
id: api-health-report.js
title: HealthReport
sidebar_label: HealthReport
---

  **Kind**: global class  

* [HealthReport](#HealthReport)
    * [new HealthReport(options)](#new_HealthReport_new)
    * [.start()](#HealthReport+start) ⇒ <code>this</code>
    * [.addMeasure(measure)](#HealthReport+addMeasure) ⇒ <code>this</code>
    * [.getHealth()](#HealthReport+getHealth) ⇒ <code>this</code>
    * [.isHealthy()](#HealthReport+isHealthy) ⇒ <code>boolean</code>
    * [.end()](#HealthReport+end) ⇒ <code>this</code>

<a name="new_HealthReport_new"></a>

## new HealthReport(options)
Creates an instance of HealthReport.


| Param | Type |
| --- | --- |
| options | <code>any</code> | 

<a name="HealthReport+start"></a>

## healthReport.start() ⇒ <code>this</code>
Start reporting time and measures.

**Kind**: instance method of [<code>HealthReport</code>](#HealthReport)  
<a name="HealthReport+addMeasure"></a>

## healthReport.addMeasure(measure) ⇒ <code>this</code>
Add Service measures.

**Kind**: instance method of [<code>HealthReport</code>](#HealthReport)  

| Param | Type |
| --- | --- |
| measure | <code>Measure</code> | 

<a name="HealthReport+getHealth"></a>

## healthReport.getHealth() ⇒ <code>this</code>
Get the health/result of the entrie report.

**Kind**: instance method of [<code>HealthReport</code>](#HealthReport)  
<a name="HealthReport+isHealthy"></a>

## healthReport.isHealthy() ⇒ <code>boolean</code>
Check if there are any service unhealthy

**Kind**: instance method of [<code>HealthReport</code>](#HealthReport)  
**Returns**: <code>boolean</code> - Boolean that indicate if this report has all services healthy.  
<a name="HealthReport+end"></a>

## healthReport.end() ⇒ <code>this</code>
End the health report and recopile information.

**Kind**: instance method of [<code>HealthReport</code>](#HealthReport)  
