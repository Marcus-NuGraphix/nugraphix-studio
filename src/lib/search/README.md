# Search Layer

This directory owns shared full-text-search primitives.

## Responsibilities

1. Normalize user query strings consistently.
2. Extract bounded token sets for prefix-search behavior.
3. Build reusable SQL fragments for Postgres full-text search.

## File map

1. `fts.ts`: text normalization and SQL fragment helpers.
2. `index.ts`: public export surface.

## Usage Rules

1. Search queries should always be normalized before DB use.
2. Use parameterized SQL fragments returned by this layer.
3. Keep domain-specific search ranking logic in feature modules; keep this
   layer generic.
