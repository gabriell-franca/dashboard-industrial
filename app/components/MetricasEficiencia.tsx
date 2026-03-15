import { StatusMaquina } from "../types"

interface PropsMetricas {
    oee: StatusMaquina["oee"]
    modoEscuro: boolean
}

// fazer o OEE, abaixo, uma barra de progresso colorida
function BarraProgresso({ valor, cor, modoEscuro }: { valor: number; cor: string; modoEscuro: boolean }) {
  return (
    <div className={`w-full rounded-full h-2 mt-1 ${modoEscuro ? "bg-gray-700" : "bg-slate-200"}`}>
      <div className={`h-2 rounded-full transition-all duration-500 ${cor}`} style={{ width: `${valor}%` }} />
    </div>
  )
}
function corBarra(valor: number): string {
    if (valor >= 90) return "bg-green-500"
    if (valor >= 75) return "bg-yellow-500"
    return "bg-red-500"
}
//painel de métricas OEE (Overall Equipment Effectiveness), exibe disponibilidade, performance e qualidade com barras de progresso coloridas (Verde >= 90%, Amarelo >= 75%, Vermelho abaixo de 75%)


export default function MetricasEficiencia({ oee, modoEscuro }: PropsMetricas) {
    return (
        <div className={`rounded-xl p-6 border ${modoEscuro ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200 shadow-sm"}`}>

            <h2 className={`text-xl font-bold mb-6 ${modoEscuro ? "text-white" : "text-slate-900"}`}>Métricas de Eficiência</h2>

            {/*OEE Geral em destaque */}
            <div className={`rounded-lg p-4 mb-6 text-center ${modoEscuro ? "bg-gray-900" : "bg-slate-100"}`}>
                <p className={`text-sm ${modoEscuro ? "text-gray-400" : "text-slate-500"}`}>OEE Geral</p>
                <p className={`text-5xl font-bold mt-1 ${corBarra(oee.geral) === "bg-green-500" ? "text-green-400" : corBarra(oee.geral) === "bg-yellow-500" ? "text-yellow-400" : "text-red-400"}`}>
                    {oee.geral}%
                </p>
            </div>

            {/*metricas individuais com barra */}
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm">
                        <span className={`${modoEscuro ? "text-gray-400" : "text-slate-500"}`}>Disponibilidade</span>
                        <span className={`font-medium ${modoEscuro ? "text-white" : "text-slate-900"}`}>{oee.disponibilidade}%</span>
                    </div>
                    <BarraProgresso valor={oee.disponibilidade} cor={corBarra(oee.disponibilidade)} modoEscuro={modoEscuro} />
                </div>

                <div>
                    <div className="flex justify-between text-sm">
                        <span className={`${modoEscuro ? "text-gray-400" : "text-slate-500"}`}>Performance</span>
                        <span className={`font-medium ${modoEscuro ? "text-white" : "text-slate-900"}`}>{oee.performance }%</span>
                    </div>
                    <BarraProgresso valor={oee.performance} cor={corBarra(oee.performance )} modoEscuro={modoEscuro} />
                </div>

                <div>
                    <div className="flex justify-between text-sm">
                        <span className={`${modoEscuro ? "text-gray-400" : "text-slate-500"}`}>Qualidade</span>
                        <span className={`font-medium ${modoEscuro ? "text-white" : "text-slate-900"}`}>{oee.qualidade}%</span>
                    </div>
                    <BarraProgresso valor={oee.qualidade} cor={corBarra(oee.qualidade)} modoEscuro={modoEscuro} />
                </div>
            </div>
        </div>
    )
}