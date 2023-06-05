import React from "react";
import { Filter } from "../types/Filter";
import { Modal } from "semantic-ui-react";

type FilterSummaryProps = {
  visible: boolean;
  onClose: () => void;
  filters: Filter[];
};

export const FilterSummary = ({ visible, filters, onClose }: FilterSummaryProps) => {
  return (
    <Modal
      style={{
        width: "400px",
        height: "250px",
        padding: "10px",
        top: "10%",
      }}
      open={visible}
      size="large"
      header="Score Filter(s) Added"
      onClose={onClose}
      content={
        <div className="d-flex align-items-center ">
          <table>
            {filters.map((filter) => (
              <tr>
                <td className="col">{filter.name}</td>
                <td className="col">{filter.type}</td>
                <td className="col">{filter.scoreType}</td>
              </tr>
            ))}
          </table>
        </div>
      }
      actions={["Ok"]}
    />
  );
};
