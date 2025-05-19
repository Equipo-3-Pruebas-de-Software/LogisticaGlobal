import { useEffect , useState} from 'react';
import { Chart } from 'primereact/chart';
import { useUser } from '../../context/UserContext';


export const SupervisorDashboard = () => {

  const { usuario } = useUser();
  const [data, setData] = useState(null);

  useEffect(() => {
      fetch('/incidentes/dashboard') 
        .then((res) => {
          if (!res.ok) throw new Error('Error al obtener data Dashboard');
          return res.json();
        })
        .then((data) => {
          setData(data);
        })
        .catch((err) => console.error('[ERROR FETCH INCIDENTES DATA]', err));
  }, []);

  const chartDataEstado = {
  labels: data?.incidentes?.map(item => item?.estado.charAt(0).toUpperCase() + item.estado.slice(1)),
  datasets: [
    {
      data: data?.incidentes?.map(item => item.total),
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF6384'],
      hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#FF7A85']
    }
    ]
  };

  const chartDataGravedad = {
  labels: data?.gravedades?.map(item => item.gravedad ? item.gravedad.charAt(0).toUpperCase() + item.gravedad.slice(1) : "Sin clasificar"),
  datasets: [
    {
      data: data?.gravedades?.map(item => item.total),
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF6384'],
      hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#FF7A85']
    }
    ]
  };

  const chartDataPrioridades = {
  labels: data?.prioridades?.map(item => item.prioridad ?? 'Sin Clasificar'),
  datasets: [
    {
      data: data?.prioridades?.map(item => item.total),
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF6384'],
      hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#FF7A85']
    }
    ]
  };

  const chartDataRobots = {
  labels: data?.robots?.map(item => item?.estado.charAt(0).toUpperCase() + item.estado.slice(1)),
  datasets: [
    {
      data: data?.robots?.map(item => item.total),
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF6384'],
      hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#FF7A85']
    }
    ]
  };

  const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem) => {
          return `${tooltipItem.label}: ${tooltipItem.raw}`;
          }
        }
      }
    }
  };
  

  console.log(data)

    return (
      <>
        <h1 className='dashboard-welcome'>¡Hola, {usuario.nombre}!</h1>

        <section className='incidentes'>
          <h2 className='dashboard-title'>Incidentes</h2>
          <div className='div-incidentes'>
            <article className="cards-dashboard">
              <section>
                <h2>Creados</h2>
                <h3>{data?.incidentes.find(inc => inc.estado === 'creado')?.total || 0}</h3>
              </section>
              <section>
                <h2>Técnicos asignados</h2>
                <h3>{data?.incidentes.find(inc => inc.estado === 'técnico asignado')?.total || 0}</h3>
              </section>
              <section>
                <h2>En espera de aprobación</h2>
                <h3>{data?.incidentes.find(inc => inc.estado === 'en espera de aprobación')?.total || 0}</h3>
              </section>
            </article>

            <div className='chart'>
              <h2>Incidentes por estado</h2>
              <Chart type="pie" data={chartDataEstado} options={chartOptions}/>
            </div>

            <div className='chart'>
              <h2>Incidentes por gravedad</h2>
              <Chart type="pie" data={chartDataGravedad} options={chartOptions}/>
            </div>

            <div className='chart'>
              <h2>Incidentes por prioridad</h2>
              <Chart type="pie" data={chartDataPrioridades} options={chartOptions}/>
            </div>
          </div>
        </section>

        <section className='incidentes'>
          <h2 className='dashboard-title'>Robots</h2>
          <div className='div-incidentes'>
            <article className="cards-dashboard">
              <section>
                <h2>Robots fuera de servicio</h2>
                <h3>{data?.robots.find(inc => inc.estado === 'fuera de servicio')?.total || 0}</h3>
              </section>
              <section>
                <h2>Robots en reparación</h2>
                <h3>{data?.robots.find(inc => inc.estado === 'en reparación')?.total || 0}</h3>
              </section>
              <section>
                <h2>Robots operativos</h2>
                <h3>{data?.robots.find(inc => inc.estado === "operativo")?.total || 0}</h3>
              </section>
            </article>
            <div className='chart'>
              <h2>Estado de los Robots</h2>
              <Chart type="pie" data={chartDataRobots} options={chartOptions}/>
            </div>
            <article className="cards-dashboard">
              <section>
                <h2>Técnicos trabajando</h2>
                <h3>{data?.tecnicos.find(inc => inc.disponibilidad === 0)?.total || 0}</h3>
              </section>
              <section>
                <h2>Técnicos disponibles</h2>
                <h3>{data?.tecnicos.find(inc => inc.disponibilidad === 1)?.total || 0}</h3>
              </section>
            </article>
          </div>
          
        </section>
        
      </>
    )
  }
  
  export default SupervisorDashboard;