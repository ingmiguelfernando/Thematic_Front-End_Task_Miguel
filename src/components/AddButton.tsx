import React, { useState } from "react";
import { SampleProps } from "../types/Synopsis";
import { Button, Popup } from "semantic-ui-react";

interface AddButtonProps {
  label: string;
  className?: string;
  options: SampleProps[];
  onAdd: (sampleHeader: string) => void;
}

export const AddButton = ({ label, options, onAdd, className }: AddButtonProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Popup
      className={"add-filter"}
      on="click"
      trigger={
        <Button
          className={className}
          icon="add"
          content={label}
          onClick={() => setOpen((prevOpen) => !prevOpen)}
        />
      }
      flowing
      open={open}
      wide
      position="bottom center"
    >
      <div className="d-flex flex-column">
        {options.map((option) => (
          <Popup
            flowing
            key={option.sampleHeader}
            hoverable
            wide
            position="right center"
            trigger={
              <Button
                className="m-1"
                compact
                key={option.sampleHeader}
                content={option.sampleHeader}
                onClick={() => onAdd(option.sampleHeader)}
              />
            }
          >
            <div
              className="d-block overflow-auto"
              key={option.sampleHeader}
              style={{
                maxWidth: "400px",
                maxHeight: "400px",
              }}
            >
              <p className="h-2">
                <strong>Sample Data</strong>
              </p>
              <ul>
                {option.sample.map((item, index) => (
                  <li key={`sample-${option.sampleHeader}-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          </Popup>
        ))}
      </div>
    </Popup>
  );
};
