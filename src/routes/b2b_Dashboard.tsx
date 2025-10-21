import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";

type Word = { text: string; size: number };

export default function B2BDashboard() {
  // --- UI state ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((s) => !s);

  // --- Mock data ---
  const totalEmployees = 430;
  const activeUsers = 310;

  const adoptionRate = useMemo(
    () => Math.round((activeUsers / totalEmployees) * 100),
    [activeUsers, totalEmployees]
  );

  const activityData = useMemo(
    () => ({
      labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
      datasets: [
        {
          label: "Sesiones Iniciadas",
          data: [65, 59, 80, 81, 56, 55, 90],
          fill: true,
          backgroundColor: "rgba(139, 92, 246, 0.2)", // violeta 500 con alpha
          borderColor: "rgb(139, 92, 246)",
          tension: 0.4,
        },
      ],
    }),
    []
  );

  const departmentData = useMemo(
    () => ({
      labels: ["Ventas", "Ingeniería", "Marketing", "RH"],
      datasets: [
        {
          label: "Adopción",
          data: [120, 85, 65, 40],
          backgroundColor: ["#8B5CF6", "#6366F1", "#34D399", "#F59E0B"],
          hoverOffset: 4,
        },
      ],
    }),
    []
  );

  const wordCloudData: Word[] = useMemo(
    () => [
      { text: "Comunicación", size: 40 },
      { text: "Ansiedad", size: 35 },
      { text: "Límites", size: 30 },
      { text: "Estrés", size: 28 },
      { text: "Pareja", size: 25 },
      { text: "Autoestima", size: 22 },
      { text: "Manejo del tiempo", size: 18 },
      { text: "Confianza", size: 15 },
    ],
    []
  );

  // --- Charts refs / lifecycle ---
  const activityRef = useRef<HTMLCanvasElement | null>(null);
  const departmentRef = useRef<HTMLCanvasElement | null>(null);
  const activityChartRef = useRef<Chart | null>(null);
  const departmentChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (activityRef.current) {
      activityChartRef.current?.destroy();
      activityChartRef.current = new Chart(activityRef.current, {
        type: "line",
        data: activityData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false } },
        },
      });
    }
    if (departmentRef.current) {
      departmentChartRef.current?.destroy();
      departmentChartRef.current = new Chart(departmentRef.current, {
        type: "doughnut",
        data: departmentData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom" } },
        },
      });
    }
    return () => {
      activityChartRef.current?.destroy();
      departmentChartRef.current?.destroy();
    };
  }, [activityData, departmentData]);

  return (
    <div className="bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={[
            "sidebar w-64 bg-violet-800 text-white flex flex-col absolute inset-y-0 left-0 transform z-30",
            "transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "md:relative md:translate-x-0",
          ].join(" ")}
        >
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-2xl font-bold">Violetta B2B</span>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <a className="flex items-center px-4 py-2 text-violet-100 bg-violet-900 rounded-lg" href="#">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Dashboard
            </a>
            <a className="flex items-center px-4 py-2 text-violet-300 hover:bg-violet-700 hover:text-white rounded-lg" href="#">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-5.197M12 15a4 4 0 110-8 4 4 0 010 8z"></path>
              </svg>
              Gestión de Usuarios
            </a>
            <a className="flex items-center px-4 py-2 text-violet-300 hover:bg-violet-700 hover:text-white rounded-lg" href="#">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Reportes
            </a>
          </nav>
          <div className="px-6 py-4 border-t border-violet-700">
            <a className="flex items-center text-violet-300 hover:text-white" href="#">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Cerrar Sesión
            </a>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm flex justify-between items-center p-4">
            <button className="text-gray-500 md:hidden" onClick={toggleSidebar}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-700">Dashboard de Bienestar</h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Admin RH</span>
              <img
                className="h-8 w-8 rounded-full object-cover"
                src="https://placehold.co/100x100/667eea/ffffff?text=A"
                alt="Admin Avatar"
              />
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                iconBg="bg-blue-100"
                iconColor="text-blue-500"
                title="Tasa de Adopción"
                value={`${adoptionRate}%`}
              />
              <KPICard
                iconBg="bg-green-100"
                iconColor="text-green-500"
                title="Usuarios Activos (Semana)"
                value={String(activeUsers)}
              />
              <KPICard
                iconBg="bg-yellow-100"
                iconColor="text-yellow-500"
                title="Caminos Completados"
                value="452"
              />
              <KPICard
                iconBg="bg-red-100"
                iconColor="text-red-500"
                title="Satisfacción Promedio"
                value="4.8/5"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Actividad Semanal (Sesiones)</h3>
                <div className="mt-4 h-64">
                  <canvas ref={activityRef} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Adopción por Departamento</h3>
                <div className="mt-4 h-64">
                  <canvas ref={departmentRef} />
                </div>
              </div>
            </div>

            {/* Word Cloud & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Temas de Interés (Anónimo)</h3>
                <div className="mt-4 min-h-[250px] flex flex-wrap items-start content-start">
                  {wordCloudData
                    .slice()
                    .sort((a, b) => b.size - a.size)
                    .map((word) => {
                      const fontSize = 12 + (word.size / 40) * 16;
                      const opacity = 0.6 + (word.size / 40) * 0.4;
                      const weight = fontSize > 20 ? "font-semibold" : "font-medium";
                      return (
                        <span
                          key={word.text}
                          className={`inline-block p-2 m-1 rounded-lg bg-gray-100 text-gray-700 ${weight}`}
                          style={{ fontSize, opacity }}
                        >
                          {word.text}
                        </span>
                      );
                    })}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Progreso en Caminos</h3>
                <ul className="mt-4 space-y-4">
                  <PathProgress label="Ruptura ❤️‍🩹" color="bg-violet-600" pct={75} />
                  <PathProgress label="Amor Propio ✨" color="bg-emerald-500" pct={45} />
                  <PathProgress label="Comunicación Asertiva" color="bg-sky-500" pct={60} />
                </ul>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

/* ------------ UI helpers ------------ */
function KPICard({
  iconBg,
  iconColor,
  title,
  value,
}: {
  iconBg: string;
  iconColor: string;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
      <div className={`${iconBg} p-3 rounded-full`}>
        <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function PathProgress({ label, color, pct }: { label: string; color: string; pct: number }) {
  return (
    <li>
      <p className="text-sm font-medium text-gray-800">{label}</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-500 text-right">{pct}% completado en promedio</p>
    </li>
  );
}
