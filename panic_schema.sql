DROP DATABASE IF EXISTS panic;
CREATE DATABASE panic;

\c panic;

/* TABLE CLEANUP */
DROP TABLE IF EXISTS filelist;

/* CREATE FILE SYSTEM */

CREATE TABLE filelist (
	file_id SERIAL PRIMARY KEY,
	filename VARCHAR NOT NULL,
	renamed VARCHAR NOT NULL,
	uploaded TIMESTAMP DEFAULT current_timestamp,
	filesize VARCHAR NOT NULL,
	category VARCHAR NOT NULL
);