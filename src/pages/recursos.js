import React from "react";
import "../styles/home.css";
import Header from "../components/header";

const books = [
  { title: "Mindfulness para Todos", description: "Una guía práctica para la atención plena." },
  { title: "Manual de Ansiedad", description: "Estrategias para superar la ansiedad cotidiana." },
  { title: "Psicología Infantil", description: "Comprendiendo el desarrollo emocional de los niños." },
  { title: "Comunicación Asertiva", description: "Mejora tus relaciones con técnicas efectivas." },
  { title: "Autoestima y Crecimiento", description: "Construye una mejor versión de ti mismo." },
  { title: "Gestión del Estrés", description: "Técnicas para mantener la calma en tiempos difíciles." },
];

export default function Recursos() {
  return (
    <div className="home-container">
      <Header />
      <section className="books-section" style={{marginTop: 48}}>
        <h2>Recursos Disponibles</h2>
        <div className="books-desc" style={{fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: 32}}>
          Explora nuestra colección completa de recursos educativos y libros.
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="books-grid">
            {books.map(({ title, description }, idx) => (
              <div key={idx} className="book-card">
                <img src="/baner.png" alt={title} className="book-img" />
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
