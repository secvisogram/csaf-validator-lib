# Developing CSAF Validator Lib

## Table of Contents

- [Language Tool](#language-tool)
- [Code Style](#code-style)
  - [Formatting with prettier](#formatting-with-prettier)
  - [Quoting Strings](#quoting-strings)

## Language Tool

The informative test 6.3.16 needs a running languagetool server. To set one for development you can use `dev/languagetool/compose.yml`:

docker compose -f dev/languagetool/compose.yml up -d

## Code Style

### Formatting with prettier

JavaScript code must be formatted with Prettier before it can be pushed to the repository.
A prettier.config.cjs is provided.

### Quoting Strings

Strings have to be quoted in the following way:

- **Single quotes ''**

  - We use `''` (single quotes) when the string has no expressions inside.

- **Template literals (backticks)**

  - We use ` `` ` (template literals) when there is an expression to resolve in the string, e.g. ${metricIndex}

- **Quotation mark in string**
  - We use `""` (double quotation marks) in strings to mark text in messages

**Examples:**

Simple Message:

```
message: 'value is not consistent with the vector string',
```

Message with expression inside

```
message: `branch structure nesting exceeds "${MAX_DEPTH}" branches (it is ${count} levels deep)`
```

Message with "" inside

```
message:
  'the ssvc id does neither match the "cve" nor it '+
  'matches the "text" of any item in the "ids" array',
```

### Maintaining the spdx parser

There is an spdx parser included in the project which is generated from a peggy grammar file in `lib/spdx/parser.peggy`. When updating the grammar file run `npm run prepublishOnly` to update the generated artifact which is versioned in git.
