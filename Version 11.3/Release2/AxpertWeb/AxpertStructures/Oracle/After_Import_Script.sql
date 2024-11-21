<<
CREATE OR REPLACE TRIGGER trg_axprocessdefv2
BEFORE INSERT OR UPDATE ON axprocessdefv2 
REFERENCING NEW AS NEW OLD AS OLD
FOR EACH ROW
declare 
   	v_rem_esc_sfrom varchar2(4000);
   	v_rem_esc_taskparam varchar2(4000);
   	 
BEGIN 
	    
	   select listagg(sfrom,',') WITHIN GROUP (ORDER BY 1),
	   listagg(rtrim(substr(sfrom,INSTR(sfrom,'-(')+2),')'),',') 
	   WITHIN GROUP (ORDER BY 1)
		into v_rem_esc_sfrom,  v_rem_esc_taskparam	
		from 
	   (SELECT distinct TRIM(REGEXP_SUBSTR(:NEW.rem_esc_startfrom, '[^,]+', 1, LEVEL)) AS sfrom
		from dual 		
		CONNECT BY REGEXP_SUBSTR (:NEW.rem_esc_startfrom,'[^,]+',1,LEVEL) IS NOT NULL );
   
   

        IF INSERTING AND LENGTH(nvl(v_rem_esc_sfrom,'N')) > 2 
        THEN
		
		:new.taskparamsui := :new.taskparamsui||','||v_rem_esc_sfrom;
		:new.taskparams := :new.taskparams||','||v_rem_esc_taskparam;
		
		
		end if;
			
		IF UPDATING AND LENGTH(nvl(v_rem_esc_sfrom,'N')) > 2 
		THEN
		
		:new.taskparamsui := :new.taskparamsui||','||v_rem_esc_sfrom;
		:new.taskparams :=:new.taskparams||','||v_rem_esc_taskparam;
	
		
	
		end if;
end;
>>