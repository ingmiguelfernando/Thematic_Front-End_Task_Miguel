import _ from "lodash";
import Loading from "./Loading";
import { AddButton } from "./AddButton";
import { FilterRow } from "./FilterRow";
import { Filter } from "../types/Filter";
import useFilter from "../hooks/useFilter";
import { Button } from "semantic-ui-react";
import { FilterSummary } from "./FilterSummary";
import { useSynopsis } from "../hooks/useSynopsis";
import React, { useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { FilterType, SampleProps, ScoreType } from "../types/Synopsis";
import { withAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

const Filters = () => {
  const { filters, setFilters } = useFilter();
  const { error, isLoading, synopsis } = useSynopsis();
  const [unsavedFilters, setUnsavedFilters] = useState<Filter[]>([]);
  const [filterOptions, setFilterOptions] = useState<SampleProps[]>([]);
  const [scoreFiltersAdded, setScoreFiltersAdded] = useState<Filter[]>([]);
  const isDirty = useMemo(() => !_.isEqual(filters, unsavedFilters), [filters, unsavedFilters]);
  const isValid = useMemo(
    () => unsavedFilters.every((filter) => filter.name !== ""),
    [unsavedFilters]
  );

  useEffect(() => {
    if (isLoading) return;
    if (error) return;
    if (!synopsis) return;

    const filterOptions = synopsis.map((item) => {
      return {
        sample: item.sample,
        sampleHeader: item.sampleHeader,
      };
    });
    setFilterOptions(filterOptions);
  }, [synopsis, isLoading, error, setFilterOptions]);

  useEffect(() => {
    if (!filters) return;
    setUnsavedFilters(filters);
  }, [filters]);

  const onAddFilter = (sampleHeader: string) => {
    const newFilter: Filter = {
      id: Math.random().toString(36).slice(2, 11),
      name: sampleHeader,
      type: "Default",
      scoreType: null,
      order: unsavedFilters.length,
    };
    setUnsavedFilters((prevFilters) => [...prevFilters, newFilter]);
  };

  const onDeleteFilter = (id: string) => {
    setUnsavedFilters((prevFilters) => prevFilters.filter((filter) => filter.id !== id));
  };

  const onCancel = () => {
    setUnsavedFilters(filters);
  };

  const onSave = () => {
    const newScoreFilters = unsavedFilters.filter(
      (filter) => filter.type === "Score" && !filters.some((f) => f.id === filter.id)
    );
    if (newScoreFilters.length > 0) {
      setScoreFiltersAdded(newScoreFilters);
    }
    setFilters(unsavedFilters);
  };

  const onEdit = (id: string, name: string, type: FilterType, scoreType: ScoreType | null) => {
    setUnsavedFilters((prevFilters) => {
      const newFilters = [...prevFilters];
      const index = newFilters.findIndex((filter) => filter.id === id);
      newFilters[index] = {
        ...newFilters[index],
        name,
        type,
        scoreType,
      };
      return newFilters;
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(unsavedFilters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setUnsavedFilters(items);
  };

  return (
    <div>
      <AddButton label="Add Filter" options={filterOptions} onAdd={onAddFilter} className="mb-2" />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div className="filter-table" {...provided.droppableProps} ref={provided.innerRef}>
              {unsavedFilters.map((filter: Filter, index: number) => (
                <FilterRow
                  key={filter.id}
                  id={filter.id}
                  order={index}
                  name={filter.name}
                  type={filter.type}
                  scoreType={filter.scoreType}
                  onDelete={onDeleteFilter}
                  onEdit={onEdit}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="mt-4">
        <Button basic floated="right" onClick={onCancel} disabled={!isDirty}>
          Cancel
        </Button>
        <Button primary floated="right" onClick={onSave} disabled={!isDirty || !isValid}>
          Save
        </Button>
      </div>
      <FilterSummary
        filters={scoreFiltersAdded}
        visible={scoreFiltersAdded.length > 0}
        onClose={() => setScoreFiltersAdded([])}
      />
    </div>
  );
};

export default withAuthenticationRequired(withAuth0(Filters), {
  onRedirecting: () => <Loading />,
});
