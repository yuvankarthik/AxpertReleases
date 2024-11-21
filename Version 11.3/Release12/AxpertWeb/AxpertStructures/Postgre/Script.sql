<< drop view axp_appsearch; >> 




<< ALTER TABLE axuseraccess ALTER COLUMN rname TYPE varchar(50) USING rname::varchar(50); >>



<< CREATE OR REPLACE VIEW axp_appsearch
AS SELECT DISTINCT a.searchtext,
    a.params::text ||
        CASE
            WHEN a.params IS NOT NULL AND lower(a.params::text) !~~ '%~act%'::text THEN '~act=load'::text
            ELSE NULL::text
        END AS params,
    a.hltype,
    a.structname,
    a.username
   FROM ( SELECT s.slno,
            s.searchtext,
            s.params,
            s.hltype,
            s.structname,
            lg.username
           FROM axp_appsearch_data_new s,
            axuseraccess a_1,
            axusergroups g,
            axuserlevelgroups lg
          WHERE a_1.sname::text = s.structname::text AND a_1.rname::text = g.userroles::text AND g.groupname::text = lg.usergroup::text AND (a_1.stype::text = ANY (ARRAY['t'::character varying::text, 'i'::character varying::text]))
          GROUP BY s.searchtext, s.params, s.hltype, s.structname, lg.username, s.slno
        UNION
         SELECT b.slno,
            b.searchtext,
            b.params,
            b.hltype,
            b.structname,
            lg.username
           FROM axuserlevelgroups lg,
            ( SELECT DISTINCT s.searchtext,
                    s.params,
                    s.hltype,
                    s.structname,
                    0 AS slno
                   FROM axp_appsearch_data_new s
                     LEFT JOIN axuseraccess a_1 ON s.structname::text = a_1.sname::text AND (a_1.stype::text = ANY (ARRAY['t'::character varying::text, 'i'::character varying::text]))) b
          WHERE lg.usergroup::text = 'default'::text
  ORDER BY 1, 6) a; >>


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

