import React from 'react';
import './BreadcrumbsNav.css';
import { useLocation, useNavigate } from 'react-router-dom';

const routeMap = [
  { path: '/home', label: 'Inicio' },
  { path: '/consulta', label: 'Citas' },
  { path: '/crear-cita', label: 'Agendar Cita' },
  { path: '/cursos', label: 'Cursos' },
  { path: '/cursoDetalle', label: 'Detalle del Curso' },
  { path: '/clasesIndividual', label: 'Inscripción Individual' },
  { path: '/clasesGrupo', label: 'Inscripción Grupo' },
  { path: '/recursos', label: 'Recursos' },
  { path: '/recursoDetalle', label: 'Detalle de Recurso' },
  { path: '/perfil', label: 'Perfil' },
  { path: '/checkout', label: 'Checkout' },
  { path: '/english', label: 'Clases de Inglés' },
  { path: '/english/clases-grupo', label: 'Clases Grupales' },
  { path: '/english/clases-individual', label: 'Clases Individuales' },
  
  // ...agrega más rutas según sea necesario
];

function getBreadcrumbs(pathname) {
  // Divide el pathname y busca coincidencias en routeMap
  const segments = pathname.split('/').filter(Boolean);
  let breadcrumbs = [];
  let paths = [];
  segments.forEach((seg, i) => {
    const currentPath = '/' + segments.slice(0, i + 1).join('/');
    paths.push(currentPath);
    const found = routeMap.find(r => r.path === currentPath);
    if (found) {
      breadcrumbs.push({ ...found, path: currentPath });
    } else {
      breadcrumbs.push({ label: decodeURIComponent(seg), path: currentPath });
    }
  });
  if (!breadcrumbs.length || breadcrumbs[0].label !== 'Inicio') {
    breadcrumbs.unshift({ path: '/home', label: 'Inicio' });
  }
  return breadcrumbs;
}

export default function BreadcrumbsNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Solo mostrar en web (no móvil)
  if (window.innerWidth < 900) return null;

  return (
    <nav className="breadcrumbs-nav" style={{
      width: '100%',
      padding: '10px 32px',
      fontSize: 15,
      borderBottom: '1px solid #eee',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      zIndex: 100
    }}>
      {location.pathname==='/home' ? "" : breadcrumbs.map((crumb, idx) => (
        <span key={crumb.path} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {idx !== breadcrumbs.length - 1 ? (
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit', fontWeight: 'normal', padding: 0 }}
              onClick={() => navigate(crumb.path)}
            >
              {crumb.label}
            </button>
          ) : (
            <span style={{ color: '#333', fontWeight: 'bold' }}>{crumb.label}</span>
          )}
          {idx < breadcrumbs.length - 1 && <span style={{ color: '#888' }}>{'>'}</span>}
        </span>
      ))}
    </nav>
  );
}
