> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/account-management/api-access/endpoints.md).

# Endpoints

### **Overview**

An Endpoint is what clients will call to consume the RPC. Endpoints belong to a Subscription, which holds its metadata. An endpoint's name is assigned to you when it's created and is randomly assigned.

### List Endpoints

<mark style="color:blue;">`GET /api/v1/endpoints`</mark>

Returns all endpoints to which the current authentication token has access.

**Parameters**

<table><thead><tr><th width="220">Name</th><th width="216.33333333333331">Type</th><th>Description</th></tr></thead><tbody><tr><td>account_uuid  <mark style="color:red;">*</mark></td><td><code>string</code></td><td>Will filter the results by account_uuid.</td></tr><tr><td>subscription_uuid <mark style="color:red;">*</mark></td><td><code>string</code></td><td>Will limit the results by subscription_uuid.</td></tr></tbody></table>

<mark style="color:red;">\* Either a</mark> <mark style="color:red;"></mark><mark style="color:red;">`subscription_uuid`</mark> <mark style="color:red;"></mark><mark style="color:red;">or</mark> <mark style="color:red;"></mark><mark style="color:red;">`account_uuid`</mark> <mark style="color:red;"></mark><mark style="color:red;">parameter is required</mark>

**Request**

Example requests with account\_uuid and subscription\_uuid filtering.

```url
curl 'https://customers.triton.one/api/v1/endpoints?account_uuid=c92a9cea-47cc-494b-b1b0-4230a2316ee5' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

```
curl 'https://customers.triton.one/api/v1/endpoints?subscription_uuid=74ea9d9a-4b2a-4f01-af47-1c175f8a2af6' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

#### Response

Returns a hash with the `endpoints` key containing an array of endpoints objects.

```json
{
   "endpoints": [
      {
         "uuid": "23ab660b-cb09-4ca5-b49a-518b422a8d81",
         "name": "Jacobson LLC cbp4i3u71m",
         "value": null,
         "slug": "academy-strict-fnalfmab4l",
         "rate_tier": "developer",
         "is_active": true,
         "value_override": null,
         "values": [
            "academy-strict-fnalfmab4l.TEST 1",
            "academy-strict-fnalfmab4l.TWST 2",
            "academy-strict-fnalfmab4l.value-3"
         ],
         "default_values": [
            "academy-strict-fnalfmab4l.TEST 1",
            "academy-strict-fnalfmab4l.TWST 2",
            "academy-strict-fnalfmab4l.value-3"
         ],
         "allowed_origins": [
            {
               "uuid": "b4d5ec62-410d-45f8-8b45-44fe6641cf1f",
               "value": "vonrueden-haag.co",
               "is_active": true
            }
         ],
         "deactivation_reasons": [
            {
               "description": "Deactivation reason description",
               "created_at": "2023-06-26T20:16:05Z"
            }
         ]
      },
      { endpoint_object_2 },
      { endpoint_object_3 },
      ...
   ]
}
```

### **Get Endpoint**

<mark style="color:red;">This API is not available.</mark>

### **Create Endpoint**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller role.</mark>

<mark style="color:blue;">`POST /api/v1/subscriptions/:subscription_uuid/endpoints`</mark>

**Parameters**

| Name                                                  | Type                                                | Description                                                                                                                                                |
| ----------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name <mark style="color:red;">\*required</mark>       | `string`                                            | A human-readable name to describe the endpoint.                                                                                                            |
| rate\_tier <mark style="color:red;">\*required</mark> | `string`                                            | The name of the Rate Tier for this endpoint, which defines rate limits on the Endpoint. Each endpoint incurs costs based on the Rate Tier defined for it.  |
| allowed\_origins                                      | `array[{ value: dns_cname }, { value: dns_cname }]` | An array of DNS CNAME records that define origins that can access the endpoint. This is commonly used by frontends that can't obscure an API access token. |

**Request**

Example requests with account\_uuid and subscription\_uuid filtering. All new allowed origins are automatically enabled.

```url
curl -X POST 'https://customers.triton.one/api/v1/subscriptions/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/endpoints' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" -d '
{
    "endpoint": {
        "name": "Endpoint 123",
        "rate_tier": "developer",
        "allowed_origins":  [{ value: "example.com" }, { value: "frontend.website.com" }]
    }
}' 
```

**Response**

All submitted keys, plus the following are returned:

| Name   | Type                             | Description                                                              |
| ------ | -------------------------------- | ------------------------------------------------------------------------ |
| uuid   | `string`                         | The generated primary key to reference this endpoint.                    |
| values | `array[string (DNS CNAME), ...]` | The endpoint values that should be called by clients to consume the RPC. |

```json
{
   "endpoint": {
      "uuid": "a5131884-1ce4-4415-98f8-d040901ecbd0",
      "name": "Endpoint 123",
      "slug": "tylerqt-example-3c6e",
      "rate_tier": "developer",
      "is_active": false,
      "value_override": null,
      "values": [
         "tylerqt-example-3c6e.TEST 1",
         "tylerqt-example-3c6e.TWST 2",
         "tylerqt-example-3c6e.value-3"
      ],
      "default_values": [
         "tylerqt-example-3c6e.TEST 1",
         "tylerqt-example-3c6e.TWST 2",
         "tylerqt-example-3c6e.value-3"
      ],
      "allowed_origins": [
         {
            "uuid": "4d63807d-84f2-491c-898e-9190fa334592",
            "value": "example.com",
            "is_active": true
         },
         {
            "uuid": "a21d362b-f488-4778-8e5c-d3c917efd764",
            "value": "frontend.website.com",
            "is_active": true
         }
      ],
      "deactivation_reasons": []
   }
}    
```

### **Update Endpoint**

<mark style="color:blue;">`PUT /api/v1/endpoints/:endpoint_uuid`</mark>

Update an endpoint. Only allowed\_origins can be updated. Accepts updates as full-updates, where the passed in list overwrites any existing allowed\_origins.

**Parameters**

| Name                                                                                                    | Type                                                                                        | Description                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                                                                                                    | `string`                                                                                    | A human-readable name to describe the endpoint.                                                                                                                           |
| rate\_tier <mark style="color:red;">\*limited to REST API tokens created with the reseller role.</mark> | `string`                                                                                    | A Rate Tier name. It's assigned to an Endpoint in order to determine how much the endpoint costs                                                                          |
| allowed\_origins <mark style="color:red;">\*limited to one allowed origin for standard role.</mark>     | `array[{ value: dns_cname, is_active: boolean }, { value: dns_cname, is_active: boolean }]` | An array of DNS CNAME and is\_active records that define origins that can access the endpoint. This is commonly used by frontends that can't obscure an API access token. |

**Request**

Example requests with account\_uuid and subscription\_uuid filtering.

```url
curl -X PUT 'https://customers.triton.one/api/v1/endpoints/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" -d '
{
    "endpoint": {
        "name": "Endpoint 123",
        "rate_tier": "developer",
        "allowed_origins": [{ value: "example.com", is_active: true }, { value: "frontend.website.com", is_active: true }]
    }
}' 
```

**Response**

All submitted keys, plus the following are returned:

| Name   | Type                             | Description                                                              |
| ------ | -------------------------------- | ------------------------------------------------------------------------ |
| uuid   | `string`                         | The generated primary key to reference this endpoint.                    |
| values | `array[string (DNS CNAME), ...]` | The endpoint values that should be called by clients to consume the RPC. |

```json
{
   "endpoint": {
      "uuid": "6ec86e74-783b-4779-b626-937a5c1e2a89",
      "name": "New Endpoint Name",
      "value": null,
      "slug": "tylerqt-example-f988",
      "rate_tier": "developer",
      "is_active": false,
      "value_override": null,
      "values": [
         "tylerqt-example-f988.TEST 1",
         "tylerqt-example-f988.TWST 2",
         "tylerqt-example-f988.value-3"
      ],
      "default_values": [
         "tylerqt-example-f988.TEST 1",
         "tylerqt-example-f988.TWST 2",
         "tylerqt-example-f988.value-3"
      ],
      "allowed_origins": [
         {
            "uuid": "32d511f0-3fb0-4570-8922-f8bc988b41a1",
            "value": "example.com",
            "is_active": true
         }
      ],
      "deactivation_reasons": [
          {
            "description": "Deactivation reason description",
            "created_at": "2023-07-03T12:00:22Z"
         }
      ]
   }
}
```

### **Activate Endpoint**

<mark style="color:red;">This API is only limited to accoutn management API tokens created with the reseller role.</mark>

<mark style="color:blue;">`PUT /api/v1/endpoints/:endpoint_uuid/activate`</mark>

Activate an endpoint so that it can be used.

**Parameters**

<mark style="color:blue;">`endpoint_uuid`</mark> is the only parameter that needs to be provided.

**Request**

```url
curl -X PUT 'https://customers.triton.one/api/v1/endpoints/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/activate' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json"
```

**Response**

```json
204 No Content
```

### **Deactivate Endpoint**

<mark style="color:red;">This API is only limited to account managemrnt API tokens created with the reseller role.</mark>

<mark style="color:blue;">`PUT /api/v1/endpoints/:endpoint_uuid/deactivate`</mark>

Deactivate an endpoint so that it cannot be used.

**Parameters**

All parameters are optional.

| Name                 | Type     | Description                                                       |
| -------------------- | -------- | ----------------------------------------------------------------- |
| deactivation\_reason | `string` | A human readable description to describe the deactivation reason. |

**Request**

Example request with optional `deactivation_reason`.

```url
curl -X PUT 'https://customers.triton.one/api/v1/endpoints/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/deactivate' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" -d '
{
    "deactivation_reason": "Deactivation reason description"
}' 
```

**Response**

```json
204 No Content
```


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/account-management/api-access/endpoints.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
