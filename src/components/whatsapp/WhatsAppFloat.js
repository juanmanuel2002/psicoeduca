import React from "react";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import './whatsapp.css'


export default function WhatsAppFloat() {
  const phone = process.env.REACT_APP_WHATSAPP_PHONE;
  const message = process.env.REACT_APP_WHATSAPP_MESSAGE;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={url}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
    >
      <WhatsAppIcon style={{ fontSize: 40 }} />
    </a>
  );
}
