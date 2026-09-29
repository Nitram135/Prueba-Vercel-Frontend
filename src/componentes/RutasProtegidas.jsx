import React from 'react'
import { useC } from '../configuracion/Contexto'
import { Navigate, Outlet } from 'react-router'

export default function RutasProtegidas({permiso,rol,cargando, redireccion}) {


    if(!rol){
        <Navigate to={redireccion} replace/>
    }

    if(cargando){
        return <div>Esperando datos...</div>
    }

    if(permiso !== rol){

        <Navigate to={redireccion} replace/>  
    }

  return (
        <>
            <Outlet/>
        </>
  )
}

