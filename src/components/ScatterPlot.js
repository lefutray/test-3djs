import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const ScatterPlot = ({ width = 600, height = 400, margin = { top: 20, right: 20, bottom: 30, left: 40 } }) => {
  const svgRef = useRef();
  const [data, setData] = useState([
    { x: 50, y: 100 },
    { x: 150, y: 200 },
    { x: 250, y: 150 },
    { x: 350, y: 250 },
    { x: 450, y: 100 }
  ]);
  
  const [newPoint, setNewPoint] = useState({ x: '', y: '' });

  // Dimensiones del gráfico
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Función para agregar un nuevo punto
  const addPoint = () => {
    if (newPoint.x !== '' && newPoint.y !== '') {
      const x = parseInt(newPoint.x, 10);
      const y = parseInt(newPoint.y, 10);
      
      if (!isNaN(x) && !isNaN(y)) {
        setData([...data, { x, y }]);
        setNewPoint({ x: '', y: '' });
      }
    }
  };

  // Función para manejar el clic en el SVG y agregar un punto
  const handleSvgClick = (event) => {
    const svg = d3.select(svgRef.current);
    const svgElement = svg.node();
    const svgRect = svgElement.getBoundingClientRect();
    
    // Obtener la posición del clic relativa al SVG
    const mouseX = event.clientX - svgRect.left - margin.left;
    const mouseY = event.clientY - svgRect.top - margin.top;
    
    // Crear las mismas escalas que se usan para renderizar el gráfico
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.x) * 1.1 || 100])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y) * 1.1 || 100])
      .range([innerHeight, 0]);
    
    // Convertir coordenadas de píxeles a valores de datos
    const x = Math.round(xScale.invert(mouseX));
    const y = Math.round(yScale.invert(mouseY));
    
    // Verificar que el punto esté dentro de los límites del gráfico
    if (mouseX >= 0 && mouseX <= innerWidth && mouseY >= 0 && mouseY <= innerHeight) {
      setData([...data, { x, y }]);
    }
  };

  // Efecto para renderizar y actualizar el gráfico
  useEffect(() => {
    if (!data.length) return;

    // Limpiar SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Crear grupo principal con margen
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Escalas
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.x) * 1.1])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y) * 1.1])
      .range([innerHeight, 0]);

    // Ejes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Agregar ejes
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    // Agregar etiquetas de ejes
    g.append('text')
      .attr('class', 'x-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 5)
      .style('text-anchor', 'middle')
      .text('Eje X');

    g.append('text')
      .attr('class', 'y-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 10)
      .style('text-anchor', 'middle')
      .text('Eje Y');

    // Agregar puntos
    g.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5)
      .style('fill', 'steelblue')
      .style('stroke', '#fff')
      .style('stroke-width', 1.5)
      .append('title')
      .text(d => `(${d.x}, ${d.y})`);

  }, [data, innerWidth, innerHeight, margin]);

  return (
    <div className="scatter-plot-container">
      <div className="input-container">
        <div>
          <label htmlFor="x-input">X: </label>
          <input
            id="x-input"
            type="number"
            value={newPoint.x}
            onChange={(e) => setNewPoint({ ...newPoint, x: e.target.value })}
            placeholder="Valor X"
          />
        </div>
        <div>
          <label htmlFor="y-input">Y: </label>
          <input
            id="y-input"
            type="number"
            value={newPoint.y}
            onChange={(e) => setNewPoint({ ...newPoint, y: e.target.value })}
            placeholder="Valor Y"
          />
        </div>
        <button onClick={addPoint}>Agregar Punto</button>
      </div>
      
      <div className="chart-container">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          onClick={handleSvgClick}
        />
      </div>
      
      <div className="data-table">
        <h3>Puntos ({data.length})</h3>
        <table>
          <thead>
            <tr>
              <th>X</th>
              <th>Y</th>
            </tr>
          </thead>
          <tbody>
            {data.map((point, index) => (
              <tr key={index}>
                <td>{point.x}</td>
                <td>{point.y}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScatterPlot;
