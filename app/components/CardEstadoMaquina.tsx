interface PropsEstado {
    estado: "RODANDO" | "PARADA" | "MANUTENCAO" | "ERRO"
    modoEscuro: boolean
}

//configurações dos estados, exibe o estado atual da máquina (Ligada, Desligada, Manutenção, Erro)

const configEstado = {
    RODANDO: {
        label: "Ligada",
        status: "OK",
        cor: "text-green-400",
        fundo: "bg-green-900",
        borda: "border-green-500",
        pulsar: true,
    },
    PARADA: {
        label: "Desligada",
        status: "PARADA",
        cor: "text-gray-400",
        fundo: "bg-gray-700",
        borda: "border-gray-500",
        pulsar: false,
    },
    MANUTENCAO: {
        label: "Manutenção",
        status: "ATENÇÃO",
        cor: "text-yellow-400",
        fundo: "bg-yellow-900",
        borda: "border-yellow-500",
        pulsar: false,
    },
    ERRO: {
        label: "Erro",
        status: "CRÍTICO",
        cor: "text-red-400",
        fundo: "bg-red-900",
        borda: "border-red-500",
        pulsar: true,
    },
}


//a borda e cor mudam conforme o estado, e o badge pulsa quando está rodando ou em erro
export default function CardEstadoMaquina({ estado, modoEscuro }: PropsEstado) {
    const config = configEstado[estado]

    return (
        <div className={`rounded-xl p-6 border ${config.borda} ${modoEscuro ? "bg-gray-800" : "bg-white shadow-sm"}`}>
            <p className={`text-sm ${modoEscuro ? "text-gray-400" : "text-slate-500"}`}>Estado da Máquina</p>
            <p className={`text-3xl font-bold mt-2 ${config.cor}`}>
                {config.label}
            </p>
            {/*badge de status */}
            <div className="mt-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${config.fundo} ${config.cor} ${config.pulsar ? "animate-pulse" : ""}`}>
                    Status: {config.status}
                </span> 
            </div>
        </div>
    )
}