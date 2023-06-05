import React, {Component } from "react";

import logo from "../assets/logo.svg";

class Hero extends Component {
  render () {
    return (
      <div className="text-center hero my-5">
        <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
        <h1 className="mb-4">Thematic Frontend Test Project</h1>

        <p>This is a sample application for calling Thematic Test data</p>
      </div>
    );
  }
}

export default Hero;
