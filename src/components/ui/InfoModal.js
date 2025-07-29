import React from "react";

export default function InfoModal({ open, title, message, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.3)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="modal-content" style={{background:'#fff',padding:32,borderRadius:12,minWidth:320,maxWidth:400,boxShadow:'0 2px 16px rgba(0,0,0,0.15)', textAlign:'center'}}>
        {title && <h2 style={{marginTop:0}}>{title}</h2>}
        {message && <p style={{marginTop: 25}}>{message}</p>}
        {children}
      </div>
    </div>
  );
}
