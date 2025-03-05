import React, { useState, useEffect } from "react";
import { Event as RbcEvent } from "react-big-calendar";
import "../styles/modal.css";

// A simple modal component with an animation for gratification.
interface LectureModalProps {
  lecture: RbcEvent;
  onClose: () => void;
  onMarkDone: () => void;
}

export const LectureModal: React.FC<LectureModalProps> = ({
  lecture,
  onClose,
  onMarkDone,
}) => {
  const [animate, setAnimate] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Disable body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleCheckboxChange = () => {
    setAnimate(true);
    // After a short delay trigger the action and close with animation
    setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        setAnimate(false);
        onMarkDone();
      }, 400); // Duration of closing animation
    }, 600); // Duration of success animation
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 400); // Duration of closing animation
  };

  return (
    <div
      className={`modal-overlay ${isClosing ? "closing" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`modal-content ${animate ? "animate" : ""} ${
          isClosing ? "closing" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{lecture.title}</h3>
        <label>
          <input
            type="checkbox"
            checked={lecture.resource.isDone}
            onChange={handleCheckboxChange}
          />
          Is Done
        </label>
      </div>
    </div>
  );
};

// A modal component for series events
interface SeriesModalProps {
  series: RbcEvent;
  onClose: () => void;
  onMarkDone: () => void;
}

export const SeriesModal: React.FC<SeriesModalProps> = ({
  series,
  onClose,
  onMarkDone,
}) => {
  const [animate, setAnimate] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Disable body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleCheckboxChange = () => {
    setAnimate(true);
    // After a short delay trigger the action and close with animation
    setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        setAnimate(false);
        onMarkDone();
      }, 400); // Duration of closing animation
    }, 600); // Duration of success animation
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 400); // Duration of closing animation
  };

  return (
    <div
      className={`modal-overlay ${isClosing ? "closing" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`modal-content ${animate ? "animate" : ""} ${
          isClosing ? "closing" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{series.title}</h3>
        <p style={{ marginBottom: "15px", color: "#666" }}>
          {series.resource.eventId}
        </p>
        <label>
          <input
            type="checkbox"
            checked={series.resource.isDone}
            onChange={handleCheckboxChange}
          />
          Is Done
        </label>
        {series.resource.obligatory && (
          <p
            style={{ color: "#d9534f", marginTop: "10px", fontWeight: "bold" }}
          >
            This is an obligatory assignment!
          </p>
        )}
      </div>
    </div>
  );
};
