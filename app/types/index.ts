//interfaces em TypeScript que definem a estrutura de dados do sistema
//statusMaquina: estado e métricas da máquina em tempo real
//alerta: notificações geradas quando métricas ultrapassam limites
//historicoMetrica: pontos de dados para o gráfico de histórico

export interface StatusMaquina {

    id: string
    timestamp: Date
    estado: "RODANDO" | "PARADA" | "MANUTENCAO" | "ERRO"
    metricas: {
        temperatura: number
        rpm: number
        tempoOperacao: number
        eficiencia: number
    }
    oee: {
        geral: number
        disponibilidade: number
        performance: number
        qualidade: number
    }
}

export interface Alerta {
    id: string
    nivel: "INFO" | "AVISO" | "CRITICO"
    mensagem: string
    componente: string
    timestamp: Date
    reconhecido: boolean
}

export interface HistoricoMetrica {
    timestamp: Date
    temperatura: number
    rpm: number
    eficiencia: number
}