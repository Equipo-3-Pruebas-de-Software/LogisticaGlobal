import { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { Calendar } from 'primereact/calendar';
import { useUser } from '../../context/UserContext';

export const SupervisorDashboard = () => {
  const { usuario } = useUser();
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [filters, setFilters] = useState({ fechaInicio: null, fechaFin: null });

  useEffect(() => {
    fetch('/incidentes/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener data Dashboard');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setFilteredData(data); // inicializa sin filtro
      })
      .catch((err) => console.error('[ERROR FETCH INCIDENTES DATA]', err));
  }, []);

  useEffect(() => {
    if (!data) return;

    const { fechaInicio, fechaFin } = filters;

    const dentroDeRango = (fechaStr) => {
      const fecha = new Date(fechaStr);
      return (!fechaInicio || fecha >= fechaInicio) && (!fechaFin || fecha <= fechaFin);
    };

    const filtrados = {
      ...data,
      incidentes: data.incidentes?.filter(i => dentroDeRango(i.fecha)),
      gravedades: data.gravedades,
      prioridades: data.prioridades,
      robots: data.robots,
      tecnicos: data.tecnicos
    };

    setFilteredData(filtrados);
  }, [filters, data]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`
        }
      }
    }
  };

  const chartDataEstado = {
    labels: filteredData?.incidentes?.map(item => item?.estado.charAt(0).toUpperCase() + item.estado.slice(1)),
    datasets: [
      {
        data: filteredData?.incidentes?.map(item => item.total),
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF6384'],
        hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#FF7A85']
      }
    ]
  };

  const chartDataGravedad = {
    labels: filteredData?.gravedades?.map(item =>
      item.gravedad ? item.gravedad.charAt(0).toUpperCase() + item.gravedad.slice(1) : "Sin clasificar"),
    datasets: [
      {
        data: filteredData?.gravedades?.map(item => item.total),
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF6384'],
        hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#FF7A85']
      }
    ]
  };

  const chartDataPrioridades = {
    labels: filteredData?.prioridades?.map(item => item.prioridad ?? 'Sin Clasificar'),
    datasets: [
      {
        data: filteredData?.prioridades?.map(item => item.total),
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF6384'],
        hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#FF7A85']
      }
    ]
  };

  const chartDataRobots = {
    labels: filteredData?.robots?.map(item => item?.estado.charAt(0).toUpperCase() + item.estado.slice(1)),
    datasets: [
      {
        data: filteredData?.robots?.map(item => item.total),
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF6384'],
        hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#FF7A85']
      }
    ]
  };

  return (
    <>
      <h1 className='dashboard-welcome'>¡Hola, {usuario.nombre}!</h1>

      <div className='all-filters' style={{ display: 'flex', gap: '1rem'}}>
        <Calendar
          value={filters.fechaInicio}
          onChange={(e) => setFilters(f => ({ ...f, fechaInicio: e.value }))}
          placeholder="Fecha Inicio"
          showIcon
        />
        <Calendar
          value={filters.fechaFin}
          onChange={(e) => setFilters(f => ({ ...f, fechaFin: e.value }))}
          placeholder="Fecha Fin"
          showIcon
        />
      </div>

      <section className='incidentes'>
        <h2 className='dashboard-title'>Incidentes</h2>
        <div className='div-incidentes'>
          <article className="cards-dashboard">
            <section>
              <h2>Creados</h2>
              <h3>{filteredData?.incidentes.find(inc => inc.estado === 'creado')?.total || 0}</h3>
            </section>
            <section>
              <h2>Técnicos asignados</h2>
              <h3>{filteredData?.incidentes.find(inc => inc.estado === 'técnico asignado')?.total || 0}</h3>
            </section>
            <section>
              <h2>En espera de aprobación</h2>
              <h3>{filteredData?.incidentes.find(inc => inc.estado === 'en espera de aprobación')?.total || 0}</h3>
            </section>
          </article>

          <div className='chart'>
            <h2>Incidentes por estado</h2>
            <Chart type="pie" data={chartDataEstado} options={chartOptions} />
          </div>

          <div className='chart'>
            <h2>Incidentes por gravedad</h2>
            <Chart type="pie" data={chartDataGravedad} options={chartOptions} />
          </div>

          <div className='chart'>
            <h2>Incidentes por prioridad</h2>
            <Chart type="pie" data={chartDataPrioridades} options={chartOptions} />
          </div>
        </div>
      </section>

      <section className='incidentes'>
        <h2 className='dashboard-title'>Robots</h2>
        <div className='div-incidentes'>
          <article className="cards-dashboard">
            <section>
              <h2>Robots fuera de servicio</h2>
              <h3>{filteredData?.robots.find(inc => inc.estado === 'fuera de servicio')?.total || 0}</h3>
            </section>
            <section>
              <h2>Robots en reparación</h2>
              <h3>{filteredData?.robots.find(inc => inc.estado === 'en reparación')?.total || 0}</h3>
            </section>
            <section>
              <h2>Robots operativos</h2>
              <h3>{filteredData?.robots.find(inc => inc.estado === 'operativo')?.total || 0}</h3>
            </section>
          </article>

          <div className='chart'>
            <h2>Estado de los Robots</h2>
            <Chart type="pie" data={chartDataRobots} options={chartOptions} />
          </div>

          <article className="cards-dashboard">
            <section>
              <h2>Técnicos trabajando</h2>
              <h3>{filteredData?.tecnicos.find(tec => tec.disponibilidad === 0)?.total || 0}</h3>
            </section>
            <section>
              <h2>Técnicos disponibles</h2>
              <h3>{filteredData?.tecnicos.find(tec => tec.disponibilidad === 1)?.total || 0}</h3>
            </section>
          </article>
        </div>
      </section>
    </>
  );
};

export default SupervisorDashboard;
