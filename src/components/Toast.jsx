import React, { useEffect, useState } from "react";

const Toast = ({ id, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => setIsVisible(false), 3000);
    const removeTimer = setTimeout(() => onClose && onClose(id), 3500);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [id, onClose]);

  return (
    <div className={`toast ${isVisible ? "show" : "hide"}`}>{message}</div>
  );
};

export default Toast;
