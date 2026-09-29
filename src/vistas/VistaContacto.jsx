import React, { useState } from 'react'
import estilos from '../css/vistasCss/VistaContacto.module.css'
import {FaInstagram,FaFacebook,FaWhatsapp,} from 'react-icons/fa6'
import { MdEmail } from "react-icons/md";
import { useForm } from 'react-hook-form';

const {areaTexto,contenedorPadre,modalOpciones,instagram,contenedorEnlace,etiquetaEnlace,titulo, facebook,whatssap,contenedorMail,gmail,contenedorTitulo}= estilos;


export default function VistaContacto() {


    const [res,setRes]= useState(false);
  const {register,handleSubmit,formState:{errors},reset} = useForm({
    defaultValues:{
      email:''
    }
  });


     return (
    <div className={contenedorPadre}>
        <div className={modalOpciones}>
          <h2 className={titulo}>Mis medios de Contacto</h2>
          <a href="https://www.instagram.com/giselle.rodriguezm/" target='_blank' className={etiquetaEnlace}>
          <div className={contenedorEnlace}>
           <FaInstagram  className={instagram}/>
           <span>giselle.rodriguezm</span>
          </div>
          </a>
          <a href="https://www.facebook.com/GiselleRodriguezMayol/" target='_blank' className={etiquetaEnlace}>
          <div className={contenedorEnlace}>
           <FaFacebook  className={facebook}/>
           <span>giselle.rodriguezm</span>
          </div>
          </a>
          <a href="https://wa.me/5493814426480" target='_blank' className={etiquetaEnlace}>
          <div className={contenedorEnlace}>
           <FaWhatsapp  className={whatssap}/>
           <span>giselle.rodriguezm</span>
          </div>
          </a>
          <form className={contenedorMail}>
            <div className={contenedorTitulo}>
              <MdEmail className={gmail} />
              <span>Enviame un mail</span>
            </div>
            <textarea className={areaTexto} ></textarea>
          </form>
          <button>Enviar email</button>
        </div>
    </div>
  )
}
