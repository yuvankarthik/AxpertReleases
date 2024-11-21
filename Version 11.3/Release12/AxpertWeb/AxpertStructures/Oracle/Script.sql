<< ALTER TABLE AXUSERACCESS MODIFY RNAME VARCHAR2(50); >>

<< CREATE TABLE axrequest (
    requestid VARCHAR2(100) NOT NULL,
    requestreceivedtime TIMESTAMP WITH TIME ZONE NULL,
    sourcefrom VARCHAR2(255) NULL,
    requeststring CLOB NULL,
    headers CLOB NULL,
    params CLOB NULL,
    authz VARCHAR2(255) NULL,
    contenttype VARCHAR2(150) NULL,
    contentlength VARCHAR2(10) NULL,
    host VARCHAR2(255) NULL,
    url CLOB NULL,
    endpoint VARCHAR2(255) NULL,
    requestmethod VARCHAR2(10) NULL,
    apiname VARCHAR2(255) NULL,
    username VARCHAR2(255) NULL,
    additionaldetails CLOB NULL,
    sourcemachineip VARCHAR2(255) NULL,
    CONSTRAINT axrequest_pkey PRIMARY KEY (requestid)
); >>


<< CREATE TABLE axresponse (
    responseid VARCHAR2(100) NOT NULL,
    responsesenttime TIMESTAMP WITH TIME ZONE NULL,
    statuscode NUMBER(4) NULL,
    responsestring CLOB NULL,
    headers CLOB NULL,
    contenttype VARCHAR2(150) NULL,
    contentlength VARCHAR2(10) NULL,
    errordetails CLOB NULL,
    endpoint VARCHAR2(255) NULL,
    requestmethod VARCHAR2(10) NULL,
    username VARCHAR2(255) NULL,
    additionaldetails CLOB NULL,
    requestid VARCHAR2(100) NULL,
    executiontime VARCHAR2(20) NULL,
    CONSTRAINT axresponse_pkey PRIMARY KEY (responseid),
    CONSTRAINT axresponse_requestid_fkey FOREIGN KEY (requestid) REFERENCES axrequest(requestid)
); >>
