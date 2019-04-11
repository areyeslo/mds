/**
Repetable migrations to manage database indexes.

Indexes are grouped by table names alphabetically.
**/

/* Applications */
CREATE INDEX IF NOT EXISTS application_mine_guid_fkey_idx ON application(mine_guid);

/* Mine */
CREATE INDEX IF NOT EXISTS active_mine_mine_region_fkey_idx ON mine(mine_region, deleted_ind) WHERE (deleted_ind = false);

/* Mine expected document */
CREATE INDEX IF NOT EXISTS active_mine_expected_document_mine_guid_fkey_idx ON mine_expected_document(mine_guid, active_ind) WHERE (active_ind = true);
CREATE INDEX IF NOT EXISTS active_mine_expected_document_req_document_guid_fkey_idx ON mine_expected_document(req_document_guid, active_ind) WHERE (active_ind = true);

/* Mine Location */
DROP INDEX IF EXISTS mine_location_lat_long_idx;
DROP INDEX IF EXISTS mine_location_geom_idx;

/* Mine party appt */
DROP INDEX IF EXISTS mine_party_appt_guid_idx;
CREATE INDEX IF NOT EXISTS mine_party_appt_mine_guid_fkey_idx ON mine_party_appt(mine_guid);
CREATE INDEX IF NOT EXISTS mine_party_appt_party_guid_fkey_idx ON mine_party_appt(party_guid);
CREATE INDEX IF NOT EXISTS mine_party_appt_mine_party_appt_type_code_fkey_idx ON mine_party_appt(mine_party_appt_type_code);
CREATE INDEX IF NOT EXISTS mine_party_appt_mine_guid_permit_guid_fkey_idx ON mine_party_appt(mine_guid, permit_guid);
CREATE INDEX IF NOT EXISTS mine_party_appt_mine_tsf_guid_mine_guid_fkey_idx ON mine_party_appt(mine_tailings_storage_facility_guid,mine_guid);

/* Mine Type */
DROP INDEX IF EXISTS mine_type_tenure_type_code_idx;
DROP INDEX IF EXISTS mine_type_tenure_type_id_idx;
DROP INDEX IF EXISTS mine_type_update_timestamp_idx;
CREATE INDEX IF NOT EXISTS active_mine_type_mine_tenure_type_code_fkey_idx ON mine_type(mine_tenure_type_code, active_ind) WHERE (active_ind = true);

/* Party */
CREATE INDEX IF NOT EXISTS active_party_sub_division_code_fkey_idx ON party(sub_division_code, deleted_ind) WHERE (deleted_ind = false);
CREATE INDEX IF NOT EXISTS active_party_address_type_code_fkey_idx ON party(address_type_code, deleted_ind) WHERE (deleted_ind = false);
CREATE INDEX IF NOT EXISTS active_party_party_type_code_fkey_idx ON party(party_type_code, deleted_ind) WHERE (deleted_ind = false);

/* Permit */
CREATE INDEX IF NOT EXISTS permit_permit_status_code_fkey_idx ON permit(permit_status_code);

/* Permit amendment */
CREATE INDEX IF NOT EXISTS active_permit_amendment_permit_fkey_idx ON permit_amendment(permit_id, deleted_ind) WHERE (deleted_ind = false);
CREATE INDEX IF NOT EXISTS active_permit_amendment_permit_amendment_status_code_fkey_idx ON permit_amendment(permit_amendment_status_code, deleted_ind) WHERE (deleted_ind = false);
CREATE INDEX IF NOT EXISTS active_permit_amendment_permit_amendment_type_code_fkey_idx ON permit_amendment(permit_amendment_type_code, deleted_ind) WHERE (deleted_ind = false);