import React from "react";
import { useSelector } from "react-redux";

const Loading = () => {
  const loading = useSelector((state) => state.utils.loader);

  return (
    loading && (
      <div className="overlayloader">
        <div className="loader">
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
          <div className="bar4"></div>
          <div className="bar5"></div>
          <div className="bar6"></div>
        </div>
      </div>
    )
  );
};

export default Loading;
