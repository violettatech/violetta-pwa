import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { MICROCOPY } from '../../lib/microcopy'

export default function Welcome() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen gradient-animate flex flex-col items-center justify-center p-6 fade-in">
      <div className="text-center space-y-6 max-w-md">
        <div className="pulse-heart float-up">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl">
            <Heart className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-light text-purple-900 float-up stagger-1">Hola, soy Violetta</h1>
        <p className="text-lg text-purple-700 leading-relaxed float-up stagger-2">{MICROCOPY.welcomeMessage}</p>
        <p className="text-sm text-purple-600 italic float-up stagger-3">{MICROCOPY.welcomeSubtitle}</p>
        <div className="space-y-4 pt-8">
          <button
            onClick={() => nav('/auth/register')}
            className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-4 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 float-up stagger-4"
          >
            Crear mi espacio 💜
          </button>
          <button
            onClick={() => nav('/auth/login')}
            className="w-full border-2 border-purple-400 text-purple-600 py-4 rounded-full font-medium hover:bg-purple-50 hover:scale-105 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 float-up stagger-5"
          >
            Entrar
          </button>
        </div>
        <p className="text-xs text-purple-400 pt-4 float-up stagger-5">Con amor, Violetta</p>
      </div>
    </div>
  )
}
