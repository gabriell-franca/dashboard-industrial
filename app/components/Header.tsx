"use client"
//cabeçalho fixo do dashboard com título, status de conexão e botão de tema

import Image from "next/image"

interface PropsHeader {
    conectado: boolean
    modoEscuro: boolean
    alternarModo: () => void
}

export default function Header({ conectado, modoEscuro, alternarModo }: PropsHeader) {
    return (
        <header className={`flex items-center justify-between px-8 py-4 border-b mb-8 ${modoEscuro ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200 shadow-sm"}`}>

            {/*logo */}
            <div className="w-24">
                <Image
                    src="/stwlogo.png"
                    alt="Logo STW"
                    width={80}
                    height={40}
                    style={{ objectFit: "contain" }}
                />
            </div>

            {/*título centralizado */}
            <div className="text-center">
                <h1 className={`text-lg font-bold ${modoEscuro ? "text-white" : "text-slate-900"}`}>
                    Dashboard Industrial STW
                </h1>
                <p className={`text-xs ${modoEscuro ? "text-gray-400" : "text-slate-500"}`}>
                    Monitoramento em tempo real — Misturador M-01
                </p>
            </div>

            {/*status + botões */}
            <div className="flex items-center gap-4">

                {/*status de conexão */}
                <div
                    role="status"
                    aria-live="polite"
                    aria-label={conectado ? "Sistema conectado" : "Sistema sem conexão"}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${conectado ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                        }`}>
                    <div className={`w-2 h-2 rounded-full ${conectado ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                    {conectado ? "Conectado" : "Sem conexão"}
                </div>

                {/*modo dark/light */}
                <button
                    onClick={alternarModo}
                    aria-label={modoEscuro ? "Ativar modo claro" : "Ativar modo escuro"}
                    className="bg-gray-700 hover:bg-gray-600 transition-colors px-3 py-1.5 rounded-lg text-sm text-white"
                >
                    {modoEscuro ? "Modo Claro" : "Modo Escuro"}
                </button>

            </div>
        </header>
    )
}