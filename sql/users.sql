CREATE DATABASE users;

use users;

/* Can use time stamps as primary key */
CREATE TABLE users (
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL,
    PRIMARY KEY (username)
);

<<<<<<< Updated upstream
INSERT INTO users
VALUES(
    "Robert",
    "327c670676944cb77685d7a2cc84b51852cd02c21f6e46cfe74a0091b6a4af7d",
    "rhm012@email.latech.edu"
=======
CREATE TABLE logs(
	logId int NOT NULL AUTO_INCREMENT,
    times TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    username  VARCHAR(255),
    password  VARCHAR(255),
    attemp    VARCHAR(255) NOT NULL,
    sessionTime VARCHAR(255) NOT NULL,
    PRIMARY KEY (logId)
);

/* INSERT INTO logs(username,password,attemp,sessionTime) VALUES 
{
    "bit",
    "bob",
    "f",
    "l"
};
 */
INSERT INTO users
VALUES(
    "Robert",
    "$2a$04$ZBcpPXMSGuV0CFmqO4ncDe/WxLLgrVnO9tZWlddBg9Fdk87TKyhwi",
    "rhm012@email.latech.edu",
    "IT"
>>>>>>> Stashed changes
);

INSERT INTO users
VALUES(
<<<<<<< Updated upstream
    "Middle Person",
    "d93006ec2e4339d770a7afd068c1f1e789a52df12f595e529fd0f302fc1e5ec7",
    "jmb156@email.latech.edu"
=======
    "Jalen",
    "$2a$04$ZBcpPXMSGuV0CFmqO4ncDenf2ouId/JQwsL0wnS7iJ1bRIUGbw9KW",
    "jmb156@email.latech.edu",
    "Manager"
>>>>>>> Stashed changes
);

INSERT INTO users
VALUES(
    "tugboat2k",
<<<<<<< Updated upstream
    "b3c95b46782d66130602473ca592123f99e79d756aed36357f53e0d4239696a5",
    "trt021@email.latech.edu"
=======
    "$2a$04$ZBcpPXMSGuV0CFmqO4ncDe8HiGyS9Na3971lcMt.cnt.V5i2bRuoO",
    "trt021@email.latech.edu",
    "Employee"
>>>>>>> Stashed changes
);




