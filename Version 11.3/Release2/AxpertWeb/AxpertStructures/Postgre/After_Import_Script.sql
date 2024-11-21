<<
CREATE OR REPLACE FUNCTION trg_axprocessdefv2()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
    declare 
   	v_rem_esc_sfrom varchar;
   	v_rem_esc_taskparam varchar;
   	
    begin
	    
	   select string_agg(sfrom,',') into v_rem_esc_sfrom  from (
    select distinct regexp_split_to_table(new.rem_esc_startfrom,',') sfrom)a;
   
   select string_agg(fname, ',') from (select	substring(unnest(string_to_array( v_rem_esc_sfrom , ',')), position('-(' in unnest(string_to_array( v_rem_esc_sfrom , ',')))+ 2, abs((position('-(' in unnest(string_to_array( v_rem_esc_sfrom , ',')))+ 2) - length(substring(unnest(string_to_array( v_rem_esc_sfrom , ',')), 1, length(unnest(string_to_array( v_rem_esc_sfrom , ',')))))))fname where v_rem_esc_sfrom is not null) a
    into v_rem_esc_taskparam;

        IF (TG_OP = 'INSERT')   THEN
		
        if length(v_rem_esc_taskparam)>2 then 
		new.taskparamsui = concat(new.taskparamsui,',',v_rem_esc_sfrom);
		new.taskparams=concat(new.taskparams,',',v_rem_esc_taskparam);
		end if;
		return new;
	end if;
		
		IF (TG_OP = 'UPDATE')  THEN
		if length(v_rem_esc_taskparam)>2 then 
		new.taskparamsui = concat(new.taskparamsui,',',v_rem_esc_sfrom);
		new.taskparams=concat(new.taskparams,',',v_rem_esc_taskparam);
	end if;
		
		return new;
	end if;

	
	
end; 
$function$
;
>>
