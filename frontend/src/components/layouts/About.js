import { useState } from "react";
import { toast } from "react-toastify";
import MetaData from "./MetaData";

const TEAM = [
  {
    name: "dhushyandh",
    role: "project manager",
    image: "/images/default_avatar.png",
  },
  {
    name: "logith",
    role: "Sales Manager",
    image: "/images/default_avatar.png",
  },
  {
    name: "balamurugan",
    role: "software engineer",
    image: "/images/default_avatar.png",
  },
  {
    name: "abinesh",
    role: "Founder/CEO",
    image: "/images/default_avatar.png",
  },
];

export default function About() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !message.trim()) {
      toast("Please fill all fields", {
        type: "error",
        position: "bottom-right",
        theme: "light",
      });
      return;
    }

    toast("Thanks! We received your message.", {
      type: "success",
      position: "bottom-right",
      theme: "light",
    });

    setFullName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="about-page">
      <MetaData title="About" />

      <section className="about-hero">
        <h1 className="about-title">About VIPSTORE</h1>
        <p className="about-subtitle">
          VIPSTORE is a MERN-based eCommerce platform built to deliver a smooth shopping experience — product search,
          cart, secure checkout, order tracking, and an admin dashboard to manage products, orders, and users.
        </p>

        <div className="about-highlights">
          <div className="about-highlight">
            <h4>Fast Shopping</h4>
            <p className="muted">Quick search, smooth cart, and clean UI.</p>
          </div>
          <div className="about-highlight">
            <h4>Secure Accounts</h4>
            <p className="muted">JWT auth, password reset, and OAuth support.</p>
          </div>
          <div className="about-highlight">
            <h4>Admin Tools</h4>
            <p className="muted">Manage products, orders, reviews, and users.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="section-heading">
          <h2 className="section-title">Our Team</h2>
          <div className="section-underline" />
        </div>

        <div className="team-row">
          {TEAM.map((member) => (
            <div key={member.name} className="team-card">
              <img className="team-avatar" src={member.image} alt={member.name} />
              <div className="team-name">{member.name}</div>
              <div className="team-role">{member.role}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="section-heading">
          <h2 className="section-title">Get in Touch</h2>
          <div className="section-underline" />
        </div>

        <div className="contact-card shadow-sm">
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label htmlFor="contact_name">Full Name</label>
              <input
                id="contact_name"
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact_email">Email</label>
              <input
                id="contact_email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact_message">Message</label>
              <textarea
                id="contact_message"
                className="form-control"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you need..."
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
