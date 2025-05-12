-- Hansard at Huddersfield Database Schema

-- Commons and Lords main tables
CREATE SCHEMA IF NOT EXISTS hansard_commons;
CREATE SCHEMA IF NOT EXISTS hansard_lords;

CREATE TABLE IF NOT EXISTS hansard_commons.commons (
    id SERIAL PRIMARY KEY,
    sittingday DATE,
    contributiontext TEXT,
    member TEXT,
    description TEXT,
    href TEXT,
    idxfti_simple tsvector
);

CREATE TABLE IF NOT EXISTS hansard_lords.lords (
    id SERIAL PRIMARY KEY,
    sittingday DATE,
    contributiontext TEXT,
    member TEXT,
    description TEXT,
    href TEXT,
    idxfti_simple tsvector
);

-- Analytics tables
CREATE SCHEMA IF NOT EXISTS hansard_analytics;

CREATE TABLE IF NOT EXISTS hansard_analytics.search (
    id TEXT PRIMARY KEY,
    searchdate TIMESTAMP,
    hit INTEGER,
    type TEXT,
    datefrom DATE,
    dateto DATE,
    house TEXT,
    term TEXT[],
    member TEXT[],
    description TEXT[]
);

CREATE TABLE IF NOT EXISTS hansard_analytics.query (
    id TEXT PRIMARY KEY,
    datefrom DATE,
    dateto DATE,
    term TEXT,
    member TEXT,
    description TEXT,
    searchdate TIMESTAMP,
    house TEXT
);

-- Precomputed statistics tables
CREATE SCHEMA IF NOT EXISTS hansard_precomp;

CREATE TABLE IF NOT EXISTS hansard_precomp.hansard_commons_single_word_year_500 (
    word TEXT,
    hits INTEGER,
    year INTEGER
);

CREATE TABLE IF NOT EXISTS hansard_precomp.hansard_lords_single_word_year_500 (
    word TEXT,
    hits INTEGER,
    year INTEGER
);

CREATE TABLE IF NOT EXISTS hansard_precomp.hansard_commons_total_word_year (
    year INTEGER,
    total INTEGER
);

CREATE TABLE IF NOT EXISTS hansard_precomp.hansard_lords_total_word_year (
    year INTEGER,
    total INTEGER
);

CREATE TABLE IF NOT EXISTS hansard_precomp.hansard_kw_period (
    id SERIAL PRIMARY KEY
    -- Add other columns as needed based on application requirements
);

CREATE TABLE IF NOT EXISTS hansard_precomp.hansard_kw_word (
    period_id INTEGER REFERENCES hansard_precomp.hansard_kw_period(id),
    word TEXT,
    freq_commons INTEGER,
    freq_lords INTEGER
    -- Add other columns as needed
); 