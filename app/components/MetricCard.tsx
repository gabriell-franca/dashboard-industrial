// criando a interface do card de informações e estilizando


interface PropsCardMetrica {
    titulo: string
    valor: string
    subtitulo: string
    tendencia: "subindo" | "descendo" | "estavel"
    modoEscuro: boolean
}

export default function CardMetrica({ titulo, valor, subtitulo, tendencia, modoEscuro }: PropsCardMetrica) {

    return (
        <div className={`rounded-xl p-6 border ${modoEscuro ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200 shadow-sm"}`}>
            <p className={`text-sm ${modoEscuro ? "text-gray-400" : "text-slate-500"}`}>{titulo}</p>
            <p className={`text-3xl font-bold mt-1 ${modoEscuro ? "text-white" : "text-slate-900"}`}>
                {valor}
                {tendencia === "subindo" && <span className="text-red-400 text-lg ml-2">▲</span>}
                {tendencia === "descendo" && <span className="text-blue-400 text-lg ml-2">▼</span>}
            </p>
            <p className={`text-sm mt-2 ${modoEscuro ? "text-gray-500" : "text-slate-400"}`}>{subtitulo}</p>
        </div>
    )
}