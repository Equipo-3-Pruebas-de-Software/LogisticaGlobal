import { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';

import incidentesData from "../../mockups/incidentes.json";        

export const SupervisorDashboard = () => {

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const gravedadCounts = {};
    incidentesData .forEach(i => {
      const key = i.gravedad ? i.gravedad : 'Sin asignar';
      gravedadCounts[key] = (gravedadCounts[key] || 0) + 1;
    });

    const rawLabels = Object.keys(gravedadCounts);          // 'alta', 'media', etc.
    const labels = rawLabels.map(capitalize);  
    const values = Object.values(gravedadCounts);

    // Definir colores por gravedad
    const gravedadColors = {
      Alta: 'rgb(221, 92, 92)',           // rojo
      Media: 'rgb(245, 203, 89)',          // amarillo
      Baja: 'rgb(35, 155, 65)',           // verde
      'Sin asignar': '#9ca3af'   // gris
    };

    const backgroundColor = labels.map(label => gravedadColors[label] || '#d1d5db');
    const hoverBackgroundColor = backgroundColor.map(c => c); // puedes hacer hover más claro si deseas

    setChartData({
      labels,
      datasets: [
        {
          data: values,
          backgroundColor,
          hoverBackgroundColor
        }
      ]
    });

    setChartOptions({
      plugins: {
        legend: {
          labels: {
            usePointStyle: true
          }
        }
      }
    });
  }, []);

    return (
      <>
        <h1>Hola, supevisor!</h1>
        <div className="dashboard-top">
          <article className="cards-dashboard">
            <section>
              <h2>Nuevos incidentes creados</h2>
              <h3>3</h3>
            </section>
            <section>
              <h2>En espera de aprobación</h2>
              <h3>4</h3>
            </section>
            <section>
              <h2>Robots no operativos</h2>
              <h3>10</h3>
            </section>
          </article>
          <div className='chart'>
            <h2>Incidentes por gravedad</h2>
            <Chart type="pie" data={chartData} options={chartOptions}/>
          </div>
        </div>
        
        <h2 className='title-incidentes-criticos'>Incidentes críticos</h2>
      </>
    )
  }
  
  export default SupervisorDashboard;