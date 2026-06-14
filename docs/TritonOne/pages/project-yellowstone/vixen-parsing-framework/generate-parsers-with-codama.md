> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/project-yellowstone/vixen-parsing-framework/generate-parsers-with-codama.md).

# Generate Parsers with Codama

This guide walks you through generating a [Vixen](https://github.com/rpcpool/yellowstone-vixen) Parser using [Codama](https://github.com/abklabs/codama), a tool for rendering Rust SDKs and parser implementations from IDLs.

Vixen is a framework for building real-time program data pipelines in Rust. This guide helps you scaffold a parser that can be used in the Vixen runtime to decode and process Solana program data.

#### Prerequisites

1. **An `idl.json` file:** Either Anchor-generated or custom.
2. **Install** [**pnpm**](https://pnpm.io/)**:** Or use npm/yarn if preferred.
3. **Initialize a JavaScript Project:**

   ```bash
   pnpm init
   ```

#### Installation

Install the required Codama packages:

```bash
pnpm install @codama/renderers-vixen-parser
```

Also, install dependencies for the parser generation script:

```bash
pnpm install \
  @codama/nodes \
  @codama/nodes-from-anchor \
  @codama/renderers-core \
  @codama/visitors-core
```

#### Setup

**Create a Parser Generation Script**

Create a new file, `codama.cjs`:

```javascript
const path = require("node:path");
const { rootNode } = require("@codama/nodes");
const { rootNodeFromAnchor } = require("@codama/nodes-from-anchor");
const { readJson } = require("@codama/renderers-core");
const { visit } = require("@codama/visitors-core");
const { renderVisitor } = require("@codama/renderers-vixen-parser");

const projectName = "example-parser";
const idl = readJson(path.join(__dirname, "idl.json"));
const node = rootNodeFromAnchor(idl);

visit(
    node,
    renderVisitor({
        projectFolder: __dirname,
        projectName,
    }),
);
```

> **Tip:** The `projectName` is used for the Cargo crate name of the generated parser.

**Run the Code Generation Script**

```bash
node codama.cjs
```

Your folder structure should look like:

```
example-parser/
├── proto/
│   └── example_parser.proto
├── src/
│   ├── generated_parser/
│   ├── generated_sdk/
│   └── lib.rs
├── build.rs
├── Cargo.toml
├── codama.cjs
└── idl.json
```

**Build and Verify**

```bash
cargo build
```

If successful, you now have a working parser for Solana account data using Yellowstone Vixen.

#### Completion

Congratulations! You now have a custom Vixen parser ready for integration into a Vixen pipeline.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/project-yellowstone/vixen-parsing-framework/generate-parsers-with-codama.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
