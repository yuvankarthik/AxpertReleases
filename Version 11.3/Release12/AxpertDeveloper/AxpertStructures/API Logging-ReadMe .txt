API Logging axrequest &  axresponse table scripts :
--------------------------------------------------------------------------------
These tables need to be created in the both runtime schema & definition schema.

------------------
For Postgres: 
------------------

CREATE TABLE axrequest (
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
);



CREATE TABLE axresponse (
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
);



------------------
For Oracle: 
------------------

CREATE TABLE axrequest (
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
);

CREATE TABLE axresponse (
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
);



------------------
For MSSQL: 
------------------

CREATE TABLE axrequest (
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
);

CREATE TABLE axresponse (
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
);


------------------
For MYSQL: 
------------------
CREATE TABLE axrequest (
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
);

CREATE TABLE axresponse (
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
);



API Logging Table details:
--------------------------------------------------------------------------------

AxRequest Table:

 Column Name        	 Description                                                  
--------------------		--------------------------------------------------------------
 RequestID          	 Unique identifier for each API request.                      
 RequestReceivedTime     Date and time when the request was made.                     
 SourceFrom         	 Source application or entity invoking the API.               
 SourceMachineIP    	 IP address of the machine from which the request originated. 
 RequestString      	 The body of the request, if applicable (for POST requests).  
 Headers            	 HTTP headers sent with the request.                          
 Params             	 Parameters or query string included in the request URL.      
 Authz		      	 Authorization details (token, JWT, etc.) used for access.    
 Host               	 Hostname or IP of the server being accessed.                 
 URL                	 Full URL used to invoke the API.                             
 Endpoint                Name or identifier of the API method responded to.   
 RequestMethod     	 HTTP method used (GET, POST, PUT, DELETE, etc.).             
 ContentType		 Content type of the request body.
 ContentLength		 Length of the request body in bytes.                    
 User               	 User associated with the API request (if applicable).  
 APIName                 APIName / Purpose (Outbound, Inbound, FormNotify .., sent by client)      
 AdditionalDetails  	 Any other relevant details you want to capture.              
        


AxResponse Table:

 Column Name        	 Description                                                  
--------------------		--------------------------------------------------------------
 ResponseID   		 Unique identifier for each API response (linked to RequestID).
 ResponseSentTime        Date and time when the response was sent.                    
 StatusCode         	 HTTP status code returned by the API (200, 404, etc.).       
 ResponseString     	 The body of the response, if applicable.                     
 Headers            	 HTTP headers included in the response.                       
 ExecutionTime      	 Time taken to process the request and generate the response. 
 ErrorDetails       	 Details of any errors encountered (if applicable).           
 ContentType		 Content type of the response body.
 ContentLength		 Length of the response body in bytes.
 Endpoint                Name or identifier of the API method responded to.               
 RequestMethod     	 HTTP method used in the corresponding request.               
 User               	 User associated with the API request (if applicable).        
 AdditionalDetails  	 Any other relevant details you want to capture.              
       

