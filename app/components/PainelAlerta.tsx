import { Alerta } from "../types"

interface PropsAlertas {
    alertas: Alerta[]
    modoEscuro: boolean
}

//formata o tempo decorrido desde o alerta 
//cada alerta mostra o tempo decorrido desde que foi gerado
function tempoDecorrido(timestamp: Date): string {
    const segundos = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
    if (segundos < 60) return `${segundos}s atrás`
    const minutos = Math.floor(segundos / 60)
    if (minutos < 60) return `${minutos}min atrás`
    return `${Math.floor(minutos / 60)}h atrás`
}

//painel de alertas em tempo real com 3 níveis: INFO, AVISO e CRÍTICO
const estiloNivel = {
    CRITICO: {
        borda: "border-red-500",
        badge: "bg-red-500 text-white",
    },
    AVISO: {
        borda: "border-yellow-500",
        badge: "bg-yellow-500 text-gray-900",
    },
    INFO: {
        borda: "border-blue-500",
        badge: "bg-blue-500 text-white",
    },
}

//a borda lateral muda de cor conforme a severidade
export default function PainelAlertas({ alertas, modoEscuro }: PropsAlertas) {
    return (
        <div className={`rounded-xl p-6 border ${modoEscuro ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200 shadow-sm"}`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${modoEscuro ? "text-white" : "text-slate-900"}`}>Alertas Recentes</h2>
                <span className={`text-xs px-2 py-1 rounded-full ${modoEscuro ? "bg-gray-700 text-gray-300" : "bg-slate-200 text-slate-600"}`}>
                    {alertas.length} alertas
                </span>
            </div>

            {alertas.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-400">Nenhum alerta no momento</p>
                </div>
            )}

            <div className="space-y-3 max-h-64 overflow-y-auto">
                {alertas.map(alerta => {
                    const estilo = estiloNivel[alerta.nivel]
                    return (
                        <div
                            key={alerta.id}
                            className={`border-l-4 ${estilo.borda} rounded-r-lg p-3 ${modoEscuro ? "bg-gray-900" : "bg-slate-50"}`}>
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${estilo.badge}`}>
                                    {alerta.nivel}
                                </span>
                                <span className="text-gray-500 text-xs">
                                    {tempoDecorrido(alerta.timestamp)}
                                </span>
                            </div>
                            <p className={`text-sm ${modoEscuro ? "text-white" : "text-slate-900"}`}>{alerta.mensagem}</p>
                            <p className={`text-xs mt-1 ${modoEscuro ? "text-gray-500" : "text-slate-400"}`}>{alerta.componente}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}