import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="ui-footer">
      <div className="footer-container">

        {/* Column 1 */}
        <div className="footer-col">
          <h4>Get to Know Us</h4>
          <ul>
            <li><Link to="/about">About Vipstore-Ecom</Link></li>
            <li><a href="/">Careers</a></li>
            <li><a href="/">Press Releases</a></li>
            <li><a href="/">Vipstore Science</a></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="footer-col">
          <h4>Connect with Us</h4>
          <div className="footer-social">
            <a href="/" aria-label="Facebook" className="social-link"><i className="fa fa-facebook-f" aria-hidden="true"></i></a>
            <a href="/" aria-label="Twitter" className="social-link"><i className="fa fa-twitter" aria-hidden="true"></i></a>
            <a href="https://www.instagram.com/mr_d7x/" aria-label="Instagram" className="social-link"><i className="fa fa-instagram" aria-hidden="true"></i></a>
            <a href="/" aria-label="YouTube" className="social-link"><i className="fa fa-youtube" aria-hidden="true"></i></a>
            <a href="https://www.linkedin.com/in/dhushyandh-n-0446062a5/" aria-label="LinkedIn" className="social-link"><i className="fa fa-linkedin" aria-hidden="true"></i></a>
          </div>
        </div>

        {/* Column 3 */}
        <div className="footer-col">
          <h4>Make Money with Us</h4>
          <ul>
            <li><a href="/">Sell on Vipstore</a></li>
            <li><a href="/">Sell under Vipstore Accelerator</a></li>
            <li><a href="/">Protect and Build Your Brand</a></li>
            <li><a href="/">Vipstore Global Selling</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="footer-col">
          <h4>Let Us Help You</h4>
          <ul>
            <li><a href="/">Your Account</a></li>
            <li><a href="/">Returns Centre</a></li>
            <li><a href="/">100% Purchase Protection</a></li>
            <li><a href="/">Help</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2022–2023 Vipstore-Ecom. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
