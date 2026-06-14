> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/account-management/api-access/accounts.md).

# Accounts

### **Overview**

Accounts are only used for billing. You cannot create new accounts yourself. Instead, you'll need to ask an administrator to do this for you, if you'd like to have separate billing for your subscriptions.

### List Accounts

<mark style="color:blue;">`GET /api/v1/accounts`</mark>

Returns all accounts that the current authentication token has access to.

**Parameters**

All parameters are optional.

<table><thead><tr><th width="220">Name</th><th width="216.33333333333331">Type</th><th>Description</th></tr></thead><tbody><tr><td>name</td><td><code>string</code></td><td>Will filter the results by account name, there is nothing by default</td></tr><tr><td>per</td><td><code>integer</code></td><td>Will limit the results to NN entries per page, defaults to 50</td></tr><tr><td>page</td><td><code>integer</code></td><td>Will return the results from passed page, defaults to 1</td></tr></tbody></table>

**Request**

Example requests with page filtering, number of accounts per page and filtering by name.

```url
curl 'https://customers.triton.one/api/v1/accounts' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json"
```

```url
curl 'https://customers.triton.one/api/v1/accounts?name=Account-123' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

```
curl 'https://customers.triton.one/api/v1/accounts?per=10&page=2' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

#### Response

Returns a hash with the `accounts` key containing an array of account objects and the `meta`  containing pagination data.

```json
{
   "accounts": [
      { account_object_1 },
      { account_object_2 },
      { account_object_3 },
      ...
   ],
   "meta": {
      "current_page": 1,
      "next_page": null,
      "per_page": 50,
      "prev_page": null,
      "total_pages": 1,
      "total_count": 3
   }
}
```

### Get Account

<mark style="color:blue;">`GET /api/v1/accounts/:account-uuid`</mark>

Get Account that the current authentication token has access to.

**Parameters**

`account-uuid` is the only parameter that needs to be provided.

**Request**

Example request containing `account-uuid`

```url
curl 'https://customers.triton.one/api/v1/accounts/c92a9cea-47cc-494b-b1b0-4230a2316ee5' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

#### Response

Returns a hash with the `account` key containing an account object. The response data for the account object is the same as for <mark style="color:blue;">`GET /api/v1/accounts`</mark>. Below is the sample response.

```json
{
   "account": {
      "uuid": "c92a9cea-47cc-494b-b1b0-4230a2316ee5",
      "name": "John Doe",
      "billing_address1": "1645 S Telegraph Rd",
      "billing_address2": null,
      "billing_address3": null,
      "billing_city": "Bloomfield Hills",
      "billing_state_or_province": "Michigan",
      "billing_postal_code": "48302",
      "billing_country_code": "US",
      "telephone_country_code": "US",
      "telephone": "(248) 858-2300",
      "last_time_activated":"28/06/2023",
      "is_active": true,
      "created_at": "2023-06-22T09:11:11Z",
      "updated_at": "2023-06-28T11:26:52Z",
      "users_count": 1,
      "tokens_count": 6,
      "endpoints_count": 4,
      "subscriptions_count": 2,
      "is_helio_pay_stream_active": true,
      "pay_stream_id": "639cbc90a989eacb2574a055",
      "metrics_enabled": false,
      "payment_method": "manual",
      "maximum_tokens": -1,
      "address_watch_lists": false,
      "allow_ip_ranges": false,
      "subscriptions": [
         {
            "uuid": "74ea9d9a-4b2a-4f01-af47-1c175f8a2af6",
            "name": "Mainnet Shared Subscription",
            "account_uuid": "c92a9cea-47cc-494b-b1b0-4230a2316ee5",
            "subscription_type": "mainnet-shared",
            "starts_at": null,
            "ends_at": null,
            "is_active": true,
            "endpoints_count": 2,
            "tokens_count": 4
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
            ]
         }
      ],
      "deactivation_reasons": [
         {
            "description": "Deactivation reason description",
            "created_at": "2023-06-26T20:16:05Z"
         }
      ]
   }
}
```

### **Create Account**

<mark style="color:red;">This API is only limited to account management API tokens created with the admin role.</mark>

### **Update Account**

<mark style="color:blue;">`PUT /api/v1/accounts/:account-uuid`</mark>

Update account that the current authentication token has access to.

**Parameters**

All parameters are optional unless marked as required.

<table><thead><tr><th width="311">Name</th><th width="155.33333333333331">Type</th><th>Description</th></tr></thead><tbody><tr><td>name <mark style="color:red;">*required</mark></td><td><code>string</code></td><td>A human readable display name to describe the subscription.</td></tr><tr><td>billing_address1</td><td><code>string</code></td><td></td></tr><tr><td>billing_address2</td><td><code>string</code></td><td></td></tr><tr><td>billing_address3</td><td><code>string</code></td><td></td></tr><tr><td>billing_city</td><td><code>string</code></td><td></td></tr><tr><td>billing_state_or_province</td><td><code>string</code></td><td></td></tr><tr><td>billing_postal_code</td><td><code>string</code></td><td></td></tr><tr><td>billing_country_code</td><td><code>string</code></td><td></td></tr><tr><td>telephone_country_code</td><td><code>string</code></td><td></td></tr><tr><td><p>telephone</p><p></p></td><td><code>string</code></td><td></td></tr></tbody></table>

**Request**

Request JSON (`-d` command line parameter) must contain `account` key for account object. All parameters should be placed inside.

```url
curl -X PUT 'https://customers.triton.one/api/v1/accounts/c6b8c375-27ab-4531-94f4-d8d08250fcfa' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" -d '
{
    "account": {
        "name": "John Doe",
        "billing_address1": "1645 S Telegraph Rd",
        "billing_address2": "line 2",
        "billing_address3": "line 3",
        "billing_city": "Bloomfield Hills",
        "billing_state_or_province": "Michigan",
        "billing_postal_code": "48302",
        "billing_country_code": "US",
        "telephone_country_code": "US",
        "telephone": "(248) 858-2300"
    }
}'
```

**Response**

Returns a hash with the `account` key containing an account object. The response data for account object is the same as for <mark style="color:blue;">`GET /api/v1/accounts/:account-uuid`</mark> nad <mark style="color:blue;">`GET /api/v1/accounts`</mark>

```json
{
   "account": {
      "uuid": "c92a9cea-47cc-494b-b1b0-4230a2316ee5",
      "name": "John Doe",
      "billing_address1": "1645 S Telegraph Rd",
      "billing_address2": null,
      "billing_address3": null,
      "billing_city": "Bloomfield Hills",
      "billing_state_or_province": "Michigan",
      "billing_postal_code": "48302",
      "billing_country_code": "US",
      "telephone_country_code": "US",
      "telephone": "(248) 858-2300",
      ...
      "subscriptions": [
         { subscription_object_1 },
         { subscription_object_2 },
         { subscription_object_3 },
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


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/account-management/api-access/accounts.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
