> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/account-management/api-access/subscriptions.md).

# Subscriptions

### **Overview**

A Subscription is the primary resource, and it encapsulates all things related to the endpoints and tokens you define. This also includes a name, a start and end timestamp, and other metadata. This is one of the first resources that you should create to get started using Triton and making RPC requests. You'll need to have an account and obtain an  `account_uuid` to create a subscription.

### **List Subscriptions**

<mark style="color:blue;">`GET /api/v1/subscriptions`</mark>

Returns subscriptions that the current authentication token has access to.&#x20;

**Parameters**

All parameters are optional.

| Name               | Type      | Description                                                   |
| ------------------ | --------- | ------------------------------------------------------------- |
| subscription\_type | `string`  | Will filter the results by subscription\_type.                |
| account\_uuid      | `string`  | Will filter the results by account\_uuid.                     |
| user\_uuid         | `string`  | Will filter the results by user\_uuid.                        |
| per                | `integer` | Will limit the results to NN entries per page, defaults to 50 |
| page               | `integer` | Will return the results from passed page, defaults to 1       |

**Request**

Example requests with page filtering, number of subscriptions per page and filtering by subscription type, account uuid or user uuid.

```url
curl 'https://customers.triton.one/api/v1/subscriptions' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json"
```

```url
curl 'https://customers.triton.one/api/v1/subscriptions?subscription_type=mainnet-shared' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

```
curl 'https://customers.triton.one/api/v1/subscriptions?account_uuid=c92a9cea-47cc-494b-b1b0-4230a2316ee5' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

```
curl 'https://customers.triton.one/api/v1/subscriptions?per=10&page=2' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

#### Response

Returns a hash with the `subscriptions` key containing an array of subscriptions objects and the `meta` containing pagination data.

<pre class="language-json"><code class="lang-json">{
   "subscriptions": [
      { subscription_object_1 },
      { subscription_object_2 },
      { subscription_object_3 },
      ...
   ],
<strong>   "meta": {
</strong>      "current_page": 1,
      "next_page": null,
      "per_page": 50,
      "prev_page": null,
      "total_pages": 1,
      "total_count": 3
   }
}
</code></pre>

### Get Subscription

<mark style="color:blue;">`GET /api/v1/subscriptions/:subscription-uuid`</mark>

Get Subscription that the current authentication token has access to.

**Parameters**

`subscription-uuid` is the only parameter that needs to be provided.

**Request**

Example request containing `subscription-uuid`

```
curl 'https://customers.triton.one/api/v1/subscriptions/c92a9cea-47cc-494b-b1b0-4230a2316ee5' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

**Response**

Returns a hash with the `subscription` key containing a subscription object. The response data for subscription object is the same as for <mark style="color:blue;">`GET /api/v1/subscriptions`</mark>. Below is the sample response.

| Name                   | Type                                       | Description                                                                     |
| ---------------------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| uuid                   | `string`                                   | The generated primary key to reference this subscription.                       |
| endpoints              | `array[{endpoint_object}, ...]`            | An array of Endpoint objects, documented in the Endpoints section.              |
| tokens                 | `array[{token_object}, ...]`               | An array of Token objects, documented in the Tokens section.                    |
| supported\_rate\_tiers | `array[{supported_rate_tier_object}, ...]` | An array of Supported Rate Tiers objects, documented in the Rate Tiers section. |
| deactivation\_reasons  | `array[{deactivation_reason_object}, ...]` | An array of Deactivation Reasons objects.                                       |

```json
{
   "subscription": {
      "uuid": "5d8d4591-12cc-424a-8f39-32de0ba6acc3",
      "name": "Example App",
      "account_uuid": "4ad26b8a-a9a1-4f9b-b0fa-c13a682d64b1",
      "subscription_type": "mainnet-shared",
      "starts_at": null,
      "ends_at": null,
      "is_active": false,
      "account": { // An account that is assigned to a given subscription
         "uuid": "4ad26b8a-a9a1-4f9b-b0fa-c13a682d64b1",
         "name": "Tyler-qt65u8xzj2",
         "billing_address1": "420 Effertz Estates",
         "billing_address2": null,
         "billing_address3": null,
         "billing_city": "Padbergville",
         "billing_state_or_province": "Alabama",
         "billing_postal_code": "78007",
         "billing_country_code": "US",
         "telephone_country_code": "+61-8",
         "telephone": "870-800-5877",
         "last_time_activated": "02/05/2023",
         "is_active": true,
         "created_at": "2023-05-02T16:32:46Z",
         "updated_at": "2023-05-02T16:32:46Z",
         "users_count": 1,
         "tokens_count": 0,
         "endpoints_count": 1,
         "subscriptions_count": 2,
         "is_helio_pay_stream_active": false,
         "pay_stream_id": "639cbc90a989eacb2574a055",
         "metrics_enabled": false,
         "payment_method": "manual",
         "maximum_tokens": -1,
         "address_watch_lists": false,
         "allow_ip_ranges": false
      },
      "supported_rate_tiers": [ // A roll-up of related supported rate tiers
         {
            "uuid": "ca141949-a46f-446a-abee-a031e501fea0",
            "name": "developer",
            "active_tokens_count": 5,
            "active_endpoints_count": 4,
            "supported_subscription_type_uuids": [
               "413defdd-b011-4dda-8145-fa782524284c"
            ]
         }
      ],
      "endpoints": [ // A roll-up of related endpoints
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
               "academy-strict-fnalfmab4l.TWST 2"
            ],
            "default_values": [
               "academy-strict-fnalfmab4l.TEST 1",
               "academy-strict-fnalfmab4l.TWST 2"
            ],
            "allowed_origins": [
               {
                  "id": 1,
                  "uuid": "b4d5ec62-410d-45f8-8b45-44fe6641cf1f",
                  "value": "vonrueden-haag.co",
                  "endpoint_id": 1,
                  "created_at": "2023-05-02T16:32:46Z",
                  "updated_at": "2023-05-02T16:32:46Z",
                  "is_active": true
               }
            ]
         }
      ],
      "tokens": [ // A roll-up of tokens for related Subscription, Account, & Users
         {
            "uuid": "fa2fec9c-c3e6-4625-b11f-7906dff5f37c",
            "name": "Token name",
            "value": "8d43f8dc-8aa3-4fa2-b09e-361f6af8d972",
            "rate_tier": "tier1",
            "auth_username": "tylerqt-tylerwi-db8c",
            "is_active": false
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

### **Create Subscription**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller role.</mark>

<mark style="color:blue;">`POST /api/v1/subscriptions`</mark>

**Parameters**

| Name                                                          | Type       | Description                                                                                                                          |
| ------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| account\_uuid <mark style="color:red;">\*required</mark>      | `string`   | Primary key of the account that the subscription should belong to.                                                                   |
| subscription\_type <mark style="color:red;">\*required</mark> | `string`   | Name of the subscription type. Obtained from \<link>Subscription Types                                                               |
| name <mark style="color:red;">\*required</mark>               | `string`   | A human readable display name to describe the subscription.                                                                          |
| starts\_at                                                    | `datetime` | The scheduled timestamp for the subscription to become active. Defaults to null, which means the subscription is immediately active. |
| ends\_at                                                      | `datetime` | The timestamp for which the subscription becomes inactive. Defaults to null, which means the subscription never becomes inactive.    |

**Request**

Request JSON (`-d` command line parameter) must contain `subscription` key for a subscription object. All parameters should be placed inside.

```url
curl -X POST 'https://customers.triton.one/api/v1/subscriptions' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept: application/json" -d '
{
    "subscription": {
        "account_uuid": "c92a9cea-47cc-494b-b1b0-4230a2316ee5", // obtain from UI
        "subscription_type": "mainnet-shared",
        "name": "Example App",
        "starts_at": "2023-07-10T10:25:30Z",
        "ends_at": "2023-07-30T05:00:00Z"
    }
}'
```

**Response**

Returns a hash with the `subscription` key containing a subscription object. Note that `endpoints`, `tokens` and `deactivation_reasons` arrays are empty because this is newly created subscription. Below is the sample response.&#x20;

```json
 {
   "subscription": {
      "uuid": "5d8d4591-12cc-424a-8f39-32de0ba6acc3",
      "name":"Example App",
      "account_uuid": "4ad26b8a-a9a1-4f9b-b0fa-c13a682d64b1",
      "subscription_type": "mainnet-shared",
      "starts_at": null,
      "ends_at": null,
      "is_active": false,
      "account": {
         "uuid": "4ad26b8a-a9a1-4f9b-b0fa-c13a682d64b1",
         "name": "Tyler-qt65u8xzj2",
         "billing_address1": "420 Effertz Estates",
         "billing_address2": null,
         "billing_address3": null,
         "billing_city": "Padbergville",
         "billing_state_or_province": "Alabama",
         "billing_postal_code": "78007",
         "billing_country_code": "US",
         "telephone_country_code": "+61-8",
         "telephone": "870-800-5877",
         "last_time_activated": "02/05/2023",
         "is_active": true,
         "created_at": "2023-05-02T16:32:46Z",
         "updated_at": "2023-05-02T16:32:46Z",
         "users_count": 1,
         "tokens_count": 0,
         "endpoints_count": 1,
         "subscriptions_count": 2,
         "is_helio_pay_stream_active": false,
         "pay_stream_id": "639cbc90a989eacb2574a055",
         "metrics_enabled": false,
         "payment_method": "manual",
         "maximum_tokens": -1,
         "address_watch_lists": false,
         "allow_ip_ranges": false
      },
      "supported_rate_tiers": [
         {
            "uuid": "ca141949-a46f-446a-abee-a031e501fea0",
            "name": "developer",
            "active_tokens_count": 5,
            "active_endpoints_count": 4,
            "supported_subscription_type_uuids": [
               "413defdd-b011-4dda-8145-fa782524284c"
            ]
         }
      ],
      "endpoints_count": 0,
      "tokens_count": 0,
      "endpoints": [],
      "tokens": [],
      "deactivation_reasons": []
   }
}
 
```

### **Update Subscription**

<mark style="color:blue;">`PUT /api/v1/subscriptions/:subscription_uuid`</mark>

Update attributes like `name` on an existing Subscription that the current authentication token has access to. Any other updatable attributes for a Subscription like Endpoints and Tokens should be updated via their distinct account management APIs.

**Parameters**

| Name | Type     | Description                                                 |
| ---- | -------- | ----------------------------------------------------------- |
| name | `string` | A human readable display name to describe the subscription. |

**Request**

Request JSON (`-d` command line parameter) must contain `subscription` key for a subscription object. All parameters should be placed inside.

```url
curl -X PUT 'https://customers.triton.one/api/v1/subscriptions/c92a9cea-47cc-494b-b1b0-4230a2316ee5' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept: application/json" -d '
{
    "subscription": {
        "name": "Example App"
    }
}'
```

**Response**

Returns a hash with the `subscription` key containing a subscription object. The response data for subscription object is the same as for <mark style="color:blue;">`GET /api/v1/subscriptions/:subscription-uuid`</mark> nad <mark style="color:blue;">`GET /api/v1/subscription`</mark>

```json
{
   "subscription": {
      "name": "Example App" // subscription attributes are the same as for GET and POST 
      ...
      "supported_rate_tiers": [ // A roll-up of related supported rate tiers
         { supported_rate_tier_object_1 },
         { supported_rate_tier_object_2 },
         { supported_rate_tier_object_3 },
         ...
      ],
      "endpoints": [ // A roll-up of related endpoints
         { endpoint_object_1 },
         { endpoint_object_2 },
         { endpoint_object_3 },
         ...
      ],
      "tokens": [ // A roll-up of tokens for related Subscription, Account, & Users
         { token_object_1 },
         { token_object_2 },
         { token_object_3 },
         ...
      ],
      "deactivation_reasons": [
         { deactivation_reason_object_1 },
         { deactivation_reason_object_2 },
         { deactivation_reason_object_3 },
         ...
      ]
   }
}
```

### **Activate Subscription**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller role.</mark>

<mark style="color:blue;">`PUT /api/v1/subscriptions/:subscription_uuid/activate`</mark>

Activate a subscription so that it can be used.

**Parameters**

<mark style="color:blue;">`subscription_uuid`</mark> is the only parameter that needs to be provided.

**Request**

```url
curl -X PUT 'https://customers.triton.one/api/v1/subscriptions/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/activate' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json"
```

**Response**

```json
204 No Content
```

### **Deactivate Subscription**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller role.</mark>

<mark style="color:blue;">`PUT /api/v1/subscriptions/:subscription_uuid/deactivate`</mark>

Deactivate a subscription so that it cannot be used.

**Parameters**

All parameters are optional.

| Name                 | Type     | Description                                                       |
| -------------------- | -------- | ----------------------------------------------------------------- |
| deactivation\_reason | `string` | A human readable description to describe the deactivation reason. |

**Request**

Example request with `deactivation_reason`.

```url
curl -X PUT 'https://customers.triton.one/api/v1/subscriptions/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/deactivate' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" -d '
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
GET https://docs.triton.one/account-management/api-access/subscriptions.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
