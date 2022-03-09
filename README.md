<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">csaf-validator-lib</h3>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#testing">Testing</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This JavaScript library is intended to include logic that can be shared across application working with CSAF.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Include this repository as a git subtree and install the dependencies. After that you can reference the modules from within your JavaScript application.

### Prerequisites

Include this as a subtree in your repository.

- git subtree
  ```sh
  git subtree add --prefix csaf-validator-lib https://github.com/secvisogram/csaf-validator-lib.git main --squash
  ```

### Installation

- Install dependencies
  ```sh
  cd csaf-validator-lib && npm ci --prod
  ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

- Import the modules in your source
  ```js
  import * as optionalTests from './csaf-validator-lib/optionalTests.js'
  ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- TESTING -->

## Testing

Tests are implemented using [mocha](https://mochajs.org/). They can be run using the following command:

```sh
npm test
```

<p align="right">(<a href="#top">back to top</a>)</p>
