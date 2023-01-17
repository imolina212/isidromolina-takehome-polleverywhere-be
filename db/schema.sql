-- Drop if exists

DROP DATABASE IF EXISTS isidromolina_takehome_polleverywhere;

CREATE DATABASE isidromolina_takehome_polleverywhere;

\c isidromolina_takehome_polleverywhere;

DROP TABLE IF EXISTS raffles;

CREATE TABLE raffles (  
    id SERIAL PRIMARY KEY,
    raffle_name TEXT,
    secret_token TEXT,
    winner_id INT
);

DROP TABLE IF EXISTS participants;

CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    raffle_id INT REFERENCES raffles(id) ON DELETE CASCADE,
    firstname TEXT,
    lastname TEXT,
    email TEXT,
    phone TEXT
); 

DROP TABLE IF EXISTS winners;
