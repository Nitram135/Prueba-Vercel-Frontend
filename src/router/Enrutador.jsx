import { Outlet, Route, Routes } from 'react-router';
import VistaInicio from '../vistas/VistaInicio';
import VistaPrincipal from '../vistas/VistaPrincipal';
import VistaNoEncontrado from '../vistas/VistaNoEncontrado';
import NavegacionSuperior from '../componentes/NavegacionSuperior';
import { useC } from '../configuracion/Contexto';
import VistaSobreMi from '../vistas/VistaSobreMi';
import VistaTalleres from '../vistas/VistaTalleres';
import VistaContacto from '../vistas/VistaContacto';
import VistaRegistro from '../vistas/VistaRegistro';
import Footer from '../componentes/Footer';
import estilos from '../App.module.css'
import RutasProtegidas from '../componentes/RutasProtegidas';
import VistaMiPerfil from '../vistas/VistaMiPerfil';
import NavegacionAdmin from '../componentes/NavegacionAdmin';
import VistaAdministrador from '../vistas/vistasAdministrador/VistaAdministrador';
const {contGrid,cabecera,cuerpo,pie,contAdmin,cabeceraAdmin,cuerpoAdmin} = estilos;








export default function Enrutador() {

    const {usuario, cargando} = useC();



   
  return ( 
    <>
      <Routes>
          <Route path='/iniciarSesion'  element={<VistaInicio/>} />
          <Route path='/registroSesion' element={<VistaRegistro/>}/>
          <Route element={
            <div className={contGrid}>
            <div className={cabecera}>
                <NavegacionSuperior/>
            </div>
            <div className={cuerpo}>
                <Outlet/>
            </div>
            <div className={pie}>
             {(!usuario || usuario.rol !== 'admin') && <Footer/>}
            </div>
            </div>
          }>
            <Route path='/'  index element={<VistaPrincipal/>} />
            <Route path='/sobreMi' element ={<VistaSobreMi/>}/> 
            <Route path='/talleres' element ={<VistaTalleres/>}/>
            <Route path='/contacto' element ={<VistaContacto/>}/>
            <Route element={
                <div className={contAdmin}>
                   <div className={cabeceraAdmin}>
                    <NavegacionAdmin/>
                   </div> 
                  <div className={cuerpoAdmin}>
                   <RutasProtegidas permiso={'admin'} rol={usuario?.rol} cargando={cargando} redireccion={'/'}/> 
                  </div> 
                </div>
                }>
              <Route path='/administrador' index element={<VistaAdministrador/>}/>
            </Route>
            <Route element={<RutasProtegidas permiso={'normal'} rol={usuario?.rol} cargando={cargando} redireccion={'/'}/>}>
                <Route path='/miPerfil' index element={<VistaMiPerfil/>}/>
            </Route>
          </Route>
          <Route path='*' element={<VistaNoEncontrado/>} />
      </Routes>  
    </>
  )
}
