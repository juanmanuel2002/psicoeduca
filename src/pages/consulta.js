import React, { useEffect, useState} from 'react';
import WhatsAppFloat from '../components/whatsapp/WhatsAppFloat';
import Header from "../components/header";
import Footer from '../components/footer';


export default function Consulta() {

    return (
        <div className="home-container">
            <Header />
            <WhatsAppFloat />
            <Footer />
        </div>
    );
}
