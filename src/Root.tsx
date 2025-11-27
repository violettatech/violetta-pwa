import { useEffect, useState } from 'react'
import App from './App'
import UpdateToast from './components/UpdateToast'
import { registerSW } from 'virtual:pwa-register'

export default function Root() {
  const [needRefresh, setNeedRefresh] = useState(false)

  useEffect(() => {
    registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedRefresh(true)
      },
      // Ya no mostramos ningún mensaje especial al estar listo offline
      onOfflineReady() {
        // noop
      },
    })
  }, [])

  const handleReload = () => window.location.reload()

  return (
    <>
      <App />
      <UpdateToast
        open={needRefresh}
        onReload={handleReload}
        onClose={() => setNeedRefresh(false)}
        message="Hay una nueva versión de Violetta lista para instalarse"
      />
      {/* Eliminado: mensaje 'Listo para funcionar sin conexión ✨' */}
    </>
  )
}
