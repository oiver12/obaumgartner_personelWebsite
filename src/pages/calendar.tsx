// CalendarPage.tsx
import React, { useReducer, useState, useEffect } from "react";
import {
  Calendar,
  momentLocalizer,
  Event as RbcEvent,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ICAL from "ical.js";
import Layout from "../components/Layout";
import { LecturesOverview } from "../components/LectureOverwiev";
import { LectureModal, SeriesModal } from "../components/CalendarModals";

const localizer = momentLocalizer(moment);

// Updated type definitions
export type SeriesItem = {
  name: string;
  endDate: Date;
  hasDone: boolean;
  obligatory: boolean;
};

export type LectureItem = {
  name: string;
  startDate: Date;
  endDate: Date;
  isDone: boolean;
  types: string[]; // Array of types like ["V", "U"] etc.
  instructor?: string;
  display: boolean; // Whether this should be displayed in calendar
};

export type CalendarEvent = {
  id?: string; // This will be the base course name without type
  lectureData: LectureItem[];
  seriesType?: "weekly" | "manual" | "none";
  seriesData?: SeriesItem[];
  weeklyStartDate?: Date;
};

export type RBCEventType = {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  isDone?: boolean;
  eventType: "lecture" | "series";
  allDay?: boolean;
};

type Action =
  | { type: "LOAD_EVENTS"; payload: CalendarEvent[] }
  | { type: "TOGGLE_LECTURE"; payload: { eventId: string; lectureStart: Date } }
  | { type: "ADD_EVENTS"; payload: CalendarEvent[] }
  | { type: "UPDATE_EVENT"; payload: CalendarEvent };

/**
 * Parse a lecture title to extract course name, types, and instructor
 */
export function parseLectureLine(line: string): {
  courseName: string;
  lectureTypes: string[];
  instructor?: string;
} {
  // Trim to remove leading/trailing spaces
  let trimmed = line.trim();

  let lectureTypes: string[] = [];
  let instructor: string | undefined;

  // 1. Extract all parentheses parts, e.g. (V), (U), (P), etc.
  const parenRegex = /\(([^)]+)\)/g;
  let match;
  let withoutTypes = trimmed;

  while ((match = parenRegex.exec(trimmed)) !== null) {
    lectureTypes.push(match[1].trim()); // e.g. "V", "U"
    // Remove the "(V)" from the string for the final courseName
    withoutTypes = withoutTypes.replace(match[0], "").trim();
  }

  // The remaining text may contain instructor information
  // We'll keep it as part of the course name for display
  const courseName = withoutTypes;

  // Extract potential instructor
  // This will be stored separately but also kept in the displayed title
  const instructorPatterns = [
    /\s+-\s+([^-]+)$/, // After a dash
    /\s+\/\s+([^/]+)$/, // After a slash
    /\s{2,}([A-Z][^.]+)$/, // After 2+ spaces, starting with capital letter
  ];

  for (const pattern of instructorPatterns) {
    const instMatch = withoutTypes.match(pattern);
    if (instMatch) {
      instructor = instMatch[1].trim();
      break;
    }
  }

  return {
    courseName,
    lectureTypes,
    instructor,
  };
}

// Modified event reducer
const eventReducer = (
  state: CalendarEvent[],
  action: Action
): CalendarEvent[] => {
  switch (action.type) {
    case "LOAD_EVENTS":
      return action.payload;
    case "TOGGLE_LECTURE":
      const toggled = state.map((event) => {
        if (event.id === action.payload.eventId) {
          const updatedLectureData = event.lectureData.map((lecture) => {
            if (
              lecture.startDate.getTime() ===
              action.payload.lectureStart.getTime()
            ) {
              return { ...lecture, isDone: !lecture.isDone };
            }
            return lecture;
          });
          return { ...event, lectureData: updatedLectureData };
        }
        return event;
      });
      localStorage.setItem("calendarEvents", JSON.stringify(toggled));
      return toggled;
    case "ADD_EVENTS": {
      // Group lectures by their base course name
      const groupedEvents: { [key: string]: CalendarEvent } = {};

      for (const event of action.payload) {
        for (const lecture of event.lectureData) {
          const parseResult = parseLectureLine(lecture.name);
          // Use course name as the key but keep full name for display
          const baseCourseName = parseResult.courseName;

          // Default display rule: Show lectures with "V" type or no type
          const shouldDisplay =
            parseResult.lectureTypes.includes("V") ||
            parseResult.lectureTypes.length === 0;

          const lectureWithParsedInfo: LectureItem = {
            ...lecture,
            types: parseResult.lectureTypes,
            instructor: parseResult.instructor,
            display: shouldDisplay,
          };

          // If we have an event with this course name already, add this lecture to it
          if (groupedEvents[baseCourseName]) {
            groupedEvents[baseCourseName].lectureData.push(
              lectureWithParsedInfo
            );
          } else {
            // Otherwise, create a new event
            groupedEvents[baseCourseName] = {
              id: baseCourseName,
              lectureData: [lectureWithParsedInfo],
              seriesType: "none",
              seriesData: [],
            };
          }
        }
      }

      const processedEvents = Object.values(groupedEvents);
      localStorage.setItem("calendarEvents", JSON.stringify(processedEvents));
      return processedEvents;
    }
    case "UPDATE_EVENT":
      const updated = state.map((event) =>
        event.id === action.payload.id ? action.payload : event
      );
      localStorage.setItem("calendarEvents", JSON.stringify(updated));
      return updated;
    default:
      return state;
  }
};

const CalendarPage: React.FC = () => {
  const [events, dispatch] = useReducer(eventReducer, []);
  const [dataLoaded, setDataLoaded] = useState(false);
  // State to store the selected events for the modals
  const [selectedLecture, setSelectedLecture] = useState<RbcEvent | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<RbcEvent | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("calendarEvents");
    if (saved) {
      const parsedEvents: CalendarEvent[] = JSON.parse(saved).map(
        (ev: any) => ({
          ...ev,
          lectureData: ev.lectureData.map((lec: any) => ({
            ...lec,
            startDate: new Date(lec.startDate),
            endDate: new Date(lec.endDate),
          })),
          weeklyStartDate: ev.weeklyStartDate
            ? new Date(ev.weeklyStartDate)
            : undefined,
          seriesData: ev.seriesData
            ? ev.seriesData.map((s: any) => ({
                ...s,
                endDate: new Date(s.endDate),
              }))
            : [],
        })
      );
      dispatch({ type: "LOAD_EVENTS", payload: parsedEvents });
      setDataLoaded(true);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target) return;
      const icsText = event.target.result as string;

      const jcalData = ICAL.parse(icsText);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents("vevent");

      const uniqueLectures: { [key: string]: CalendarEvent } = {};

      vevents.forEach((ev) => {
        const eventObj = new ICAL.Event(ev);
        let title = eventObj.summary.trim();
        title = title.replace(/\s\d{4}-\d{2}-\d{2}$/, "");

        // Create lecture item (no parsing yet, will be done in reducer)
        const lectureItem: LectureItem = {
          name: title,
          startDate: new Date(eventObj.startDate.toString()),
          endDate: new Date(eventObj.endDate.toString()),
          isDone: false,
          types: [], // Initialize as empty array
          display: true, // Default to display
        };

        // Create temporary events to be processed by the reducer
        if (uniqueLectures[title]) {
          uniqueLectures[title].lectureData.push(lectureItem);
        } else {
          uniqueLectures[title] = {
            id: title, // This will be changed in the reducer
            lectureData: [lectureItem],
            seriesType: "none",
            seriesData: [],
          };
        }
      });

      const parsedEvents = Object.values(uniqueLectures);
      dispatch({ type: "ADD_EVENTS", payload: parsedEvents });
      setDataLoaded(true);
    };
    reader.readAsText(file);
  };

  // When an event is clicked, open the appropriate modal
  const handleEventClick = (event: RbcEvent) => {
    if (event.resource.eventType === "lecture") {
      setSelectedLecture(event);
    } else if (event.resource.eventType === "series") {
      setSelectedSeries(event);
    }
  };

  // Called when "Is Done" is checked for lectures
  const handleModalMarkDone = () => {
    if (selectedLecture && selectedLecture.start) {
      dispatch({
        type: "TOGGLE_LECTURE",
        payload: {
          eventId: selectedLecture.resource.eventId,
          lectureStart: new Date(selectedLecture.start), // Ensure it's a Date
        },
      });
      setSelectedLecture(null);
    }
  };

  // Called when "Is Done" is checked for series
  const handleSeriesMarkDone = () => {
    if (selectedSeries && selectedSeries.resource.eventId) {
      // Find the event and the specific series item
      const eventId = selectedSeries.resource.eventId;
      const seriesName = selectedSeries.title;

      const updatedEvents = events.map((event) => {
        if (event.id === eventId) {
          const updatedSeriesData = (event.seriesData || []).map((series) => {
            if (series.name === seriesName) {
              return { ...series, hasDone: !series.hasDone };
            }
            return series;
          });
          return { ...event, seriesData: updatedSeriesData };
        }
        return event;
      });

      localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
      dispatch({ type: "LOAD_EVENTS", payload: updatedEvents });
      setSelectedSeries(null);
    }
  };

  const handleModalClose = () => {
    setSelectedLecture(null);
  };

  const handleSeriesModalClose = () => {
    setSelectedSeries(null);
  };

  // Modified display events to respect the display flag
  const displayEvents: RbcEvent[] = events.flatMap((calEvent) => {
    // Filter lectures by display flag
    const lectureEvents = calEvent.lectureData
      .filter((lecture) => lecture.display)
      .map((lecture) => ({
        id: calEvent.id,
        title: lecture.name, // Keep the full original title
        start: lecture.startDate,
        end: lecture.endDate,
        allDay: false,
        resource: {
          isDone: lecture.isDone,
          eventId: calEvent.id,
          eventType: "lecture",
          lectureTypes: lecture.types || [],
          instructor: lecture.instructor,
        },
      }));

    // Series events remain the same
    const seriesEvents = (calEvent.seriesData || []).map((serie) => ({
      id: calEvent.id,
      title: `${serie.name}`,
      start: moment(serie.endDate).startOf("day").toDate(),
      end: moment(serie.endDate).endOf("day").toDate(),
      allDay: true,
      resource: {
        isDone: serie.hasDone,
        eventId: calEvent.id,
        eventType: "series",
        obligatory: serie.obligatory,
      },
    }));

    return [...lectureEvents, ...seriesEvents];
  });

  return (
    <Layout>
      <div
        style={{
          padding: "1rem",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!dataLoaded ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              <h2>Upload your ICS file</h2>
              <input type="file" accept=".ics" onChange={handleFileUpload} />
            </div>
          </div>
        ) : (
          <>
            <h2>Your Lesson Calendar</h2>
            <div style={{ flexGrow: 1, display: "flex", width: "100%" }}>
              <Calendar
                localizer={localizer}
                events={displayEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ flexGrow: 1, minHeight: "100vh", width: "100%" }}
                views={["month", "week", "day"]}
                onSelectEvent={handleEventClick}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.resource?.isDone
                      ? "#d4edda"
                      : event.resource?.eventType === "series"
                      ? event.resource.obligatory
                        ? "#ffcccb"
                        : "#cce5ff"
                      : "#fff",
                    color: "#000",
                  },
                })}
              />
            </div>
            {selectedLecture && (
              <LectureModal
                lecture={selectedLecture}
                onClose={handleModalClose}
                onMarkDone={handleModalMarkDone}
              />
            )}
            {selectedSeries && (
              <SeriesModal
                series={selectedSeries}
                onClose={handleSeriesModalClose}
                onMarkDone={handleSeriesMarkDone}
              />
            )}
            <LecturesOverview events={events} dispatch={dispatch} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default CalendarPage;
