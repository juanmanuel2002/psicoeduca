
import React, {useEffect, useState, useMemo } from "react";
import "../styles/recursos.css";
import "../styles/recursosFiltro.css";
import Header from "../components/header";
import Footer from '../components/footer';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import { getRecursos } from '../services/recursosService';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import RecursosFiltro from '../components/recursos/RecursosFiltro.jsx';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

export default function Recursos() {
  const [recursos, setRecursos] = useState([]);
  const [search, setSearch] = useState("");
  const [filtros, setFiltros] = useState({
    gratuitos: false,
    ayudaPersonal: false,
    duelo: false,
    nuevos: false,
    pasados: false,
    sincronos: false,
    asincronos: false,
    tallerSincrono: false,
    tallerAsincrono: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    getRecursos().then(data => setRecursos(data));
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  // Filtering logic
  const recursosFiltrados = useMemo(() => {
    let filtrados = recursos;
    // Search by name
    if (search.trim() !== "") {
      filtrados = filtrados.filter(r =>  (r.nombre || "").toLowerCase().includes(search.toLowerCase()));
    }
    // Category filters
    const checks = Object.entries(filtros).filter(([k, v]) => v);
    if (checks.length > 0) {
      filtrados = filtrados.filter(r => {
        // Example: match by category, tipo, or custom fields
        // Adjust these conditions to match your resource data structure
        let match = false;
        if (filtros.gratuitos && r.costo === 0) match = true;
        if (filtros.ayudaPersonal && r.categoria === "Ayuda personal") match = true;
        if (filtros.duelo && r.categoria === "Duelo") match = true;
        if (filtros.nuevos && r.tipo === "Seminario" && r.estado === "Nuevo") match = true;
        if (filtros.pasados && r.tipo === "Seminario" && r.estado === "Pasado") match = true;
        if (filtros.sincronos && r.tipo === "Seminario" && r.modalidad === "Sincrono") match = true;
        if (filtros.asincronos && r.tipo === "Seminario" && r.modalidad === "Asincrono") match = true;
        if (filtros.tallerSincrono && r.tipo === "Taller" && r.modalidad === "Sincrono") match = true;
        if (filtros.tallerAsincrono && r.tipo === "Taller" && r.modalidad === "Asincrono") match = true;
        return match;
      });
    }
    return filtrados;
  }, [recursos, search, filtros]);

  return (
    <div className="home-container">
      <Header />

      <div className="recursos-layout">
        {/* Sidebar filtro */}
        <RecursosFiltro
          filtros={filtros}
          setFiltros={setFiltros}
          search={search}
          setSearch={setSearch}
        />

        {/* Contenedor principal */}
        <section data-aos="fade-up" className="books-section" style={{ marginTop: 48 }}>
          <h2>Recursos Disponibles</h2>
          <div
            className="books-desc"
            style={{
              fontSize: "1.1rem",
              color: "var(--color-text-light)",
              marginBottom: 32,
            }}
          >
            Explora nuestra colección completa de recursos educativos y libros.
          </div>

          <div className="books-grid">
            {recursosFiltrados.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  width: "100%",
                  marginTop: 40,
                  color: "#888",
                }}
              >
                <SentimentDissatisfiedIcon style={{ fontSize: 48, marginBottom: 8 }} />
                <div>No se encontraron recursos con los filtros seleccionados.</div>
              </div>
            ) : (
              recursosFiltrados.map((recurso, idx) => (
                <div
                  key={recurso.id || idx}
                  className="book-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/recurso/${recurso.id}`)}
                >
                  <img
                    src={recurso.imagenFutura || "/baner.png"}
                    alt={recurso.nombre}
                    className="book-img"
                  />
                  <h3>{recurso.nombre}</h3>
                  <p>{recurso.descripcion}</p>
                  {typeof recurso.costo === "number" && (
                    <div className="book-cost">
                      {recurso.costo > 0 ? `$${recurso.costo}` : "Gratis"}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <WhatsAppFloat />
      <Footer />
    </div>

  );
}
