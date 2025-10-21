import { useEffect, useState } from 'react'
import App from './App'
import UpdateToast from './components/UpdateToast'
import { registerSW } from 'virtual:pwa-register'

export default function Root() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)

  useEffect(() => {
    registerSW({
      immediate: true,
      onNeedRefresh() {
        setNeedRefresh(true)
      },
      onOfflineReady() {
        setOfflineReady(true)
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
      {offlineReady && (
        <div className="fixed right-4 bottom-24 z-40 rounded-xl border bg-white px-3 py-2 text-sm text-gray-700 shadow">
          Listo para funcionar sin conexión ✨
        </div>
      )}
    </>
  )
}
