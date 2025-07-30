import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import './footer.css';

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="footer-content">
        <div className="footer-title">Psicoeduca</div>
        <div className="footer-icons">
          <a
            href="https://www.facebook.com/profile.php?id=100063462581485"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="footer-icon-link"
          >
            <FacebookIcon className="footer-icon" />
          </a>
          <a
            href="https://www.instagram.com/p.siedu/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="footer-icon-link"
          >
            <InstagramIcon className="footer-icon" />
          </a>
        </div>
        <div className="footer-description">
          Síguenos en redes sociales para novedades, recursos y tips de bienestar.
          <br />
          <span className="footer-bold">Contacto:</span>{' '}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=psicoeducared@gmail.com&su=Consulta%20sobre%20servicios&body=Hola%20Psicoeduca%2C%20me%20gustar%C3%ADa%20obtener%20informaci%C3%B3n%20sobre..."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email Psicoeduca"
            className="footer-link"
            >
            psicoeducared@gmail.com
            </a>
        </div>
        <div className="footer-location">
          Ubicación: México | Atención en línea y presencial
        </div>
      </div>
      <div className="footer-bottom">
        © 2025 Psicoeduca. Todos los derechos reservados.
      </div>
    </footer>
  );
}
