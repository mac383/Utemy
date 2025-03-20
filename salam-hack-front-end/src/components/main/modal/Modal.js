import React, { useEffect, useRef } from "react";
import "./modal.css";
import Button from "../inputs/button/Button";

export default function Modal({ modal, setModal }) {
  let detailsRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target)) {
        setModal({ title: "", details: "", visibility: false });
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setModal]);

  return (
    <div
      className={`view-details-component ${modal.visibility ? "visible" : ""}`}
      ref={detailsRef}
    >
      <h3 className="title">{modal.title}</h3>
      <span className="details">{modal.details}</span>
      <Button
        type="button"
        variant="light"
        elevated={false}
        onClick={() => {
          setModal({ title: "", details: "", visibility: false });
        }}
      >
        اغلاق
      </Button>
    </div>
  );
}
