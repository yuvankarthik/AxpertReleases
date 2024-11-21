<<
CREATE VIEW VW_PEGV2_PROCESSDEF_TREE AS 
  SELECT
    axprocessdefv2.processname,
    axprocessdefv2.taskname,
    axprocessdefv2.tasktype,
    axprocessdefv2.taskgroupname AS taskgroup,
    axprocessdefv2.active AS taskactive,
    axprocessdefv2.indexno,
    axprocessdefv2.groupwithprior AS details,
    axprocessdefv2.transid,
    axprocessdefv2.axprocessdefv2id AS recordid,
    axprocessdefv2.displayicon,
    axprocessdefv2.groupwithprior,
    axprocessdefv2.keyfield
FROM
    axprocessdefv2;
>>


<<

ALTER TABLE AXPROCESSDEFV2  ADD   applicability_tbl varchar2(4000);

>>


<<
INSERT INTO EXECUTEAPIDEF (EXECUTEAPIDEFID, CANCEL, SOURCEID, MAPNAME, USERNAME, MODIFIEDON, CREATEDBY, CREATEDON, WKID, APP_LEVEL, APP_DESC, APP_SLEVEL, CANCELREMARKS, WFROLES, EXECAPIDEFNAME, EXECAPIURL, EXECAPIPARAMETERSTRING, EXECAPIHEADERSTRING, EXECAPIREQUESTSTRING, EXECAPIMETHOD, EXECAPIBASEDON, STYPE, EXECAPIFORM, EXECAPITRANSID, EXECAPIFILTERSTRING, EXECAPILPRINTFORMNAMES, EXECAPIFORMATTACHMENTS, EXECAPIIVIEW, EXECAPIIVIEWNAME, EXECAPIIPARAMS, SQL_EDITOR_EXECAPISQLTEXT, APICATEGORY, APIRESPONSETYPE, APIRESPONSEFORMAT, EXECAPIBODYPARAMSTRING, EXECAPIAUTHSTRING) VALUES(1202990000000, 'F', 0, NULL, 'admin', TIMESTAMP '2024-01-11 09:43:59.000000', 'admin', TIMESTAMP '2024-01-11 09:43:59.000000', NULL, 1, 1, 0, NULL, NULL, 'PeriodicNotification', 'NA', NULL, NULL, NULL, 'Post', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'NA', 'Axpert', 'JSON', NULL, NULL);
>>


<<
CREATE OR REPLACE FUNCTION fn_fastprint_formdatasql(ptransid varchar2)
RETURN varchar2
IS
v_fname varchar2(4000);
v_tablenames varchar2(4000);
v_dc1table varchar2(50);
v_finalqry nclob;
BEGIN
	SELECT listagg(tablename||'.'||fname,',')WITHIN GROUP(ORDER BY DCNAME,ORDNO) INTO v_fname FROM axpflds 
	WHERE TSTRUCT = ptransid AND ASGRID ='F' AND DATATYPE!='i' AND SAVEVALUE ='T' ;

	SELECT TABLENAME INTO v_dc1table FROM  axpdc WHERE TSTRUCT = ptransid and dcno =1;

	select  LISTAGG(CASE WHEN dcno=1 THEN tablename ELSE tablename||' on '||v_dc1table||'.'||v_dc1table||'id'||'='||tablename||'.'||v_dc1table||'id' END,' left join ')
	WITHIN group(ORDER BY DCNO) INTO v_tablenames
	FROM axpdc  e WHERE TSTRUCT = ptransid and ASGRID ='F';

v_finalqry := 'select '||v_fname||chr(10)||' from '||v_tablenames;

BEGIN
	
	EXECUTE IMMEDIATE 'select '||v_fname||chr(10)||' from '||v_tablenames;
EXCEPTION
WHEN OTHERS THEN 
	v_finalqry := 'select null na from dual';
END;

RETURN  v_finalqry;


END; 
>>


<<
UPDATE AXDIRECTSQL SET  SQLTEXT='select id,caption,source from(
select DISTINCT regexp_substr(get_sql_columns( sqltext),''[^,]+'',1,level) id,regexp_substr(get_sql_columns( sqltext),''[^,]+'',1,level) caption,''Data source'' source,1 ord 
from 	axdirectsql where ''2'' = :dtlsrccnd and sqlname = :dtldsrctmp 
connect by regexp_substr(get_sql_columns( sqltext),''[^,]+'',1,level) is not null  
 union all
 select fname,caption,''form'',2 ord from axpflds where asgrid=''F'' and  :dtlsrccnd = ''3'' and tstruct = :ftransid and savevalue=''T''
union all
select fname,caption,''Form'',2 ord from axpflds where dcname = :griddcno  and :dtlsrccnd = ''1'' and tstruct = :ftransid 
union all
select db_varname,db_varcaption,''Axvars'' ,3 ord from axpdef_axvars_dbvar a,axpdef_axvars b
where b.axpdef_axvarsid=a.axpdef_axvarsid 
union all
select ''username'',''Login username'',''App vars'' ,4 ord from dual
union ALL
select ''usergroup'',''User role'',''App vars'' ,4 ord from dual
UNION all
select fname,caption,''Glovar'',5 ord from axpflds where tstruct=''axglo''
order by 4,1)a
' WHERE SQLNAME='Fast_Print_Detail';
>>


<<
alter table axusergroups add selfregistration varchar2(10);
>>


<<
ALTER TABLE axusergroups ADD approvedby varchar2(2000);
>>


<<
ALTER TABLE axusergroups ADD apprequired varchar2(1) ;
>>


<<
CREATE TABLE AXPROCESSDEF 
   (	AXPROCESSDEFID NUMBER(16,0) NOT NULL ENABLE, 
	CANCEL VARCHAR2(1), 
	SOURCEID NUMBER(16,0), 
	MAPNAME VARCHAR2(20), 
	USERNAME VARCHAR2(50), 
	MODIFIEDON TIMESTAMP (6), 
	CREATEDBY VARCHAR2(50), 
	CREATEDON TIMESTAMP (6), 
	WKID VARCHAR2(15), 
	APP_LEVEL NUMBER(3,0), 
	APP_DESC NUMBER(1,0), 
	APP_SLEVEL NUMBER(3,0), 
	CANCELREMARKS VARCHAR2(150), 
	WFROLES VARCHAR2(250), 
	PROCESSNAME VARCHAR2(500), 
	INDEXNO NUMBER(10,0), 
	TASKTYPE VARCHAR2(10), 
	TASKNAME VARCHAR2(500), 
	ASSIGNTOROLE VARCHAR2(4000), 
	FORMCAPTION VARCHAR2(500), 
	KEYFIELDCAPTION VARCHAR2(500), 
	KEYFIELD VARCHAR2(250), 
	DISPLAYTEMPLATE VARCHAR2(20), 
	EXP_EDITOR_APPLICABILITY VARCHAR2(20), 
	EXP_EDITOR_NEXTTASK VARCHAR2(20), 
	PRENOTIFY VARCHAR2(250), 
	POSTNOTIFY VARCHAR2(250), 
	ALLOWFORWARDTO VARCHAR2(4000), 
	MAXTIMEDAYS NUMBER(2,0), 
	MAXTIMEHR NUMBER(2,0), 
	MAXTIMEMM NUMBER(2,0), 
	MAXTIME VARCHAR2(20), 
	ESCALATION VARCHAR2(100), 
	EXCALATION_ROLE VARCHAR2(4000), 
	DATAFIELDS VARCHAR2(4000), 
	FORMDATACACHE VARCHAR2(10), 
	EXECMAPS VARCHAR2(2000), 
	TRANSID VARCHAR2(10), 
	TASKDESC VARCHAR2(20), 
	ACTIVE VARCHAR2(1));
>>


<<
CREATE UNIQUE INDEX AGLAXPROCESSDEFID ON AXPROCESSDEF (AXPROCESSDEFID) ;
>>



<<
INSERT INTO AXINQUEUES (AXINQUEUESID,CANCEL,SOURCEID,MAPNAME,USERNAME,MODIFIEDON,CREATEDBY,CREATEDON,WKID,APP_LEVEL,APP_DESC,APP_SLEVEL,CANCELREMARKS,WFROLES,AXQUEUENAME,AXQUEUEDESC,UNAMEUI,UNAME,SECRETKEY,ACTIVE,DEFQUEUE) VALUES (1540880000000,'F',0,NULL,'admin',TIMESTAMP '2024-01-25 15:58:43.000000','admin',TIMESTAMP '2023-12-22 19:01:07.000000',NULL,1,1,NULL,NULL,NULL,'Data import queue',TO_CLOB('This queue will import data into a given Db table in this application. The response will be given in DBTableImportResponse Queue.'),'-(admin)','admin','2120862005653640','T','T');
INSERT INTO AXINQUEUES (AXINQUEUESID,CANCEL,SOURCEID,MAPNAME,USERNAME,MODIFIEDON,CREATEDBY,CREATEDON,WKID,APP_LEVEL,APP_DESC,APP_SLEVEL,CANCELREMARKS,WFROLES,AXQUEUENAME,AXQUEUEDESC,UNAMEUI,UNAME,SECRETKEY,ACTIVE,DEFQUEUE) VALUES (1067440000000,'F',0,NULL,'admin',TIMESTAMP '2024-01-25 15:41:39.000000','admin',TIMESTAMP '2024-01-25 15:41:39.000000',NULL,1,1,NULL,NULL,NULL,'Import broker queue',TO_CLOB('This queue will import data into a given Db table in this application. The response will be given in DBTableImportResponse Queue.'),'-(admin)','admin','2651875635075515','T','T');
INSERT INTO AXINQUEUES (AXINQUEUESID,CANCEL,SOURCEID,MAPNAME,USERNAME,MODIFIEDON,CREATEDBY,CREATEDON,WKID,APP_LEVEL,APP_DESC,APP_SLEVEL,CANCELREMARKS,WFROLES,AXQUEUENAME,AXQUEUEDESC,UNAMEUI,UNAME,SECRETKEY,ACTIVE,DEFQUEUE) VALUES (1067770000000,'F',0,NULL,'admin',TIMESTAMP '2024-01-25 15:43:46.000000','admin',TIMESTAMP '2024-01-25 15:43:46.000000',NULL,1,1,NULL,NULL,NULL,'Rapid Save queue',TO_CLOB('This queue will push data into Axpert.'),'-(admin)','admin','3089632968313871','T','T');
>>


<<
INSERT INTO AXOUTQUEUESMST (AXOUTQUEUESMSTID,CANCEL,SOURCEID,MAPNAME,USERNAME,MODIFIEDON,CREATEDBY,CREATEDON,WKID,APP_LEVEL,APP_DESC,APP_SLEVEL,CANCELREMARKS,WFROLES,AXQUEUENAME,AXQUEUEDESC,DEFQUEUE) VALUES (1067990000000,'F',0,NULL,'admin',TIMESTAMP '2024-01-25 15:44:26.000000','admin',TIMESTAMP '2024-01-25 15:44:26.000000',NULL,1,1,NULL,NULL,NULL,'Cached save queue',TO_CLOB('This is default queue used for forms cached saving'),'T');
INSERT INTO AXOUTQUEUESMST (AXOUTQUEUESMSTID,CANCEL,SOURCEID,MAPNAME,USERNAME,MODIFIEDON,CREATEDBY,CREATEDON,WKID,APP_LEVEL,APP_DESC,APP_SLEVEL,CANCELREMARKS,WFROLES,AXQUEUENAME,AXQUEUEDESC,DEFQUEUE) VALUES (1551110000000,'F',0,NULL,'admin',TIMESTAMP '2023-12-22 19:03:38.000000','admin',TIMESTAMP '2023-12-22 19:03:38.000000',NULL,1,1,NULL,NULL,NULL,'Data out queue',TO_CLOB('This default queue will export data from axpert and can be consumed from other applications'),'T');
INSERT INTO AXOUTQUEUESMST (AXOUTQUEUESMSTID,CANCEL,SOURCEID,MAPNAME,USERNAME,MODIFIEDON,CREATEDBY,CREATEDON,WKID,APP_LEVEL,APP_DESC,APP_SLEVEL,CANCELREMARKS,WFROLES,AXQUEUENAME,AXQUEUEDESC,DEFQUEUE) VALUES (1550990000000,'F',0,NULL,'admin',TIMESTAMP '2023-12-22 19:03:40.000000','admin',TIMESTAMP '2023-12-22 19:03:40.000000',NULL,1,1,NULL,NULL,NULL,'Notification queue',TO_CLOB('This default queue will be used for notifications'),'T');
>>


<<
update AXINQUEUES set defqueue='F';
>>


<<
update AXINQUEUES set defqueue='T' where axqueuename in('Data import queue','Import broker queue','Rapid Save queue')
>>


<<
update AXOUTQUEUESMST set defqueue='F';
>>


<<
update AXOUTQUEUESMST set defqueue='T' where axqueuename in('Cached save queue','Data out queue','Notification queue')
>>


<<
update axfastlink set istemplate='T' where transid='axftp' and caption!='defaulttemplate';
>>

