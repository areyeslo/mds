import React from "react";
import PropTypes from "prop-types";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Input } from "antd";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

/**
 * @constant  RenderRichTextField - Ant Design `Input` autosize component for redux-form. (useful for notes/description)
 */

const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  input: PropTypes.objectOf(PropTypes.any).isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  meta: PropTypes.objectOf(PropTypes.any).isRequired,
  disabled: PropTypes.bool,
  minRows: PropTypes.number,
};

const defaultProps = {
  placeholder: "",
  label: "",
  disabled: false,
  minRows: 3,
};

const RenderRichTextField = (props) => (
  <Form.Item
    label={props.label}
    placeholder={props.placeholder}
    validateStatus={
      props.meta.touched ? (props.meta.error && "error") || (props.meta.warning && "warning") : ""
    }
    help={
      props.meta.touched &&
      ((props.meta.error && <span>{props.meta.error}</span>) ||
        (props.meta.warning && <span>{props.meta.warning}</span>))
    }
  >
    <CKEditor
        disabled={props.disabled}
        id={props.id}
        editor={ ClassicEditor }
        data={props.input.value}
        onChange={ ( event, editor ) => {
          const data = editor.getData();
          props.input.onChange(data);
        } }
        onBlur={ ( event, editor ) => {
          const data = editor.getData();
          props.input.onChange(data);
        } }
    />
  </Form.Item>
);

RenderRichTextField.propTypes = propTypes;
RenderRichTextField.defaultProps = defaultProps;

export default RenderRichTextField;
