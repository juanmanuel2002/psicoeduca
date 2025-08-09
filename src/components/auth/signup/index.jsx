import React, { useState, useEffect, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { register } from "../../../services/authService";
import { AuthContext } from "../../../contexts/authContext/AuthContext";
import "./register.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login: setAuthUser } = useContext(AuthContext);

  const reglasTraduccion = {
    "Password must contain at least 8 characters": "Debe tener al menos 8 caracteres",
    "Password must contain a lower case character": "Debe contener una letra minúscula",
    "Password must contain an upper case character": "Debe contener una letra mayúscula",
    "Password must contain a numeric character": "Debe contener un número",
    "Password must contain a non-alphanumeric character": "Debe contener un carácter especial",
  };

  function getPasswordChecks(password) {
    return {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }

  useEffect(() => {
    if (isSignedUp) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isSignedUp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      let userData = await register(email, password, name);
      setAuthUser(userData.user);
      setIsSignedUp(true);
    } catch (err) {
      if (err.message.includes("auth/email-already-in-use")) {
        setError("Este correo ya está en uso.");
      } else if (err.message.includes("auth/invalid-email")) {
        setError("El correo no es válido.");
      } else if (err.message.includes("auth/password-does-not-meet-requirements")) {
        const reglas = [];
        const match = err.message.match(/\[(.*?)\]/);
        if (match && match[1]) {
          const reglasEnIngles = match[1].split(", ");
          for (const regla of reglasEnIngles) {
            const traducida = reglasTraduccion[regla.trim()];
            if (traducida) {
              reglas.push(traducida);
            }
          }
        }
        setError(
          reglas.length > 0
            ? reglas
            : "La contraseña no cumple con los requisitos mínimos."
        );
      } else {
        setError("No se pudo crear la cuenta. Intenta con otro correo.");
      }
    }
    setLoading(false);
  };

  if (isSignedUp && !showSuccess) {
    return <Navigate to="/home" />;
  }

  const passwordChecks = getPasswordChecks(password);

  return (
    <div className="register-container">
      <div className="register-form-section">
        <h2>Registrarse</h2>
        {isSignedUp && showSuccess && (
          <p className="success-message">¡Registro exitoso! Redirigiendo...</p>
        )}
        {error && !isSignedUp && (
          typeof error === "string" ? (
            <p className="error">{error}</p>
          ) : (
            <div className="error">
              <p>La contraseña no cumple con los siguientes requisitos:</p>
              <ul>
                {error.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          )
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="name"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              required
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              required
            />

            {/* Lista de requisitos */}
             <ul className="password-rules">
              <li className={passwordChecks.length ? "valid" : "invalid"}>
                Mínimo 8 caracteres
              </li>
              <li className={passwordChecks.upper ? "valid" : "invalid"}>
                Al menos una letra mayúscula
              </li>
              <li className={passwordChecks.lower ? "valid" : "invalid"}>
                Al menos una letra minúscula
              </li>
              <li className={passwordChecks.number ? "valid" : "invalid"}>
                Al menos un número
              </li>
              <li className={passwordChecks.special ? "valid" : "invalid"}>
                Al menos un carácter especial
              </li>
            </ul>

          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError("");
              }}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="login-links">
          <Link to="/login" className="forgot-link">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
