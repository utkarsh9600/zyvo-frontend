import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <h2>Page Not Found</h2>
      <p>Jo aap dhoondh rahe ho wo page exist nahi karta 😅</p>

      <Link to="/" style={styles.btn}>
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;

const styles = {
  container: {
    height: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  code: {
    fontSize: 80,
    color: "#e50914",
  },
  btn: {
    marginTop: 10,
    padding: "10px 18px",
    background: "#e50914",
    color: "#fff",
    textDecoration: "none",
    borderRadius: 6,
  },
};