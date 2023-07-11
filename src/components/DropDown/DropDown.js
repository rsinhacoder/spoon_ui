import React from "react";

const DropDown = ({ options, onChange }) => {
  return (
    <select
      className="outline-0 bg-transparent text-sm lg:text-base cursor-pointer"
      onChange={onChange}
    >
      {options.map((data, index) => (
        <option value={data.value} key={index}>
          {data.label}
        </option>
      ))}
    </select>
  );
};

export default DropDown;
