//criando a interface do card de informações, o componente é reutilizável conforme solciitado
//recebe título, valor, subtítulo e tendência (subindo/descendo/estavel), a seta vermelha indica subindo, azul indica descendo
//animate-pulse no badge e transição suave nos valores

"use client"
import { useEffect, useState } from "react"

interface PropsCardMetrica {
    titulo: string
    valor: string
    subtitulo: string
    tendencia: "subindo" | "descendo" | "estavel"
    modoEscuro: boolean
}

export default function CardMetrica({ titulo, valor, subtitulo, tendencia, modoEscuro }: PropsCardMetrica) {
    const [valorExibido, setValorExibido] = useState(valor)
    const [saindo, setSaindo] = useState(false)
    const [entrando, setEntrando] = useState(false)

    useEffect(() => {
        if (valor !== valorExibido) {
            setSaindo(true)

            setTimeout(() => {
                setValorExibido(valor)
                setSaindo(false)
                setEntrando(true)
                setTimeout(() => setEntrando(false), 300)
            }, 300)
        }
    }, [valor])

    return (
        <div
            role="region"
            aria-label={`${titulo}: ${valor}`}
            className={`rounded-xl p-6 border transition-colors duration-300 ${modoEscuro ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200 shadow-sm"
                }`}>
            <p className={`text-sm ${modoEscuro ? "text-gray-400" : "text-slate-500"}`}>{titulo}</p>

            {/*container com overflow hidden pra esconder o valor enquanto anima */}
            <div className="overflow-hidden h-10 mt-1">
                <p className={`text-3xl font-bold transition-all duration-300 ${modoEscuro ? "text-white" : "text-slate-900"
                    } ${saindo ? "-translate-y-4 opacity-0" : ""} ${entrando ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"}`}>
                    {valorExibido}
                    {tendencia === "subindo" && <span className="text-red-400 text-lg ml-2">▲</span>}
                    {tendencia === "descendo" && <span className="text-blue-400 text-lg ml-2">▼</span>}
                </p>
            </div>

            <p className={`text-sm mt-2 ${modoEscuro ? "text-gray-500" : "text-slate-400"}`}>{subtitulo}</p>
        </div>
    )
}