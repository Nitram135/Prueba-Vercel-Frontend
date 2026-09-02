import  estilos from './App.module.css'
import Pregunta1 from './Pregunta1'
const {contenedor} = estilos

function App() {

  return (
    <>
      <div className={contenedor}>
        <Pregunta1 />
      </div>
    </>
  )
}

export default App
