<< CREATE TABLE axrequest (
	requestid varchar(100) NOT NULL,
	requestreceivedtime timestamptz NULL,
	sourcefrom varchar(255) NULL,
	requeststring text NULL,
	headers text NULL,
	params text NULL,
	authz varchar(255) NULL,
	contenttype varchar(150) NULL,
	contentlength varchar(10) NULL,
	host varchar(255) NULL,
	url text NULL,
	endpoint varchar(255) NULL,
	requestmethod varchar(10) NULL,
        apiname varchar(255) NULL,
	username varchar(255) NULL,
	additionaldetails text NULL,
	sourcemachineip varchar(255) NULL,
	CONSTRAINT axrequest_pkey PRIMARY KEY (requestid)
); >>



<< CREATE TABLE axresponse (
	responseid varchar(100) NOT NULL,
	responsesenttime timestamptz NULL,
	statuscode int4 NULL,
	responsestring text NULL,
	headers text NULL,
	contenttype varchar(150) NULL,
	contentlength varchar(10) NULL,
	errordetails text NULL,
	endpoint varchar(255) NULL,
	requestmethod varchar(10) NULL,
	username varchar(255) NULL,
	additionaldetails text NULL,
	requestid varchar(100) NULL,
	executiontime varchar(20) NULL,
	CONSTRAINT axresponse_pkey PRIMARY KEY (responseid),
	CONSTRAINT axresponse_requestid_fkey FOREIGN KEY (requestid) REFERENCES axrequest(requestid)
); >>