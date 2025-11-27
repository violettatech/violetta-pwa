import { useState, useEffect } from 'react';
import {
  Info,
  Phone,
  UserCircle,
  Plus,
  X,
  MessageCircle,
  Settings,
} from 'lucide-react';

// Tipo de contacto
type Contact = { name: string; phone: string };

const LS_CONTACTS = 'violetta-trusted-contacts';
const LS_HELP_TEMPLATE = 'violetta-help-message-template';
const VIOLETTA_PHONE = '+525552598121'; // ajusta al número real

// Hook simple para detectar si es "móvil"
function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const ua = navigator.userAgent || navigator.vendor || '';
      const small = window.innerWidth <= 768;
      const touch = 'ontouchstart' in window;
      const mobileMatch = /android|iphone|ipad|ipod|windows phone/i.test(ua);
      setIsMobile((mobileMatch || touch) && small);
    } catch {
      setIsMobile(null);
    }
  }, []);

  return isMobile;
}

function loadContacts(): Contact[] {
  const defaultContacts: Contact[] = [
    { name: 'Ana (Hermana)', phone: '555-1234' },
    { name: 'Laura (Mejor amiga)', phone: '555-5678' },
    { name: 'Mamá', phone: '555-9012' },
    { name: 'Dra. Ruiz (Terapeuta)', phone: '555-3456' },
  ];

  try {
    const raw = localStorage.getItem(LS_CONTACTS);
    if (!raw) {
      return defaultContacts;
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return defaultContacts;
    }

    // Si por alguna razón está vacío, usamos los de ejemplo
    if (parsed.length === 0) {
      return defaultContacts;
    }

    return parsed as Contact[];
  } catch {
    return defaultContacts;
  }
}


function saveContacts(items: Contact[]) {
  try {
    localStorage.setItem(LS_CONTACTS, JSON.stringify(items));
  } catch {
    // ignorar errores
  }
}

function loadTemplate(): string {
  try {
    const raw = localStorage.getItem(LS_HELP_TEMPLATE);
    if (raw) return raw;
  } catch {
    // ignore
  }
  return 'Hola {nombre}, necesito tu apoyo. Me siento vulnerable y me gustaría que estés pendiente de mí. {ubicacion}';
}

function saveTemplate(text: string) {
  try {
    localStorage.setItem(LS_HELP_TEMPLATE, text);
  } catch {
    // ignore
  }
}

// Intenta generar link de ubicación
function getLocationLink(): Promise<string | null> {
  return new Promise(resolve => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const link = `https://maps.google.com/?q=${latitude},${longitude}`;
        resolve(link);
      },
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 5000 }
    );
  });
}

// Normaliza el teléfono para wa.me
function normalizePhoneForWhatsApp(phone: string) {
  return phone.replace(/[^\d]/g, '');
}

export default function MyNetwork() {
  const isMobile = useIsMobile();

  // contactos
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // template de mensaje
  const [helpTemplate, setHelpTemplate] = useState<string>(loadTemplate());
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // cargar contactos
  useEffect(() => {
    setContacts(loadContacts());
  }, []);

  // guardar contactos
  useEffect(() => {
    saveContacts(contacts);
  }, [contacts]);

  const handleAddContact = () => {
    if (newContactName.trim() && newContactPhone.trim()) {
      setContacts(prev => [
        ...prev,
        { name: newContactName.trim(), phone: newContactPhone.trim() },
      ]);
      setNewContactName('');
      setNewContactPhone('');
      setShowAddContactModal(false);
    } else {
      alert('Por favor, completa ambos campos.');
    }
  };

  function handleCallVioletta() {
    const telUrl = `tel:${VIOLETTA_PHONE}`;
    window.location.href = telUrl;
  }

  async function handleMessageContact(contact: Contact) {
    const baseTemplate = helpTemplate || loadTemplate();
    const locationLink = await getLocationLink();

    let text = baseTemplate.replace('{nombre}', contact.name);

    if (locationLink) {
      text = text.replace(
        '{ubicacion}',
        `Mi ubicación aproximada: ${locationLink}`
      );
    } else {
      text = text.replace('{ubicacion}', '');
    }

    const encoded = encodeURIComponent(text);
    const waPhone = normalizePhoneForWhatsApp(contact.phone);
    const url = `https://wa.me/${waPhone}?text=${encoded}`;
    window.open(url, '_blank');
  }

  function handleSaveTemplate() {
    const t = helpTemplate.trim();
    if (!t) return;
    saveTemplate(t);
    setShowTemplateModal(false);
  }

  return (
    <div className="pb-24 space-y-6 p-4 bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mi Red</h2>
        <button
          onClick={() => setShowInfoModal(true)}
          className="text-gray-500 hover:text-gray-800"
        >
          <Info size={24} />
        </button>
      </div>

      {/* Sección Línea Violetta */}
      <section className="rounded-2xl bg-pink-100 border border-pink-200 p-4 shadow-sm">
        <h3 className="font-bold text-lg text-pink-800">
          ¿Necesitas apoyo ahora?
        </h3>

        {isMobile === false && (
          <p className="text-pink-700 my-2 text-sm">
            Llama a la Línea Violetta al{' '}
            <span className="font-semibold">{VIOLETTA_PHONE}</span>.
          </p>
        )}

        {(isMobile === true || isMobile === null) && (
          <p className="text-pink-700 my-2 text-sm">
            Presiona el botón para llamar a la Línea Violetta y contactar con
            personas profesionales de inmediato.
          </p>
        )}

        <button
          onClick={handleCallVioletta}
          className="block w-full rounded-full bg-pink-600 px-4 py-3 text-center font-semibold text-white shadow-md hover:bg-pink-700"
        >
          Llamar a Línea Violetta
        </button>
      </section>

      {/* Contactos de Confianza */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Mis Contactos de Confianza
          </h3>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-1 text-xs text-purple-700 hover:text-purple-900"
          >
            <Settings size={14} />
            Configurar mensaje
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-2">
          Agrega personas cercanas a las que puedas llamar o enviar un mensaje
          de ayuda por WhatsApp. El mensaje puede incluir tu ubicación si decides
          compartirla.
        </p>

        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <UserCircle size={36} className="text-purple-400" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {contact.name}
                  </p>
                  <p className="text-sm text-gray-500">{contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => (window.location.href = `tel:${contact.phone}`)}
                  className="p-2 text-purple-600 rounded-full hover:bg-purple-100"
                  title="Llamar"
                >
                  <Phone size={22} />
                </button>
                <button
                  onClick={() => handleMessageContact(contact)}
                  className="p-2 text-emerald-600 rounded-full hover:bg-emerald-100"
                  title="Enviar mensaje de ayuda"
                >
                  <MessageCircle size={22} />
                </button>
              </div>
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

      {/* Recursos Profesionales */}
      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Recursos Profesionales
        </h3>
        <p className="text-sm text-gray-700 pt-2 px-1">
          El botón te llevará a un directorio de recursos profesionales amplio
          para que puedas buscar la mejor opción más cercana y que se alinee
          con tus necesidades.
        </p>
        <a
          href="https://holasoyvioletta.com/ayuda-profesional/"
          target="_blank"
          rel="noreferrer"
          className="mt-3 block w-full rounded-xl bg-purple-600 px-4 py-3 text-center font-semibold text-white hover:bg-purple-700 shadow-sm"
        >
          Recursos Profesionales
        </a>
      </section>

      {/* Modal de Información */}
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

            <div className="text-gray-700 space-y-4 text-sm">
              <p>
                Este es tu espacio seguro para acceder rápido a ayuda cuando la
                necesites.
              </p>

              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Línea Violetta
                </p>
                <p>
                  Usa el botón rosa para llamar a la Línea Violetta y contactar
                  con personas profesionales. Si estás en una computadora,
                  también verás el número para marcarlo desde tu teléfono.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Contactos de Confianza
                </p>
                <p>
                  Agrega personas cercanas a las que puedas llamar o enviar un
                  mensaje de ayuda con un solo toque. El mensaje puede incluir
                  tu ubicación aproximada si decides compartirla.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-800 mb-1">
                  Recursos Profesionales
                </p>
                <p>
                  Explora un directorio de opciones de apoyo profesional para
                  encontrar la que mejor se adapte a ti.
                </p>
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

      {/* Modal de Agregar Contacto */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full">
            <h4 className="text-lg font-semibold mb-4">
              Agregar Nuevo Contacto
            </h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre (ej. Ana (Hermana))"
                value={newContactName}
                onChange={e => setNewContactName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm"
              />
              <input
                type="tel"
                placeholder="Teléfono (ej. 555-1234)"
                value={newContactPhone}
                onChange={e => setNewContactPhone(e.target.value)}
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

      {/* Modal Configurar mensaje de ayuda */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-semibold">
                Configurar mensaje de ayuda
              </h4>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={22} />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-3">
              Este mensaje se enviará por WhatsApp a tus contactos de confianza.
              Puedes usar las palabras clave{' '}
              <span className="font-mono bg-gray-100 px-1 rounded">
                {'{nombre}'}
              </span>{' '}
              y{' '}
              <span className="font-mono bg-gray-100 px-1 rounded">
                {'{ubicacion}'}
              </span>{' '}
              para que Violetta inserte el nombre de la persona y un enlace a tu
              ubicación aproximada si decides compartirla.
            </p>

            <textarea
              rows={4}
              value={helpTemplate}
              onChange={e => setHelpTemplate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-purple-500 focus:border-purple-500 mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-center hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTemplate}
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
