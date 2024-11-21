<<
ALTER TABLE axpdef_jobs ALTER COLUMN createdon TYPE timestamp USING createdon::timestamp;
>>


<<
ALTER TABLE axpdef_jobs ALTER COLUMN modifiedon TYPE timestamp USING modifiedon::timestamp;
>>
