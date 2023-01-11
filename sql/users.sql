CREATE DATABASE users;

use users;

/* Can use time stamps as primary key */
CREATE TABLE users (
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL,
    PRIMARY KEY (username)
);

INSERT INTO users
VALUES(
    "Robert",
<<<<<<< Updated upstream
    "327c670676944cb77685d7a2cc84b51852cd02c21f6e46cfe74a0091b6a4af7d",
=======
    "$2a$04$ZBcpPXMSGuV0CFmqO4ncDe/WxLLgrVnO9tZWlddBg9Fdk87TKyhwi",
>>>>>>> Stashed changes
    "rhm012@email.latech.edu"
);

INSERT INTO users
VALUES(
    "Jalen",
    "d93006ec2e4339d770a7afd068c1f1e789a52df12f595e529fd0f302fc1e",
    "jmb156@email.latech.edu"
);

INSERT INTO users
VALUES(
    "tugboat2k",
    "b3c95b46782d66130602473ca592123f99e79d756aed36357f53e0d4239696a5",
    "trt021@email.latech.edu"
);




