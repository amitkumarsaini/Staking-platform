import React, { Component } from "react";
import { useSelector } from "react-redux";
import { Container, Spinner } from "react-bootstrap";
import "./style.scss"

function LoaderComponent() {
  const { isLoading } = useSelector((state) => state.loader);
  if (isLoading) {
    return (
      <div className="overlayloader">
        <div class="loader">
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
          <div class="bar4"></div>
          <div class="bar5"></div>
          <div class="bar6"></div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default LoaderComponent;
