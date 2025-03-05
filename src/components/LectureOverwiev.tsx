import React, { useState } from "react";
import moment from "moment";
import { CalendarEvent, SeriesItem } from "../pages/calendar";

type LecturesOverviewProps = {
  events: CalendarEvent[];
  dispatch: React.Dispatch<any>;
};

export const LecturesOverview: React.FC<LecturesOverviewProps> = ({
  events,
  dispatch,
}) => {
  // Keep track of which lectures are expanded (by their 'id').
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [weeklyStartDate, setWeeklyStartDate] = useState<string>(""); // for input type="date"
  const [setObligatory, setSetObligatory] = useState<boolean>(false); // track if series should be obligatory

  // Toggle a lecture's expanded/collapsed state.
  const toggleExpand = (id?: string) => {
    if (!id) return;
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Helper to dispatch an updated event to your reducer/store.
  const updateEventInStore = (updatedEvent: CalendarEvent) => {
    dispatch({ type: "UPDATE_EVENT", payload: updatedEvent });
  };

  // Add a new (blank) SeriesItem to an event.
  const handleAddSeries = (event: CalendarEvent) => {
    const newSeries: SeriesItem = {
      name: "New Series",
      endDate: new Date(),
      hasDone: false,
      obligatory: false,
    };
    const updatedEvent: CalendarEvent = {
      ...event,
      seriesData: [...(event.seriesData || []), newSeries],
    };
    updateEventInStore(updatedEvent);
  };

  // Delete a series from an event.
  const handleDeleteSeries = (event: CalendarEvent, index: number) => {
    if (!event.seriesData) return;
    const updatedSeries = [...event.seriesData];
    updatedSeries.splice(index, 1);

    const updatedEvent: CalendarEvent = {
      ...event,
      seriesData: updatedSeries,
    };
    updateEventInStore(updatedEvent);
  };

  // Update a specific series item (e.g. name, date, hasDone, obligatory).
  const handleUpdateSeries = (
    event: CalendarEvent,
    index: number,
    updatedItem: SeriesItem
  ) => {
    if (!event.seriesData) return;
    const updatedSeries = [...event.seriesData];
    updatedSeries[index] = updatedItem;

    const updatedEvent: CalendarEvent = {
      ...event,
      seriesData: updatedSeries,
    };
    updateEventInStore(updatedEvent);
  };

  // Helper to generate weekly series based on the given start date and the last lecture's end date.
  const generateWeeklySeries = (
    event: CalendarEvent,
    startDate: Date,
    makeObligatory: boolean
  ): SeriesItem[] => {
    const series: SeriesItem[] = [];
    let current = moment(startDate);
    // Use the end date of the last lecture in lectureData.
    const end = moment(event.lectureData[event.lectureData.length - 1].endDate);
    let count = 1;
    while (current.isBefore(end)) {
      series.push({
        name: `Serie ${count}`,
        endDate: current.clone().endOf("day").toDate(),
        hasDone: false,
        obligatory: makeObligatory,
      });
      current.add(1, "week");
      count++;
    }
    return series;
  };

  // Handle generating weekly series
  const handleGenerateWeeklySeries = (event: CalendarEvent) => {
    if (!weeklyStartDate) return;

    const startDate = new Date(weeklyStartDate);
    const generatedSeries = generateWeeklySeries(
      event,
      startDate,
      setObligatory
    );

    const updatedEvent: CalendarEvent = {
      ...event,
      seriesType: "weekly",
      weeklyStartDate: startDate,
      seriesData: generatedSeries,
    };

    updateEventInStore(updatedEvent);
    setWeeklyStartDate("");
    setSetObligatory(false); // Reset after generating
  };

  // Clear all series for an event
  const handleClearSeries = (event: CalendarEvent) => {
    const updatedEvent: CalendarEvent = {
      ...event,
      seriesType: "none",
      seriesData: [],
    };
    updateEventInStore(updatedEvent);
  };

  // Toggle display for all lectures of a specific type
  const handleTypeDisplayToggle = (
    event: CalendarEvent,
    type: string,
    display: boolean
  ) => {
    const updatedLectureData = [...event.lectureData];

    // Update all lectures that have this type
    updatedLectureData.forEach((lecture, index) => {
      const types =
        lecture.types && lecture.types.length > 0 ? lecture.types : ["Other"];

      if (types.includes(type)) {
        updatedLectureData[index] = {
          ...updatedLectureData[index],
          display,
        };
      }
    });

    const updatedEvent = {
      ...event,
      lectureData: updatedLectureData,
    };

    updateEventInStore(updatedEvent);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Lectures Overview</h2>

      {events.map((ev) => {
        // Group lectures by type
        const lectureTypes = new Set<string>();

        ev.lectureData.forEach((lecture) => {
          const types =
            lecture.types && lecture.types.length > 0
              ? lecture.types
              : ["Other"];
          types.forEach((type) => lectureTypes.add(type));
        });

        // Calculate if each type is displayed
        const typeDisplayStatus: Record<string, boolean> = {};

        lectureTypes.forEach((type) => {
          // A type is displayed if at least one lecture with that type is displayed
          const relevantLectures = ev.lectureData.filter((lecture) => {
            const types =
              lecture.types && lecture.types.length > 0
                ? lecture.types
                : ["Other"];
            return types.includes(type);
          });

          typeDisplayStatus[type] = relevantLectures.some(
            (lecture) => lecture.display
          );
        });

        // For display, show the base course name
        const courseBaseName = ev.id || "Untitled Course";
        const isExpanded = ev.id ? expandedIds.includes(ev.id) : false;

        return (
          <div
            key={ev.id}
            style={{
              border: "1px solid #ccc",
              margin: "1rem 0",
              padding: "1rem",
            }}
          >
            {/* Course Header */}
            <div
              onClick={() => toggleExpand(ev.id)}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: "bold" }}>{courseBaseName}</div>
              <div>{isExpanded ? "▲" : "▼"}</div>
            </div>

            {/* Expanded section */}
            {isExpanded && (
              <div style={{ marginTop: "1rem" }}>
                {/* Display lecture types with toggles */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <h4>Lecture Types</h4>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem" }}
                  >
                    {Array.from(lectureTypes).map((type, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "0.5rem 1rem",
                          backgroundColor: typeDisplayStatus[type]
                            ? "#e3f2fd"
                            : "#f5f5f5",
                          borderRadius: "20px",
                          border: `1px solid ${
                            typeDisplayStatus[type] ? "#2196F3" : "#ddd"
                          }`,
                          boxShadow: typeDisplayStatus[type]
                            ? "0 2px 5px rgba(33, 150, 243, 0.2)"
                            : "none",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={typeDisplayStatus[type]}
                            onChange={(e) => {
                              handleTypeDisplayToggle(
                                ev,
                                type,
                                e.target.checked
                              );
                            }}
                            style={{
                              accentColor: "#2196F3",
                              width: "16px",
                              height: "16px",
                            }}
                          />
                          <span>
                            <strong>{type}</strong>
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Series tools and series list */}
                <div
                  style={{
                    marginBottom: "1.5rem",
                    padding: "1rem",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                >
                  <h4>Series Tools</h4>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      flexWrap: "wrap",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <label
                        style={{ display: "block", marginBottom: "0.25rem" }}
                      >
                        Weekly Start Date:
                      </label>
                      <input
                        type="date"
                        value={weeklyStartDate}
                        onChange={(e) => setWeeklyStartDate(e.target.value)}
                        style={{ padding: "0.3rem" }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={setObligatory}
                          onChange={(e) => setSetObligatory(e.target.checked)}
                        />
                        Set all as obligatory
                      </label>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleGenerateWeeklySeries(ev)}
                        disabled={!weeklyStartDate}
                        style={{
                          padding: "0.3rem 0.8rem",
                          backgroundColor: weeklyStartDate
                            ? "#4CAF50"
                            : "#cccccc",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: weeklyStartDate ? "pointer" : "not-allowed",
                        }}
                      >
                        Generate Weekly Series
                      </button>

                      <button
                        onClick={() => handleClearSeries(ev)}
                        style={{
                          padding: "0.3rem 0.8rem",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Clear All Series
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleAddSeries(ev)}
                      style={{
                        padding: "0.3rem 0.8rem",
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Add Manual Series
                    </button>
                  </div>
                </div>

                <h4>Series List</h4>
                {ev.seriesData && ev.seriesData.length > 0 ? (
                  ev.seriesData.map((serie, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginBottom: "0.8rem",
                        padding: "0.7rem",
                        backgroundColor: serie.obligatory
                          ? "#fff3f3"
                          : "#f5f5f5",
                        borderRadius: "4px",
                        alignItems: "center",
                      }}
                    >
                      {/* Name */}
                      <input
                        type="text"
                        value={serie.name}
                        onChange={(e) =>
                          handleUpdateSeries(ev, index, {
                            ...serie,
                            name: e.target.value,
                          })
                        }
                        placeholder="Series Name"
                        style={{ padding: "0.3rem", flex: "1" }}
                      />

                      {/* Date */}
                      <input
                        type="date"
                        value={moment(serie.endDate).format("YYYY-MM-DD")}
                        onChange={(e) =>
                          handleUpdateSeries(ev, index, {
                            ...serie,
                            endDate: new Date(e.target.value),
                          })
                        }
                        style={{ padding: "0.3rem" }}
                      />

                      {/* Done Checkbox */}
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        Done:
                        <input
                          type="checkbox"
                          checked={serie.hasDone}
                          onChange={(e) =>
                            handleUpdateSeries(ev, index, {
                              ...serie,
                              hasDone: e.target.checked,
                            })
                          }
                        />
                      </label>

                      {/* Obligatory Checkbox */}
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        Obligatory:
                        <input
                          type="checkbox"
                          checked={serie.obligatory}
                          onChange={(e) =>
                            handleUpdateSeries(ev, index, {
                              ...serie,
                              obligatory: e.target.checked,
                            })
                          }
                        />
                      </label>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteSeries(ev, index)}
                        style={{
                          padding: "0.3rem 0.8rem",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No series yet.</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
