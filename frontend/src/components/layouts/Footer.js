import React from "react";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="ui-footer">
      <div className="footer-container">

        {/* Column 1 */}
        <div className="footer-col">
          <h4>Get to Know Us</h4>
          <ul>
            <li><a href="/">About JVLcart</a></li>
            <li><a href="/">Careers</a></li>
            <li><a href="/">Press Releases</a></li>
            <li><a href="/">JVLcart Science</a></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="footer-col">
          <h4>Connect with Us</h4>
          <ul className="footer-social-list">
            <li>
              <a href="https://www.facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook size={18} /> <span>Facebook</span>
              </a>
            </li>
            <li>
              <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <Twitter size={18} /> <span>Twitter</span>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/mr_d7x/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram size={18} /> <span>Instagram</span>
              </a>
            </li>
            <li>
              <a href="/contact" aria-label="Email us">
                <Mail size={18} /> <span>Contact</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-col">
          <h4>Make Money with Us</h4>
          <ul>
            <li><a href="/">Sell on JVLcart</a></li>
            <li><a href="/">Sell under JVLcart Accelerator</a></li>
            <li><a href="/">Protect and Build Your Brand</a></li>
            <li><a href="/">JVLcart Global Selling</a></li>
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
        <p>© 2022–2023 JVLcart. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
