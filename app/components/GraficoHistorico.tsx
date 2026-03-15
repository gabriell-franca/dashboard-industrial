"use client"
//instalei uma biblioteca de graficos para melhor visualização

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
    ReferenceLine
} from "recharts"

import { HistoricoMetrica } from "../types"
interface PropsGrafico {
    dados: HistoricoMetrica[]
    modoEscuro: boolean
}

function TooltipPersonalizado({ active, payload }: any) {
    if (active && payload && payload.length) {
        const horario = payload[0]?.payload?.horario
        const data = payload[0]?.payload?.data
        return (
            <div className="bg-gray-900 border border-gray-600 rounded-lg p-3 text-sm">
                {/* data e hora da leitura */}
                <p className="text-gray-400 text-xs mb-2 border-b border-gray-700 pb-2">
                    📅 {data} às {horario}
                </p>
                {payload.map((item: any) => (
                    <p key={item.name} style={{ color: item.color }} className="mb-1">
                        {item.name}: <strong>
                            {item.value}{item.name.includes("RPM") ? " rpm" : item.name.includes("Temp") ? "°C" : "%"}
                        </strong>
                    </p>
                ))}
            </div>
        )
    }
    return null
}


// passando a interface pro grafico pra ele entender a montagem
export default function GraficoHistorico({ dados, modoEscuro }: PropsGrafico) {
    const dadosFormatados = dados.map((ponto, indice) => ({
        leitura: `${indice + 1}`,
        temperatura: ponto.temperatura,
        rpm: ponto.rpm,
        eficiencia: ponto.eficiencia,
        // formata a data/hora da leitura
        horario: new Date(ponto.timestamp).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }),
        data: new Date(ponto.timestamp).toLocaleDateString("pt-BR"),
    }))


    return (
        <div className={`rounded-xl p-6 border mt-6 ${modoEscuro ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200 shadow-sm"}`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold mb-6 ${modoEscuro ? "text-white" : "text-slate-900"}`}>Histórico de Métricas</h2>
                <span className="text-gray-400 text-sm">Últimas {dados.length} leituras</span>
            </div>

            {/* legenda */}
            <div className="flex gap-6 mb-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-red-400 rounded" />
                    <span className="text-gray-400">Temperatura (°C) — Eixo esquerdo</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-blue-400 rounded" />
                    <span className="text-gray-400">RPM — Eixo direito</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-green-400 rounded" />
                    <span className="text-gray-400">Eficiência (%) — Eixo esquerdo</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={dadosFormatados} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

                    <XAxis
                        dataKey="leitura"
                        stroke="#556275"
                        label={{ value: "Leituras", position: "insideBottom", offset: -2, fill: "#556275", fontSize: 12 }}
                    />

                    {/* eixo esquerdo, temperatura/eficiencia*/}
                    <YAxis
                        yAxisId="esquerda"
                        stroke="#556275"
                        domain={[0, 100]}
                        label={{ value: "°C / %", angle: -90, position: "insideLeft", fill: "#556275", fontSize: 12 }}
                    />

                    {/* eixo direito rpm*/}
                    <YAxis yAxisId="direita"
                        orientation="right"
                        stroke="#556275"
                        domain={[0, 1600]}
                        label={{ value: "RPM", angle: 90, position: "insideRight", fill: "#556275", fontSize: 12 }}
                    />

                    <Tooltip content={<TooltipPersonalizado />} />

                    {/* linha de limite máximo de temperatura */}
                    <ReferenceLine yAxisId="esquerda" y={85} stroke="#EF4444" strokeDasharray="4 4" label={{ value: "Limite Temp.", fill: "#EF4444", fontSize: 11 }} />

                    <Line yAxisId="esquerda" type="monotone" dataKey="temperatura" name="Temperatura" stroke="#EF4444" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                    <Line yAxisId="direita" type="monotone" dataKey="rpm" name="RPM" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                    <Line yAxisId="esquerda" type="monotone" dataKey="eficiencia" name="Eficiência" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}