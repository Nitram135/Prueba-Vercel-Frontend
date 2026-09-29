import React from 'react'
import estilos from '../css/vistasCss/VistaSobreMi.module.css'
const {cont,contTexto,texto,contImagen,imagen} = estilos;
export default function VistaSobreMi() {



  return (
    <div className={cont}>
        <div className={contTexto}>
            <p className={texto}>
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum quidem labore dignissimos alias esse quia soluta quae id magni veritatis quasi voluptatem quibusdam ex quis doloremque nostrum repudiandae, debitis voluptas.
            </p>
        </div>
        <div className={contImagen}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit facere quidem maiores ad odio natus excepturi ipsa blanditiis labore non, aliquid hic vitae itaque harum atque omnis nemo similique nostrum!
            {/* <img src="" alt=""  className={imagen}/> */}
        </div>
    </div>
  )
}
