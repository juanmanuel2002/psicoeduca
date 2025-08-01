import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { resetPassword } from "../../../services/authService";
import '../../../styles/login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setRedirect(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await resetPassword(email);
      setMessage("Te hemos enviado un correo para restablecer tu contraseña.");
    } catch (err) {
      setError(err.message || "No se pudo enviar el correo. Verifica tu email.");
    }
    setLoading(false);
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="login-bg-container">
      <div className="login-form-section">
        <h2>Recuperar contraseña</h2>
        {message && <p className="success-message">{message} Redirigiendo...</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Enviando..." : "Enviar correo"}
          </button>
        </form>
        <div className="login-links">
          <Link to="/login" className="forgot-link">Volver al login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
