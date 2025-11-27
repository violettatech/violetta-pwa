type Props = {
  open: boolean
  onReload: () => void
  onClose: () => void
  message?: string
}

export default function UpdateToast({
  open,
  onReload,
  onClose,
  message = 'Hay una nueva versión disponible',
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-6">
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">
            <p className="font-medium text-gray-900">{message}</p>
            <p className="text-gray-600">Actualiza para obtener las últimas mejoras.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Luego
            </button>
            <button
              onClick={onReload}
              className="rounded-lg bg-fuchsia-600 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
