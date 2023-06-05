import React, { useMemo } from "react";
import { Filter } from "../types/Filter";
import "semantic-ui-css/semantic.min.css";
import { Draggable } from "react-beautiful-dnd";
import { FilterType, ScoreType } from "../types/Synopsis";
import { Button, Icon, Input, Label, Modal, Select } from "semantic-ui-react";

type FilterRowProps = Filter & {
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string, type: FilterType, scoreType: ScoreType | null) => void;
};

const typeOptions = [
  { text: "Default", value: "Default" },
  { text: "Date", value: "Date" },
  { text: "Search", value: "Search" },
  { text: "Score", value: "Score" },
];

const scoreTypeOptions = [
  { text: "Average", value: "Average" },
  { text: "NPS", value: "NPS" },
  { text: "Threshold", value: "Threshold" },
];

export const FilterRow = ({
  id,
  order,
  name,
  type,
  scoreType,
  onDelete,
  onEdit,
}: FilterRowProps) => {
  const isScoreType = type === "Score";

  const isValid = useMemo(() => name !== "", [name]);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEdit(id, e.target.value, type, scoreType);
  };

  const onTypeChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: any) => {
    onEdit(id, name, data.value, isScoreType ? scoreType : null);
  };

  const onScoreTypeChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: any) => {
    onEdit(id, name, type, data.value);
  };

  return (
    <Draggable draggableId={`draggable-${order}`} index={order}>
      {(provided) => (
        <div
          className="d-flex align-items-center justify-content-around p-2 mb-2 bg-light rounded"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Icon bordered name="align justify" />
          <div>
            <Input
              placeholder="Filter Name..."
              value={name}
              onChange={onNameChange}
              required
              error={!isValid}
            />
            {!isValid && (
              <Label basic color="red" pointing="left" className="position-absolute">
                name is required
              </Label>
            )}
          </div>

          <Label size="large">Type</Label>
          <Select options={typeOptions} value={type} onChange={onTypeChange} />

          <div style={{ width: "125px" }}>
            <Button negative icon onClick={() => onDelete(id)}>
              <Icon name="trash" />
            </Button>
            {isScoreType && (
              <Modal
                style={{
                  width: "400px",
                  height: "250px",
                  padding: "10px",
                  top: "10%",
                }}
                size="small"
                trigger={
                  <Button icon>
                    <Icon name="setting" />
                  </Button>
                }
                header="Edit Filter"
                content={
                  <div className="d-flex align-items-center ">
                    <Label size="large">Score Type</Label>
                    <Select
                      options={scoreTypeOptions}
                      value={scoreType ?? undefined}
                      onChange={onScoreTypeChange}
                    />
                  </div>
                }
                actions={["Cancel", { key: "done", content: "Save", positive: true }]}
              />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
