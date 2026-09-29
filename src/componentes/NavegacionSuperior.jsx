import React, { useState } from 'react'
import estilos from '../css/componentesCss/NavegacionSuperior.module.css'
import { NavLink, replace, useNavigate } from 'react-router';
import { useC } from '../configuracion/Contexto';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdClose } from 'react-icons/io';
const {header,ventana,carril,logo,vagon,botonLink,botonLinkActivo,botonHamburguesa,contenHamb,mostrarVentana} =  estilos;



export default function NavegacionSuperior() {

     const {usuario,setUsuario,setCargando} = useC();
     const navigate = useNavigate();

     const [verNav, setVerNav] = useState(false);


     const cerrarSesion = ()=>{
        setVerNav(false)
        setCargando(true);
        setUsuario(null);
     }

    const links= (
        <>
        <NavLink to='/' className={({isActive})=>isActive ? botonLinkActivo : botonLink} onClick={()=>setVerNav(false)}>Inicio</NavLink>
        <NavLink to='/sobreMi' className={({isActive})=>isActive ? botonLinkActivo: botonLink}  onClick={()=>setVerNav(false)} >Sobre mi</NavLink>
        <NavLink to='/talleres' className={({isActive})=>isActive ? botonLinkActivo: botonLink}  onClick={()=>setVerNav(false)} >Talleres</NavLink>
        <NavLink to='/contacto' className={({isActive})=>isActive ? botonLinkActivo: botonLink}  onClick={()=>setVerNav(false)} >Contacto</NavLink>
        {usuario && (usuario.rol === 'admin' ? <NavLink to='/administrador' className={({isActive})=>isActive ? botonLinkActivo : botonLink}  onClick={()=>setVerNav(false)} >Administrador</NavLink>: usuario.rol === 'normal' && <NavLink to='/miPerfil' className={({isActive})=>isActive ? botonLinkActivo : botonLink}  onClick={()=>setVerNav(false)} >Mi perfil</NavLink>) }
        {!usuario &&
        <>
        <NavLink to='/iniciarSesion' className={botonLink}>Iniciar Sesion</NavLink> 
        <NavLink to='/registroSesion' className={botonLink}>Registrarse</NavLink>
        </> 
         }
         {usuario && <NavLink to='/' className={botonLink} onClick={cerrarSesion}>Cerrar sesion</NavLink>}
        </>
    )



  return (
    <header className={header}>
        <div className={logo}>IMAGEN</div>    
        <nav className={verNav? `${ventana} ${mostrarVentana}`: ventana}>
            <div className={carril}>
                {links}
            </div>
        </nav>
          <div className={contenHamb} onClick={()=> setVerNav(!verNav)} >
            {
              !verNav ? <GiHamburgerMenu className={botonHamburguesa}/>: <IoMdClose  className={botonHamburguesa}/>
            }
          </div>
    </header>
  )
}
