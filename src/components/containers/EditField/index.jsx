import * as React from "react";

import "./styles.css";

const EditField = (props) => {
  
  const { label, placeholder } = props;

  return (
    <div className="editField">
      <div className="editFieldLabel">{label}</div>
      <input
        className="editFieldInput"
        type="text"
        placeholder={placeholder}
      />
    </div>
  );
}

export default EditField;
