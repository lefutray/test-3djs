import React from 'react';
import './App.css';
import ScatterPlot from './components/ScatterPlot';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Gráfico de Puntos Reactivo con D3.js</h1>
        <p>Haz clic en el gráfico para agregar puntos o usa el formulario</p>
      </header>
      <main>
        <ScatterPlot />
      </main>
      <footer>
        <p>Creado con React y D3.js</p>
      </footer>
    </div>
  );
}

export default App;
