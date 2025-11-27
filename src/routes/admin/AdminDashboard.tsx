import React from 'react';
// We might not need a back button if this is a top-level admin view
// import { ArrowLeft } from 'lucide-react'; 
// import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  // const nav = useNavigate(); // If you add navigation controls

  // --- Placeholder Data (Replace with actual data fetching) ---
  const kpis = {
    activeUsers: 150,
    engagementRate: 75, // Percentage
    moodTrend: 'positive', // 'positive', 'negative', 'neutral'
    commonThemes: ['Estrés laboral', 'Comunicación', 'Límites'],
  };
  // ---

  return (
    // Using a different background color to distinguish admin area
    <div className="min-h-screen bg-gray-100 p-6"> 
      <div className="max-w-4xl mx-auto"> {/* Wider container for dashboard */}
        
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Administración HR</h1>
          <p className="text-gray-600">Resumen del bienestar y uso de la plataforma.</p>
        </header>

        {/* KPI Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card Example 1: Active Users */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Usuarios Activos (Mes)</h2>
            <p className="text-3xl font-bold text-violet-600">{kpis.activeUsers}</p>
          </div>

           {/* Card Example 2: Engagement Rate */}
           <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Tasa de Engagement</h2>
            <p className="text-3xl font-bold text-violet-600">{kpis.engagementRate}%</p>
          </div>

           {/* Card Example 3: Mood Trend */}
           <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Tendencia Ánimo General</h2>
            {/* Simple display, could be a small chart */}
            <p className={`text-3xl font-bold ${kpis.moodTrend === 'positive' ? 'text-green-600' : kpis.moodTrend === 'negative' ? 'text-red-600' : 'text-yellow-600'}`}>
              {kpis.moodTrend === 'positive' ? 'Positiva 😊' : kpis.moodTrend === 'negative' ? 'Negativa 😟' : 'Neutral 😐'}
            </p>
          </div>

           {/* Card Example 4: Maybe Link to User Management */}
           <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col justify-center items-center">
             <h2 className="text-sm font-medium text-gray-500 mb-2">Gestión</h2>
             {/* Link placeholder */}
             <button className="px-4 py-2 bg-violet-100 text-violet-700 font-semibold rounded-md text-sm hover:bg-violet-200">
               Gestionar Usuarios
             </button>
           </div>
        </section>

        {/* Other Dashboard Sections (e.g., Charts, Recent Activity) */}
        <section className="bg-white p-6 rounded-lg shadow border border-gray-200">
           <h2 className="text-lg font-semibold text-gray-700 mb-4">Temas Comunes Mencionados</h2>
           {kpis.commonThemes.length > 0 ? (
             <div className="flex flex-wrap gap-2">
               {kpis.commonThemes.map((theme, index) => (
                 <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                   {theme}
                 </span>
               ))}
             </div>
           ) : (
             <p className="text-gray-500">No hay datos suficientes aún.</p>
           )}
           {/* Placeholder for more detailed reports or charts */}
        </section>

         {/* Add more sections as needed: Usage charts, quiz results summary, etc. */}

      </div>
    </div>
  );
}