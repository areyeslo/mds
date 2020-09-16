ALTER TABLE permit ADD COLUMN project_id varchar;

DROP VIEW IF EXISTS bond_view;
CREATE VIEW bond_view AS
SELECT
    *
FROM
    (
    SELECT
        bond.bond_id,
        amount,
        bond.bond_type_code,
        bond_type.description as "bond_type_description",
        bond.bond_status_code,
        bond_status.description as "bond_status_description",
        issue_date,
        note,
        closed_date,
        closed_note,
        payer_party_guid,
        party_name AS "payer_name",
        institution_city,
        institution_name,
        institution_postal_code,
        institution_province,
        institution_street,        
        permit_guid,
        permit_no,
        permit.project_id,
        reference_number,
        bond.update_timestamp,
        bond.update_user,
        'Yes' AS "is_current_record"
    FROM
        bond,
        party,
        permit,
        bond_permit_xref,
        bond_type,
        bond_status
    WHERE
        bond.payer_party_guid = party.party_guid
        AND permit.permit_id = bond_permit_xref.permit_id
        AND bond.bond_id = bond_permit_xref.bond_id
        AND bond.bond_type_code = bond_type.bond_type_code
        AND bond.bond_status_code = bond_status.bond_status_code        
    UNION ALL 
    SELECT
        bond_history.bond_id,
        amount,
        bond_history.bond_type_code,
        bond_type.description as "bond_type_description",
        bond_history.bond_status_code,
        bond_status.description as "bond_status_description",
        issue_date,
        note,
        closed_date,
        closed_note,        
        payer_party_guid,
        payer_name,
        institution_city,
        institution_name,
        institution_postal_code,
        institution_province,
        institution_street,        
        permit.permit_guid,
        permit.permit_no,
        permit.project_id,
        reference_number,
        bond_history.update_timestamp,
        bond_history.update_user,
        'No' AS "is_current_record"
    FROM
        bond_history,
        bond_type,
        bond_status,
        permit,
        bond_permit_xref
    WHERE
        bond_history.bond_type_code = bond_type.bond_type_code
        AND bond_history.bond_status_code = bond_status.bond_status_code
        AND permit.permit_id = bond_permit_xref.permit_id
        AND bond_history.bond_id = bond_permit_xref.bond_id
    ) AS bond_data
ORDER BY bond_id, is_current_record DESC;


ALTER TABLE bond drop column project_id;
ALTER TABLE bond_history drop column project_id;
ALTER TABLE reclamation_invoice drop column project_id;
