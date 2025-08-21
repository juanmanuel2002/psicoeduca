
import React, {useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function RecursosFiltro({ filtros, setFiltros, search, setSearch }) {
    useEffect(() => {
        AOS.init({ duration: 1000, once: false });
        }, []);
    return (
        <aside data-aos="fade-up" className="recursos-filtro">
        <div className="filtro-busqueda">
            <input
            type="text"
            placeholder="Buscar recurso..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            />
            <span className="filtro-lupa">🔍</span>
        </div>
        <div className="filtro-seccion">
            <div className="filtro-titulo">Recursos</div>
            <label><input type="checkbox" checked={filtros.gratuitos} onChange={()=>setFiltros(f=>({...f, gratuitos:!f.gratuitos}))}/> Gratuitos</label>
            <label><input type="checkbox" checked={filtros.ayudaPersonal} onChange={()=>setFiltros(f=>({...f, ayudaPersonal:!f.ayudaPersonal}))}/> Ayuda personal</label>
            <label><input type="checkbox" checked={filtros.duelo} onChange={()=>setFiltros(f=>({...f, duelo:!f.duelo}))}/> Duelo</label>
        </div>
        <div className="filtro-seccion">
            <div className="filtro-titulo">Seminarios</div>
            <label><input type="checkbox" checked={filtros.nuevos} onChange={()=>setFiltros(f=>({...f, nuevos:!f.nuevos}))}/> Nuevos</label>
            <label><input type="checkbox" checked={filtros.pasados} onChange={()=>setFiltros(f=>({...f, pasados:!f.pasados}))}/> Pasados</label>
            <label><input type="checkbox" checked={filtros.sincronos} onChange={()=>setFiltros(f=>({...f, sincronos:!f.sincronos}))}/> Sincronos</label>
            <label><input type="checkbox" checked={filtros.asincronos} onChange={()=>setFiltros(f=>({...f, asincronos:!f.asincronos}))}/> Asincronos</label>
        </div>
        <div className="filtro-seccion">
            <div className="filtro-titulo">Talleres</div>
            <label><input type="checkbox" checked={filtros.tallerSincrono} onChange={()=>setFiltros(f=>({...f, tallerSincrono:!f.tallerSincrono}))}/> Sincronos</label>
            <label><input type="checkbox" checked={filtros.tallerAsincrono} onChange={()=>setFiltros(f=>({...f, tallerAsincrono:!f.tallerAsincrono}))}/> Asincronos</label>
        </div>
        </aside>
    );
}
