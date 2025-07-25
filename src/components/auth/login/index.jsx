import React, {useState, useEffect} from "react";
import {Navigate, Link} from "react-router-dom";
import { login, loginWithGoogle} from "../../../services/authService";
import '../../../styles/login.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignedIn, setIsSignedIn] = useState(false);   
    const [error, setError] = useState("");


    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            setIsSignedIn(true);
        } catch (error) {
            setError("Usuario o contraseña incorrectos");
            console.error("Error al iniciar sesión:", error);
        }
    };


    useEffect(() => {
      async function fetchGoogleClientIdAndInit() {
        try {
         const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
          if (!clientId) {
            throw new Error("No se pudo obtener Google Client ID");
          }
          if (window.google && window.google.accounts && window.google.accounts.id) {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: async (response) => {
                try {
                  const { credential } = response;
                  await loginWithGoogle(credential);
                  setIsSignedIn(true);
                } catch (err) {
                  setError("No se pudo iniciar sesión con Google");
                }
              },
            });
            window.google.accounts.id.renderButton(
              document.getElementById("google-signin-btn"),
              { theme: "outline", size: "large" }
            );
          }
        } catch (err) {
          setError("No se pudo cargar Google Sign-In");
        }
      }
      fetchGoogleClientIdAndInit();
    }, []);



if (isSignedIn) {
  return <Navigate to="/home" />;
}

return (
  <div className="login-main-container">
    <div className="login-image-section">
      <img src={process.env.PUBLIC_URL + '/baner.png'} alt="Banner" className="login-banner" />
    </div>
    <div className="login-form-section">
      <h2>Iniciar sesión</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
                setEmail(e.target.value)
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
                setPassword(e.target.value)
                if (error) setError("");
            }}
            required
          />
        </div>
        <button type="submit" className="login-btn">Iniciar sesión</button>
      </form>
      <div className="login-or">o</div>
      <div id="google-signin-btn" style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}></div>
      <div className="login-links">
        <Link to="/forgot-password" className="forgot-link">¿Olvidaste tu contraseña?</Link>
        <span> | </span>
        <Link to="/signup" className="signup-link">Registrarse</Link>
      </div>
    </div>
  </div>
)
}

export default Login;