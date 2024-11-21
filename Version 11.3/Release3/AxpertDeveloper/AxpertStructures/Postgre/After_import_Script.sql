<<
drop view vw_axlanguage_export;
>>


<<
CREATE OR REPLACE VIEW vw_axlanguage_export
AS SELECT 'tstruct'::text AS comptype,
    0 AS ord,
    axpdef_tstruct.ntransid,
    'x__headtext'::character varying AS compname,
    axpdef_tstruct.caption,
    0 AS ord2,
    0 AS ord3,
    'NA'::text AS hidden
   FROM axpdef_tstruct
UNION ALL
 SELECT 'tstruct'::text AS comptype,
    1 AS ord,
    vw_dc.transid AS ntransid,
    vw_dc.name AS compname,
    vw_dc.caption,
    "substring"(vw_dc.name::text, 3)::numeric AS ord2,
    "substring"(vw_dc.name::text, 3)::numeric AS ord3,
    'NA'::text AS hidden
   FROM vw_dc
UNION ALL
 SELECT 'tstruct'::text AS comptype,
    2 AS ord,
    vw_field_informations.transid AS ntransid,
    concat('lbl', vw_field_informations.name) AS compname,
    vw_field_informations.caption,
    "substring"(vw_field_informations.dcname::text, 3)::numeric AS ord2,
    vw_field_informations.fldordno AS ord3,
        CASE
            WHEN vw_field_informations.hidden = 'TRUE'::text THEN 'Yes'::text
            ELSE 'No'::text
        END AS hidden
   FROM vw_field_informations
UNION ALL
 SELECT 'tstruct'::text AS comptype,
    4 AS ord,
    axtoolbar.name AS ntransid,
    axtoolbar.key AS compname,
    axtoolbar.title AS caption,
    '100'::numeric AS ord2,
    axtoolbar.ordno AS ord3,
    'NA'::text AS hidden
   FROM axtoolbar
  WHERE axtoolbar.stype::text = 'tstruct'::text
UNION ALL
 SELECT 'tstruct'::text AS comptype,
    5 AS ord,
    b.ntransid,
    a.ctype AS compname,
    a.ccaption AS caption,
    a.ord AS ord2,
    0 AS ord3,
    'NA'::text AS hidden
   FROM ( SELECT 'pop1'::text AS ctype,
            'Remove'::text AS ccaption,
            10001 AS ord
        UNION ALL
         SELECT 'pop2'::text AS text,
            'Print'::text AS text,
            10002
        UNION ALL
         SELECT 'pop3'::text AS text,
            'Preview'::text AS text,
            10003
        UNION ALL
         SELECT 'pop4'::text AS text,
            'Regenerate Packets'::text AS text,
            10004
        UNION ALL
         SELECT 'pop5'::text AS text,
            'View History'::text AS text,
            10005
        UNION ALL
         SELECT 'lpop1'::text AS text,
            'Remove'::text AS text,
            10006
        UNION ALL
         SELECT 'lpop2'::text AS text,
            'Print'::text AS text,
            10007
        UNION ALL
         SELECT 'lpop3'::text AS text,
            'Preview'::text AS text,
            10008
        UNION ALL
         SELECT 'lpop4'::text AS text,
            'Params'::text AS text,
            10009
        UNION ALL
         SELECT 'lpop5'::text AS text,
            'Preview Form'::text AS text,
            10010
        UNION ALL
         SELECT 'lpop6'::text AS text,
            'Print Form'::text AS text,
            10011
        UNION ALL
         SELECT 'lpop7'::text AS text,
            'PDF'::text AS text,
            10012
        UNION ALL
         SELECT 'lpop8'::text AS text,
            'Regenerate Packets'::text AS text,
            10013
        UNION ALL
         SELECT 'lpop9'::text AS text,
            'Save As'::text AS text,
            10014
        UNION ALL
         SELECT 'lpop10'::text AS text,
            'To XL'::text AS text,
            10015
        UNION ALL
         SELECT 'lpop11'::text AS text,
            'Rapid XL Export'::text AS text,
            10016
        UNION ALL
         SELECT 'lpop12'::text AS text,
            'View Attachment'::text AS text,
            10017
        UNION ALL
         SELECT 'lblSearh'::text AS text,
            'Search For'::text AS text,
            10018
        UNION ALL
         SELECT 'lblWith'::text AS text,
            'With'::text AS text,
            10019) a,
    axpdef_tstruct b
UNION ALL
 SELECT 'axpages'::text AS comptype,
    axpages.levelno AS ord,
    NULL::character varying AS ntransid,
    axpages.name AS compname,
    axpages.caption,
    axpages.ordno AS ord2,
    0 AS ord3,
    'NA'::text AS hidden
   FROM axpages
UNION ALL
 SELECT 'iview'::text AS comptype,
    0 AS ord,
    dwb_iviews.name AS ntransid,
    'x__head'::character varying AS compname,
    dwb_iviews.caption,
    1 AS ord2,
    0 AS ord3,
    'NA'::text AS hidden
   FROM dwb_iviews
UNION ALL
 SELECT 'iview'::text AS comptype,
    1 AS ord,
    dwb_iviewmain.iname AS ntransid,
    'RH1'::character varying AS compname,
    dwb_iviewmain.header1 AS caption,
    2 AS ord2,
    0 AS ord3,
    'NA'::text AS hidden
   FROM dwb_iviewmain
UNION ALL
 SELECT 'iview'::text AS comptype,
    2 AS ord,
    dwb_iviewparams.iname AS ntransid,
    dwb_iviewparams.pname AS compname,
    dwb_iviewparams.pcaption AS caption,
    dwb_iviewparams.ordno AS ord2,
    0 AS ord3,
    'NA'::text AS hidden
   FROM dwb_iviewparams
UNION ALL
 SELECT 'iview'::text AS comptype,
    3 AS ord,
    dwb_iviewcols.iname AS ntransid,
    dwb_iviewcols.f_name AS compname,
    dwb_iviewcols.f_caption AS caption,
    dwb_iviewcols.ordno AS ord2,
    0 AS ord3,
    'NA'::text AS hidden
   FROM dwb_iviewcols
UNION ALL
 SELECT 'iview'::text AS comptype,
    4 AS ord,
    axtoolbar.name AS ntransid,
    axtoolbar.key AS compname,
    axtoolbar.title AS caption,
    axtoolbar.ordno AS ord2,
    0 AS ord3,
    'NA'::text AS hidden
   FROM axtoolbar
  WHERE axtoolbar.stype::text = 'iview'::text
UNION ALL
 SELECT 'iview'::text AS comptype,
    5 AS ord,
    b.name AS ntransid,
    a.ctype AS compname,
    a.ccaption AS caption,
    a.ord AS ord2,
    0 AS ord3,
    'NA'::text AS hidden
   FROM dwb_iviews b,
    ( SELECT 'anac1'::text AS ctype,
            'Column Heading'::text AS ccaption,
            1 AS ord
        UNION ALL
         SELECT 'anac2'::text AS text,
            'Operator'::text AS text,
            2
        UNION ALL
         SELECT 'anac3'::text AS text,
            'Value (s)'::text AS text,
            3
        UNION ALL
         SELECT 'anac4'::text AS text,
            'Relations'::text AS text,
            4
        UNION ALL
         SELECT 'pop1'::text AS text,
            'Delete'::text AS text,
            5
        UNION ALL
         SELECT 'pop2'::text AS text,
            'New'::text AS text,
            6
        UNION ALL
         SELECT 'pop3'::text AS text,
            'Params'::text AS text,
            7
        UNION ALL
         SELECT 'pop4'::text AS text,
            'Preview Form'::text AS text,
            8
        UNION ALL
         SELECT 'pop5'::text AS text,
            'Print Form'::text AS text,
            9
        UNION ALL
         SELECT 'pop6'::text AS text,
            'PDF'::text AS text,
            10
        UNION ALL
         SELECT 'pop7'::text AS text,
            'Regenerate Packets'::text AS text,
            11
        UNION ALL
         SELECT 'pop8'::text AS text,
            'Save As'::text AS text,
            12
        UNION ALL
         SELECT 'pop9'::text AS text,
            'To XL'::text AS text,
            13
        UNION ALL
         SELECT 'pop10'::text AS text,
            'Rapid XL Export'::text AS text,
            14
        UNION ALL
         SELECT 'pop11'::text AS text,
            'View Attachment'::text AS text,
            15) a;
>>


<<
CREATE OR REPLACE VIEW v_genmap
AS SELECT a.stransid,
    a.name,
    a.caption,
    a.dcname,
    a.targettstruct,
    a.basedondc,
    a.controlfieldname,
    a.schemaoftarget,
    a.onpost,
    a.purpose,
        CASE
            WHEN a.active::text = 'T'::text THEN 'TRUE'::text
            ELSE 'FALSE'::text
        END AS active,
        CASE
            WHEN a.onapprove::text = 'T'::text THEN 'TRUE'::text
            ELSE 'FALSE'::text
        END AS onapprove,
        CASE
            WHEN a.onreject::text = 'T'::text THEN 'TRUE'::text
            ELSE 'FALSE'::text
        END AS onreject,
    string_agg((((((((((b.sourcefrom::text || ','::text) || COALESCE(b.source, ''::character varying)::text) || ','::text) || COALESCE(b.fsource, ''::character varying)::text) || ','::text) || b.sourcedcasgrid::text) || ','::text) || b.targetfield::text) || ','::text) || b.targetrow, '$'::text ORDER BY b.axpdef_genmapdtlrow) AS mapping,
    c.rowcontrol,
    a.targettrasid,
    a.groupfield,
    c.rowcontrol AS jjj
   FROM axpdef_genmap a
     LEFT JOIN axpdef_genmapdtl b ON a.axpdef_genmapid = b.axpdef_genmapid
     LEFT JOIN ( SELECT c_1.axpdef_genmapid,
            string_agg(concat(c_1.rtargetrow, ',', c_1.rowcontrolfield), '$'::text) AS rowcontrol
           FROM axpdef_genmaprowctrl c_1
          GROUP BY c_1.axpdef_genmapid) c ON a.axpdef_genmapid = c.axpdef_genmapid
  GROUP BY a.name, a.caption, a.dcname, a.targettstruct, a.basedondc, a.stransid, a.controlfieldname, a.schemaoftarget, a.onpost, a.purpose, a.active, a.onapprove, a.onreject, c.rowcontrol, a.targettrasid, a.groupfield;
>>


<<
CREATE OR REPLACE VIEW vw_dc
AS SELECT a.stransid AS transid,
    a.name,
    a.caption,
    a.tablename,
        CASE
            WHEN a.asgrid::text = 'F'::text THEN 'FALSE'::text
            ELSE 'TRUE'::text
        END AS asgrid,
        CASE
            WHEN a.allowchange::text = 'F'::text THEN 'FALSE'::text
            ELSE 'TRUE'::text
        END AS allowchange,
        CASE
            WHEN a.allowempty::text = 'F'::text THEN 'FALSE'::text
            ELSE 'TRUE'::text
        END AS allowempty,
        CASE
            WHEN a.adddcrows::text = 'F'::text THEN 'FALSE'::text
            ELSE 'TRUE'::text
        END AS adddcrows,
        CASE
            WHEN a.deletedcrows::text = 'F'::text THEN 'FALSE'::text
            ELSE 'TRUE'::text
        END AS deletedcrows,
        CASE
            WHEN a.popup::text = 'F'::text THEN 'FALSE'::text
            ELSE 'TRUE'::text
        END AS popup,
    a.purpose,
        CASE
            WHEN a.booleandc::text = 'T'::text THEN 'TRUE'::text
            ELSE 'FALSE'::text
        END AS booleandc,
    a.defaultstate
   FROM axpdef_dc a
  ORDER BY a.ctdc;
>>

