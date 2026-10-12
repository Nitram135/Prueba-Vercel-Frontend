import { useLiveQuery } from "dexie-react-hooks";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db } from "./indexedDb";



export const UserContext = createContext();



export function Proveedor ({children}){

        const [cargando,setCargando] = useState(true);
        const [usuario,setUsuario] = useState(false);
        const [datosMemo, setDatosMemo] =  useState(null);




        useEffect(()=>{
            const cargarDatos = async()=>{
                try {
                 setCargando(true);

                 const [analisis, metodosArray] = await Promise.all([
                      db.listaAnalisis.toArray(),
                      db.metodos.toArray()
                 ])
                 setUsuario(true);
                 let metodosMap = {};
                 let objAnalisis = {}
                 let arrayAnalisis = [];
                 metodosArray.forEach((i)=> metodosMap[i.id] = i)
                 analisis.forEach((i)=>{
                     objAnalisis[i.id] = {...i, metodo:metodosMap[i.metodo]}
                     arrayAnalisis.push({codigo:i.codigo, nombre:i.nombre, id:i.id})
                 }) 
                    setDatosMemo({
                        metodosArray,
                        objAnalisis,
                        arrayAnalisis
                    });
                } catch (error) {
                    console.log(error)  
                } finally{
                    setCargando(false)
                }
            }
                cargarDatos();
        },[])    

        if(!usuario){
            return <div>Abriendo aplicacion...</div>
        }

    return(
        <UserContext.Provider value={{cargando,datosMemo}}>
            {children}
        </UserContext.Provider>

    )

}

export function useC(){
    const contexto = useContext(UserContext);
    if(!contexto){
        console.log('Algo salio mal')
    }
    return contexto;
}