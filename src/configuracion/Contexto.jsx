import { createContext, useContext, useState } from "react";



export const UserContext = createContext();



export function Proveedor ({children}){
    const [usuario,setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);









    return(
        <UserContext.Provider value={{usuario,setUsuario,cargando,setCargando}}>
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