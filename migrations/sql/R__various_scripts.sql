CREATE OR REPLACE FUNCTION refresh_permit_no_from_mms() RETURNS void AS $$
    BEGIN
    DECLARE
        nrows int;
    BEGIN
        with nrows as (
                update permit p
                    set permit_no = m.permit_no
                from etl_permit e
                    inner join mms.mmspmt m on e.permit_cid = m.cid
                where e.permit_guid = p.permit_guid
                    and m.permit_no != p.permit_no
            RETURNING 1
            )
        RAISE NOTICE '....# of permit rows changed.. %', nrows;

    END;
$$ LANGUAGE plpgsql;
