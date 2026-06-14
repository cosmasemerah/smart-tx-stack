> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/account-management/api-access/tokens.md).

# Tokens

### **Overview**

Create private access tokens to allow your backend services to make authenticated RPC requests to an Endpoint. This allows you to make requests from any backend origin.

<mark style="color:red;">This token is private information and should never be exposed on a front-end.</mark>

On the load balancers, we support "user:password" style basic authentication if you need to use that form of auth. In those cases, the password is the token. The token\_user is randomly generated, so every token has a unique user.

### List Tokens

<mark style="color:blue;">`GET /api/v1/tokens`</mark>

Returns all tokens that the current authentication token has access to.

**Parameters**

<table><thead><tr><th width="220">Name</th><th width="216.33333333333331">Type</th><th>Description</th></tr></thead><tbody><tr><td>account_uuid  <mark style="color:red;">*</mark></td><td><code>string</code></td><td>Will filter the results by account_uuid.</td></tr><tr><td>subscription_uuid <mark style="color:red;">*</mark></td><td><code>string</code></td><td>Will limit the results by subscription_uuid.</td></tr><tr><td>per</td><td><code>string</code></td><td></td></tr><tr><td>page</td><td><code>string</code></td><td></td></tr></tbody></table>

<mark style="color:red;">\* Either a</mark> <mark style="color:red;"></mark><mark style="color:red;">`subscription_uuid`</mark> <mark style="color:red;"></mark><mark style="color:red;">or</mark> <mark style="color:red;"></mark><mark style="color:red;">`account_uuid`</mark> <mark style="color:red;"></mark><mark style="color:red;">parameter is required</mark>

**Request**

Example requests with page filtering, number of tokens per page and filtering by account uuid and subscription uuid.

```url
curl 'https://customers.triton.one/api/v1/tokens?account_uuid=c92a9cea-47cc-494b-b1b0-4230a2316ee5' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

<pre><code><strong>curl 'https://customers.triton.one/api/v1/tokens?subscription_uuid=74ea9d9a-4b2a-4f01-af47-1c175f8a2af6' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
</strong></code></pre>

```
curl 'https://customers.triton.one/api/v1/tokens?per=10&page=2&subscription_uuid=74ea9d9a-4b2a-4f01-af47-1c175f8a2af6' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

#### Response

Returns a hash with the `tokens` key containing an array of tokens objects and the `meta` containing pagination data.

```json
{
   "tokens": [
      {
         "uuid": "fa2fec9c-c3e6-4625-b11f-7906dff5f37c",
         "name": "token-name",
         "value": "8d43f8dc-8aa3-4fa2-b09e-361f6af8d972",
         "rate_tier": "tier1",
         "auth_username": "tylerqt-tylerwi-db8c",
         "is_active": false,
         "deactivation_reasons": [      
         ]
      },
      { token_object_2 },
      { token_object_3 },
      ...
   ],
   "meta": {
      "current_page": 1,
      "next_page": null,
      "per_page": 10,
      "prev_page": null,
      "total_pages": 1,
      "total_count": 1
   }
}
```

### **Get Token**

<mark style="color:red;">This API is not available.</mark>

### **Create Token**

<mark style="color:blue;">`POST /api/v1/subscriptions/:subscription_uuid/tokens`</mark>

Add a new token that can be used to access the Subscription's Endpoints

**Parameters**

| Name                                                  | Type     | Description                                                                                                                                       |
| ----------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| name <mark style="color:red;">\*required</mark>       | `string` | A human readable name to describe the token.                                                                                                      |
| rate\_tier <mark style="color:red;">\*required</mark> | `string` | The name of the \<link>Rate Tier for this token, which defines rate limits for it. Each token incurs costs based on the Rate Tier defined for it. |

**Request**

Example requests with account\_uuid and subscription\_uuid filtering.

```url
curl -X POST 'https://customers.triton.one/api/v1/subscriptions/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/tokens' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" -d '
{
    "token": {
        "name": "Token 123",
        "rate_tier": "developer" 
    }
}' 
```

**Response**

All submitted keys, plus the following are returned:

| Name           | Type     | Description                                                                |
| -------------- | -------- | -------------------------------------------------------------------------- |
| uuid           | `string` | The generated primary key to reference this token.                         |
| auth\_username | `string` | A randomly generated value that can be for basic authentication if needed. |
| value          | `string` | The value used for authentication.                                         |

```json
{
   "token":  {
      "uuid": "b51e9812-ece9-4cb0-81f1-0c4bbdc8a3b7",
      "name": "Token 123",
      "value": "b4274ebd-e2f5-46fd-8e99-8aff8f9f4a85",
      "rate_tier": "developer",
      "auth_username": "tylerqt-example-73d1",
      "is_active": false,
      "deactivation_reasons": []
   }
}
```

### **Activate Token**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller and operator role.</mark>

<mark style="color:blue;">`PUT /api/v1/tokens/:token_uuid/activate`</mark>

Activate a token so that it can be used.

**Parameters**

<mark style="color:blue;">`token_uuid`</mark> is the only parameter that needs to be provided.

**Request**

```url
curl -X PUT 'https://customers.triton.one/api/v1/tokens/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/activate' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json"
```

**Response**

```json
204 No Content
```

### **Deactivate Token**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller and operator role.</mark>

<mark style="color:blue;">`PUT /api/v1/tokens/:token_uuid/deactivate`</mark>

Deactivate a token so that it cannot be used.

**Parameters**

All parameters are optional.

| Name                 | Type     | Description                                                       |
| -------------------- | -------- | ----------------------------------------------------------------- |
| deactivation\_reason | `string` | A human readable description to describe the deactivation reason. |

**Request**

Example request with `deactivation_reason`.

```url
curl -X PUT 'https://customers.triton.one/api/v1/tokens/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/deactivate' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" -d '
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
GET https://docs.triton.one/account-management/api-access/tokens.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
