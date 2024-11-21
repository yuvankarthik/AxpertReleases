<< ALTER TABLE axuseraccess MODIFY COLUMN rname varchar(50) NOT NULL; >>


<< CREATE TABLE axrequest (
    requestid VARCHAR(100) NOT NULL,
    requestreceivedtime TIMESTAMP NULL,
    sourcefrom VARCHAR(255) NULL,
    requeststring TEXT NULL,
    headers TEXT NULL,
    params TEXT NULL,
    authz VARCHAR(255) NULL,
    contenttype VARCHAR(150) NULL,
    contentlength VARCHAR(10) NULL,
    host VARCHAR(255) NULL,
    url TEXT NULL,
    endpoint VARCHAR(255) NULL,
    requestmethod VARCHAR(10) NULL,
    apiname VARCHAR(255) NULL,
    username VARCHAR(255) NULL,
    additionaldetails TEXT NULL,
    sourcemachineip VARCHAR(255) NULL,
    PRIMARY KEY (requestid)
); >>


<< CREATE TABLE axresponse (
    responseid VARCHAR(100) NOT NULL,
    responsesenttime TIMESTAMP NULL,
    statuscode INT NULL,
    responsestring TEXT NULL,
    headers TEXT NULL,
    contenttype VARCHAR(150) NULL,
    contentlength VARCHAR(10) NULL,
    errordetails TEXT NULL,
    endpoint VARCHAR(255) NULL,
    requestmethod VARCHAR(10) NULL,
    username VARCHAR(255) NULL,
    additionaldetails TEXT NULL,
    requestid VARCHAR(100) NULL,
    executiontime VARCHAR(20) NULL,
    PRIMARY KEY (responseid),
    FOREIGN KEY (requestid) REFERENCES axrequest(requestid)
); >>
