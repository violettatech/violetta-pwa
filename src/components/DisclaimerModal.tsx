import { useEffect, useRef } from 'react'

type Props = {
  open: boolean
  onAccept: () => void
  onClose: () => void
}

export default function DisclaimerModal({ open, onAccept, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Cerrar con ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (open && e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
      onMouseDown={(e) => {
        // cerrar al click fuera del cuadro
        if (e.target === dialogRef.current) onClose()
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h2 id="disclaimer-title" className="text-xl font-semibold">
          Acerca de este Prototipo
        </h2>
        <div className="mt-3 space-y-3 text-sm text-gray-700">
          <p>
            Gracias por utilizar Violetta V2 Prototipo 1
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Esta versión ha sido creada para probar la experiencia de usuario asi como los diferentes flujos de pantalla.</li>
            <li>No representa una interfaz final y no pretende entenderse como un producto completo.</li>
            <li>Tus comentarios serán de gran importancia en la creación de una nueva versión de Violetta.</li>
          </ul>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cerrar
          </button>
          <button
            onClick={onAccept}
            className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Acepto
          </button>
        </div>
      </div>
    </div>
  )
}
