-- Migration: add cn-/en- prefix to name_sort_key for language-grouped sorting
-- Chinese names (containing non-ASCII/CJK chars) get cn- prefix
-- English names (ASCII only) get en- prefix
-- Also updates slugs to match new sort keys

UPDATE cigars
SET
  name_sort_key = CASE
    WHEN name ~ '[^\x00-\x7F]' THEN 'cn-' || name_sort_key
    ELSE 'en-' || name_sort_key
  END,
  slug = CASE
    WHEN name ~ '[^\x00-\x7F]' THEN 'cn-' || slug
    ELSE 'en-' || slug
  END
WHERE name_sort_key IS NOT NULL
  AND name_sort_key != ''
  AND name_sort_key NOT LIKE 'cn-%'
  AND name_sort_key NOT LIKE 'en-%';
