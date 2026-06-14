> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/account-management/api-access/auth-and-headers.md).

# Auth & Headers

### **Auth**

Pass your token in through the Authorization header to make scoped, authenticated requests against the account management API. You can use the `GET /api/v1/accounts` endpoint to test your token. If you get a 200 status code response, your token is being passed correctly. This token is only used for the account management API (`customers.rpcpool.com/api`). You'll create separate tokens for consuming the RPC API.

Examples in this account management API guide are demonstrated using curl, but you should use an HTTP library of your choice.

```
$ curl -H "Authorization: secret" -H "Content-Type: application/json" -H "Accept:application/json" https://customers.triton.one/api/v1/accounts         
```

### **Headers**

All endpoints accept and return JSON, and you should pass both an Accept and Content-Type header of `application/json`


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/account-management/api-access/auth-and-headers.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
