# database-learning

Hands-on notes, sample data, and runnable scripts for learning databases.

[![CI](https://github.com/blaze-b/database-learning/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/blaze-b/database-learning/actions/workflows/ci.yml)

## What's inside

| Folder | Status | Description |
|--------|--------|-------------|
| [`mongo/`](mongo/) | Ready | MongoDB query reference: notes, sanitised datasets, mongosh scripts, Node examples, exercises |
| More coming | Planned | Room for other databases (for example SQL or Redis) beside `mongo/` |

## Repo layout

```text
database-learning/
├── README.md                 # this file
├── .gitignore
├── .gitleaks.toml
├── .github/workflows/ci.yml  # secret scan + MongoDB query CI
└── mongo/                    # first database track
    ├── README.md
    ├── docker-compose.yml
    ├── .env.example
    ├── notes/
    ├── queries/
    ├── exercises/
    ├── data/
    ├── node/
    └── templates/
```

## Prerequisites

- Git
- Docker and Docker Compose (for local MongoDB)
- Node.js 18+ (seed script and Node examples)
- [mongosh](https://www.mongodb.com/docs/mongodb-shell/) (run query files)

## 2-minute quick start

```bash
git clone https://github.com/blaze-b/database-learning.git
cd database-learning/mongo
cp .env.example .env
docker compose up -d
npm install && npm --prefix node install
npm run seed
mongosh "$MONGODB_URI" --file queries/02-crud-find.mongodb
```

Default URI is `mongodb://localhost:27017` (see [`mongo/.env.example`](mongo/.env.example)). Full Mongo guide: [`mongo/README.md`](mongo/README.md).

## Add a new database folder

1. Create a sibling of `mongo/` (for example `sql/`) with its own `README.md`.
2. Keep sample data sanitised; never commit real connection strings or credentials.
3. Prefer `.env.example` + `MONGODB_URI`-style env vars (or the equivalent for that engine).
4. Link the folder from the table above and from any root quick-start notes.
5. Add CI only when scripts are runnable and deterministic.

## Contributing / conventions

- **Public-safe by default** — scrub hosts, usernames, passwords, tokens, and personal sample data before merging.
- **Copy files, not history** — do not subtree-merge private training repos into this public repo.
- **Runnable examples** — query scripts and Node samples should work against local Docker after `seed`.
- **Secret scanning** — `gitleaks` runs in CI; do not weaken path allowlists to hide findings.
- **Branch naming** — feature work lands via PR against `master`.

## License

No license file is published yet. Treat contents as personal learning material unless a license is added later.
