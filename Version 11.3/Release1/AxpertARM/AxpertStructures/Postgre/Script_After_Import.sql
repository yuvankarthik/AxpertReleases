<<
INSERT INTO executeapidef (executeapidefid, cancel, sourceid, mapname, username, modifiedon, createdby, createdon, wkid, app_level, app_desc, app_slevel, cancelremarks, wfroles, execapidefname, execapiurl, execapiparameterstring, execapiheaderstring, execapirequeststring, execapimethod, execapibasedon, stype, execapiform, execapitransid, execapifilterstring, execapilprintformnames, execapiformattachments, execapiiview, execapiiviewname, execapiiparams, sql_editor_execapisqltext, apicategory, apiresponsetype, apiresponseformat, execapibodyparamstring, execapiauthstring) VALUES(1886660000000, 'F', 0, NULL, 'admin', '2024-01-10', 'admin', '2024-01-10', NULL, 1, 1, 0, NULL, NULL, 'PeriodicNotification', 'NA', NULL, NULL, NULL, 'Post', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'NA', 'Axpert', 'JSON', NULL, NULL);
>>


<<
UPDATE axdirectsql SET sqltext='select id,caption,source from(
select  regexp_split_to_table(get_sql_columns(sqltext),'','')  id,regexp_split_to_table(get_sql_columns(sqltext),'','') caption,''Data source'' source,1 ord 
from axdirectsql a 
where ''2'' = :dtlsrccnd and sqlname = :dtldsrctmp 
union all
select fname,caption,''Form'',2 ord from axpflds where dcname = :griddcno and ''1'' = :dtlsrccnd and tstruct = :ftransid and savevalue=''T''
  union all
  select fname,caption,''Form'',2 ord from axpflds where asgrid=''F'' and ''3'' = :dtlsrccnd and tstruct = :ftransid 
union all
select db_varname,db_varcaption,''Axvars'' ,3 ord from axpdef_axvars_dbvar a,axpdef_axvars b
where b.axpdef_axvarsid=a.axpdef_axvarsid 
union all
select regexp_split_to_table(''username,usergroup'','',''),regexp_split_to_table(''Login username,User role'','',''),''App vars'' ,4 ord from dual
union all
select fname,caption,''Glovar'',5 ord from axpflds where tstruct=''axglo''
order by 4,1)a' where sqlname='Fast_Print_Detail' ;
>>


<<
alter table axusergroups add selfregistration varchar(10);
>>


<<
ALTER TABLE axusergroups ADD approvedby varchar(2000);
>>


<<
ALTER TABLE axusergroups ADD apprequired varchar(1) ;
>>


<<
INSERT INTO axoutqueuesmst (axoutqueuesmstid, cancel, sourceid, mapname, username, modifiedon, createdby, createdon, wkid, app_level, app_desc, app_slevel, cancelremarks, wfroles, axqueuename, axqueuedesc, defqueue) VALUES(1551110000000, 'F', 0, NULL, 'admin', '2023-08-25 11:18:27.000', 'admin', '2023-08-25 10:37:19.000', NULL, 1, 1, NULL, NULL, NULL, 'Data out queue', 'This default queue will export data from axpert and can be consumed from other applications', 'T');
INSERT INTO axoutqueuesmst (axoutqueuesmstid, cancel, sourceid, mapname, username, modifiedon, createdby, createdon, wkid, app_level, app_desc, app_slevel, cancelremarks, wfroles, axqueuename, axqueuedesc, defqueue) VALUES(1550990000000, 'F', 0, NULL, 'admin', '2023-08-23 15:18:26.000', 'admin', '2023-08-23 15:18:26.000', NULL, 1, 1, NULL, NULL, NULL, 'Notification queue', 'This default queue will be used for notifications', 'T');
INSERT INTO axoutqueuesmst (axoutqueuesmstid, cancel, sourceid, mapname, username, modifiedon, createdby, createdon, wkid, app_level, app_desc, app_slevel, cancelremarks, wfroles, axqueuename, axqueuedesc, defqueue) VALUES(1805660000000, 'F', 0, NULL, 'admin', '2024-01-25 15:33:26.000', 'admin', '2024-01-25 15:33:26.000', NULL, 1, 1, NULL, NULL, NULL, 'Cached save queue', 'This is default queue used for forms cached saving ', 'F');
>>


<<
INSERT INTO axinqueues (axinqueuesid, cancel, sourceid, mapname, username, modifiedon, createdby, createdon, wkid, app_level, app_desc, app_slevel, cancelremarks, wfroles, axqueuename, axqueuedesc, active, unameui, uname, secretkey, defqueu) VALUES(1765880000000, 'F', 0, NULL, 'admin', '2023-12-14 22:11:29.000', 'admin', '2023-12-14 22:11:29.000', NULL, 1, 1, NULL, NULL, NULL, 'Rapid Save queue', 'This queue will push data into Axpert.', 'T', '-(admin)', 'admin', '1859934293828630', 'T');
INSERT INTO axinqueues (axinqueuesid, cancel, sourceid, mapname, username, modifiedon, createdby, createdon, wkid, app_level, app_desc, app_slevel, cancelremarks, wfroles, axqueuename, axqueuedesc, active, unameui, uname, secretkey, defqueu) VALUES(1540880000000, 'F', 0, NULL, 'admin', '2024-01-25 15:56:55.000', 'admin', '2023-07-31 09:51:04.000', NULL, 1, 1, NULL, NULL, NULL, 'Data import queue', 'This queue will import data into a given Db table in this application. The response will be given in DBTableImportResponse Queue.', 'T', '-(admin)', 'admin', '1112008377507290', 'T');
INSERT INTO axinqueues (axinqueuesid, cancel, sourceid, mapname, username, modifiedon, createdby, createdon, wkid, app_level, app_desc, app_slevel, cancelremarks, wfroles, axqueuename, axqueuedesc, active, unameui, uname, secretkey, defqueu) VALUES(1540770000000, 'F', 0, NULL, 'admin', '2024-01-25 15:57:10.000', 'admin', '2023-07-31 09:50:40.000', NULL, 1, 1, NULL, NULL, NULL, 'Import broker queue', 'This queue will push data into Axpert. The result is pushed into RapidSaveResponse Queue. The request may contain file upload fields. In this case, the value will be a byte array. This will be stored into Axpert as per definition. Further, a request JSON may have a node named "PrintRequest" with print form names as value for this node. If this is present, the request response JSON will contain the requested print form in the requested file format as byte arrays.', 'T', '-(admin)', 'admin', '1269162265196150', 'T');
>>


<<
update axinqueues set defqueu='F';
>>


<<
update axinqueues set defqueu ='T' where axqueuename in('Data import queue','Import broker queue','Rapid Save queue');
>>


<<
update axoutqueuesmst set defqueue='F';
>>


<<
update axoutqueuesmst set defqueue ='T' where axqueuename in('Data out queue','Notification queue');
>>

