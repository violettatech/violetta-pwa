import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
// Importa iconos
import {
  Info,
  Phone,
  UserCircle,
  Wind,
  Plus,
  X,
} from 'lucide-react';

// Define el tipo de Contacto
type Contact = { name: string; phone: string };

export default function MyNetwork() {
  const nav = useNavigate();

  // Estado para la lista de contactos, inicializado con los de la imagen
  const [contacts, setContacts] = useState<Contact[]>([
    { name: 'Ana (Hermana)', phone: '555-1234' },
    { name: 'Laura (Mejor amiga)', phone: '555-5678' },
  ]);

  // Estados para controlar los modales
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  // Estados para el formulario de nuevo contacto
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Función para agregar un nuevo contacto
  const handleAddContact = () => {
    if (newContactName.trim() && newContactPhone.trim()) {
      setContacts([...contacts, { name: newContactName, phone: newContactPhone }]);
      // Limpiar y cerrar el modal
      setNewContactName('');
      setNewContactPhone('');
      setShowAddContactModal(false);
    } else {
      alert('Por favor, completa ambos campos.');
    }
  };

  return (
    <div className="pb-24 space-y-6 p-4 bg-gray-50 min-h-screen">
      {/* Encabezado con título e icono de info */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mi Red</h2>
        <button
          onClick={() => setShowInfoModal(true)}
          className="text-gray-500 hover:text-gray-800"
        >
          <Info size={24} />
        </button>
      </div>

      {/* Sección de "Necesitas apoyo ahora" (de la img 2) */}
      <section className="rounded-2xl bg-pink-100 border border-pink-200 p-4 shadow-sm">
        <h3 className="font-bold text-lg text-pink-800">
          ¿Necesitas apoyo ahora?
        </h3>
        <p className="text-pink-700 my-2 text-sm">
          Presiona aquí para contactar con líneas de ayuda profesionales de
          inmediato.
        </p>
        <a
          href="tel:5552598121"
          className="block w-full rounded-full bg-pink-600 px-4 py-3 text-center font-semibold text-white shadow-md hover:bg-pink-700"
        >
          Llamar a línea de ayuda
        </a>
      </section>

      {/* Sección de Herramientas de Calma (Modificada) */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Mis Herramientas de Calma
        </h3>
        <div>
          {/* Botón único a pantalla completa */}
          <button
            onClick={() => nav('/dashboard/exercises')} // Asumiendo que esta es la ruta
            className="w-full flex items-center justify-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50"
          >
            <Wind size={28} className="text-blue-500" />
            <span className="font-semibold text-gray-800 text-base">
              Respiración Guiada
            </span>
          </button>
        </div>
      </section>

      {/* Sección de Contactos de Confianza */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Mis Contactos de Confianza
        </h3>
        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <UserCircle size={36} className="text-purple-400" />
                <div>
                  <p className="font-semibold text-gray-900">{contact.name}</p>
                  <p className="text-sm text-gray-500">{contact.phone}</p>
                </div>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="p-2 text-purple-600 rounded-full hover:bg-purple-100"
              >
                <Phone size={24} />
              </a>
            </div>
          ))}
          <button
            onClick={() => setShowAddContactModal(true)}
            className="w-full flex items-center justify-center gap-2 p-3 bg-purple-100 text-purple-700 font-semibold rounded-2xl hover:bg-purple-200"
          >
            <Plus size={20} />
            Agregar contacto
          </button>
        </div>
      </section>

      {/* Sección de Recursos Profesionales (Simplificada) */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Recursos Profesionales
        </h3>
        <div className="space-y-3">
          {/* Texto explicativo nuevo */}
          <p className="text-sm text-gray-700 pt-2 px-1">
            El botón te llevará a un directorio de recursos profesionales amplio
            para que puedas buscar la mejor opción más cercana y que se alinee
            con tus necesidades.
          </p>

          {/* Botón nuevo de Recursos Profesionales (CON COLOR) */}
          <a
            href="https://holasoyvioletta.com/ayuda-profesional/"
            target="_blank"
            rel="noreferrer"
            className="block w-full rounded-xl bg-purple-600 px-4 py-3 text-center font-semibold text-white hover:bg-purple-700 shadow-sm"
          >
            Recursos Profesionales
          </a>
        </div>
      </section>

      {/* --- CAMBIO 4: INICIO --- */}
      {/* Modal de Información (Texto actualizado) */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Tu Red de Apoyo</h4>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Texto de instrucciones nuevo y mejor espaciado */}
            <div className="text-gray-700 space-y-4">
              <p>
                Este es tu espacio seguro con acceso rápido a ayuda.
              </p>
              
              <div className="text-sm">
                <p className="font-semibold text-gray-800 mb-1">¿Necesitas apoyo ahora?</p>
                Usa el botón rosa para llamar a una línea de ayuda profesional de inmediato (24/7).
              </div>

              <div className="text-sm">
                <p className="font-semibold text-gray-800 mb-1">Herramientas de Calma</p>
                Accede a ejercicios como la "Respiración Guiada" para momentos de estrés.
              </div>

              <div className="text-sm">
                <p className="font-semibold text-gray-800 mb-1">Contactos de Confianza</p>
                Agrega personas cercanas a las que puedes llamar con un solo toque en caso de necesidad.
              </div>

              <div className="text-sm">
                <p className="font-semibold text-gray-800 mb-1">Recursos Profesionales</p>
                Explora un directorio completo de ayuda para encontrar la mejor opción para ti.
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-6 w-full rounded-lg bg-purple-600 px-4 py-2 text-center font-semibold text-white hover:bg-purple-700"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
      {/* --- CAMBIO 4: FIN --- */}


      {/* Modal de Agregar Contacto */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full">
            <h4 className="text-lg font-semibold mb-4">Agregar Nuevo Contacto</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre (ej. Ana (Hermana))"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm"
              />
              <input
                type="tel"
                placeholder="Teléfono (ej. 555-1234)"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowAddContactModal(false)}
                className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-center hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddContact}
                className="flex-1 rounded-xl bg-purple-600 px-3 py-2 text-center font-semibold text-white hover:bg-purple-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}