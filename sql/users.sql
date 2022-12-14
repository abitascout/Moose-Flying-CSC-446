CREATE DATABASE users;

use users;

/* Can use time stamps as primary key */
CREATE TABLE users (
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL,
    role     VARCHAR(255) NOT NULL,
    PRIMARY KEY (username)
);

INSERT INTO users
VALUES(
    "Robert",
    "$2a$04$ZBcpPXMSGuV0CFmqO4ncDe/WxLLgrVnO9tZWlddBg9Fdk87TKyhwi",
    "rhm012@email.latech.edu",
    "Admin"
);

INSERT INTO users
VALUES(
    "Jalen",
    "$2a$04$ZBcpPXMSGuV0CFmqO4ncDenf2ouId/JQwsL0wnS7iJ1bRIUGbw9KW",
    "jmb156@email.latech.edu",
    "mid"
);

INSERT INTO users
VALUES(
    "tugboat2k",
    "$2a$04$ZBcpPXMSGuV0CFmqO4ncDe8HiGyS9Na3971lcMt.cnt.V5i2bRuoO",
    "trt021@email.latech.edu",
    "bottom"
);




