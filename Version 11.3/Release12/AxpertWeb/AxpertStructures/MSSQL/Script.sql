<< ALTER TABLE axuseraccess ALTER COLUMN rname varchar(50) NOT NULL; >>


<< CREATE TABLE axrequest (
    requestid VARCHAR(100) NOT NULL,
    requestreceivedtime DATETIMEOFFSET NULL,
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
    CONSTRAINT axrequest_pkey PRIMARY KEY (requestid)
); >>


<< CREATE TABLE axresponse (
    responseid VARCHAR(100) NOT NULL,
    responsesenttime DATETIMEOFFSET NULL,
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
    CONSTRAINT axresponse_pkey PRIMARY KEY (responseid),
    CONSTRAINT axresponse_requestid_fkey FOREIGN KEY (requestid) REFERENCES axrequest(requestid)
); >>
