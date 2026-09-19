# Commands Plus Plus Wiki

Running on mkdocs Material version 1.6.1

# Setup

```sh

```

# Running locally

## Dev

```sh
mkdocs serve -f mkdocs.debug.yml
```

## Full build

```sh
mkdocs serve
```

The full build also pulls github contributors, which can be rate limited. For local development I just recommend the dev config

# Deploying

```sh
mkdocs gh-deploy --force
```
