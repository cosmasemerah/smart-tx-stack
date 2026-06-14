> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/account-management/api-access/subscription-types.md).

# Subscription Types

### **Overview**

A Subscription Type defines what kind of pool a subscription is for. This is how endpoints are distinguished between a dedicated pool and a shared pool. It also can determine which Solana RPC environment the subscription and endpoints target.

The developer subscription is used to encapsulate the devnet and testnet Solana environments. Any endpoints or tokens created under a developer Subscription will automatically be usable for both Solana environments, typically at no cost.

### **List Subscription Types**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller role.</mark>

<mark style="color:blue;">`GET /api/v1/subscription_types`</mark>

Returns all subscription types that the current authentication token has access to.

**Parameters**

Currently, there are no parameters that would be used.

**Request**

<pre><code><strong>curl 'https://customers.triton.one/api/v1/subscription_types' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
</strong></code></pre>

**Response**

Returns all subscription types that a Subscription can get created with.

```json
{
   "subscription_types": [
      {
         "uuid": "413defdd-b011-4dda-8145-fa782524284c",
         "name": "developer",
         "pool_name": "test pool name",
         "subscriptions_count": 10,
         "endpoint_default_suffixes": [
            "TEST 1",
            "TWST 2"
         ]
      },
      {
         "uuid": "8ddbdbc8-b513-4ba5-a833-2ce8402a9c50",
         "name": "mainnet-shared",
         "pool_name": "pool name",
         "subscriptions_count": 10,
         "endpoint_default_suffixes": [
            "endpoint suffix"
         ]
      },
      {
         "uuid": "b97a3264-2c0a-4af5-85ff-14dce864afc9",
         "name": "mainnet-dedicated",
         "pool_name": "pool name",
         "subscriptions_count": 5,
         "endpoint_default_suffixes": [
            "endpoint suffix"
         ]
      }
   ]
}
```

### **Create Subscription Type / Update Subscription Type**

<mark style="color:red;">This API is only limited to account management API tokens created with the admin role.</mark>


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/account-management/api-access/subscription-types.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
