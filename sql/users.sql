CREATE DATABASE users;

use users;

CREATE TABLE users (
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL,
    PRIMARY KEY (username)
);

INSERT INTO users
VALUES(
    "Robert",
    "327c670676944cb77685d7a2cc84b51852cd02c21f6e46cfe74a0091b6a4af7d",
    "rhm012@email.latech.edu"
);




