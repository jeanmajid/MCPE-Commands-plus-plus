# Commands Plus Plus Wiki

Running on mkdocs Material version 1.6.1

# Setup

Im gonna include 2 ways, either pip or uv

1. Setup a virtual enviroment

```bash
python -m venv ./.venv
# or
uv venv
```

2. Then you just activate the eviroment (this step you will have to do each time)

```
.\.venv\Scripts\activate
```

3. and then install the dependencies

```sh
pip install -r .\requirements.txt
# or
uv pip install -r .\requirements.txt
```

# Running locally

## Dev

```sh
mkdocs serve -f mkdocs.debug.yml
```

## Full Build

```sh
mkdocs serve
```

The full build also pulls github contributors, which can be rate limited. For local development I just recommend the dev config

# Deploying

```sh
mkdocs gh-deploy --force
```
