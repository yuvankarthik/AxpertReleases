CREATE OR REPLACE FUNCTION fn_iview_advancesubtotal(piname character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
v_json varchar;
v_props varchar;

BEGIN  


SELECT json_build_object('type','table','colcount',count(*)::varchar,'rowcount','1','addrow','t','deleterow','t','valueseparator','|','rowseparator','~')  into v_props
FROM dwb_iviewcols where iname = piname;

with a as 
(
SELECT concat('"',ordno,'":{','"caption":"',f_caption,'","name":"',f_name,'","value":"","source":"","exp":"","vexp":""}')
FROM dwb_iviewcols where iname = piname
order by ordno
)
select concat('{"props":',v_props,',"columns":{',string_agg(concat,','),'}}')  into v_json from a;

 RETURN v_json;
 
END;
$function$
;
