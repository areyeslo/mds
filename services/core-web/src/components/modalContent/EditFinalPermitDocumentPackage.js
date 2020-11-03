import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Popconfirm } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import NOWDocuments from "../noticeOfWork/applications/NOWDocuments";

const propTypes = {
  documents: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  finalDocuments: PropTypes.arrayOf(PropTypes.strings).isRequired,
  onSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export const EditFinalPermitDocumentPackage = (props) => {
  const [selectedCoreRows, setSelectedCoreRows] = useState(props.finalDocuments);
  return (
    <div>
      <NOWDocuments
        documents={props.documents}
        isViewMode
        selectedRows={{ selectedCoreRows, setSelectedCoreRows }}
      />
      <br />
      <div className="right center-mobile padding-md--top">
        <Popconfirm
          placement="topRight"
          title="Are you sure you want to cancel?"
          onConfirm={props.closeModal}
          okText="Yes"
          cancelText="No"
        >
          <Button className="full-mobile">Cancel</Button>
        </Popconfirm>
        <Button
          className="full-mobile"
          type="primary"
          onClick={() => props.onSubmit(selectedCoreRows)}
        >
          <DownloadOutlined className="padding-small--right icon-sm" />
          Save Application Package
        </Button>
      </div>
    </div>
  );
};

EditFinalPermitDocumentPackage.propTypes = propTypes;
export default EditFinalPermitDocumentPackage;
