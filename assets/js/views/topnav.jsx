import React from "react";
import Link from "react-router-dom/es/Link";

export default class TopNav extends React.Component {
  render() {
    return (
      <div className={"top-nav"}>
        <Link to={"/"}>
        <span className="top-nav-title">Twin Raven</span>
        </Link>
      </div>
    );
  }
}