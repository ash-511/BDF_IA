import React, { Component } from 'react';
import './Navbar.css';

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top flex-md-nowrap p-0 shadow">
       
        <a
        
        className="navbar-brand col-sm-3 col-md-2 mr-0 "
          href="https://github.com/ash-511/BDF_IA"
          target="_blank"
          rel="noopener noreferrer"
        >
          BlocKart
          <img src = "shopping.png" height="15px" width="15px" style={{marginLeft: 3 + 'px'}}></img>
        </a>
        
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white">Current User : <span id="account">{this.props.account}</span></small>
          </li>
        </ul>
      </nav>
    );
  }
}
export default Navbar;