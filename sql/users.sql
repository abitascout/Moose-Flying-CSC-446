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
    "Middle",
    "$2a$04$ZBcpPXMSGuV0CFmqO4ncDenf2ouId/JQwsL0wnS7iJ1bRIUGbw9KW",
    "jmb156@email.latech.edu",
    "mid"
);

INSERT INTO users
VALUES(
    "tugboat2k",
    "b3c95b46782d66130602473ca592123f99e79d756aed36357f53e0d4239696a5",
    "trt021@email.latech.edu",
    "bottom"
);




