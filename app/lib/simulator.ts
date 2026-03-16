import { StatusMaquina, Alerta, HistoricoMetrica } from "../types"

//simulador de dados da máquina — gera valores aleatórios entre x/y para simular um ambiente real
//usado no lugar de um banco de dados real para fins de demonstração

function aleatorio(min: number, max: number): number{
    return Math.round(Math.random() * (max - min) + min)
}


export function gerarStatusMaquina(): StatusMaquina{
    const temperatura = aleatorio(65, 95)
    const rpm = aleatorio(900, 1500)

    return {
        id: "maquina-01",
        timestamp: new Date(),
        estado: "RODANDO",
        metricas: {
            temperatura,
            rpm,
            tempoOperacao: 322,
            eficiencia: aleatorio(85,98)
        },
       oee: {
        geral: aleatorio(88, 96),
        disponibilidade: aleatorio(95,99),
        performance : aleatorio(90,98),
        qualidade: aleatorio(92, 99),

       }
    }
}

//gera um ponto de historico para o grafico
export function gerarPontoHistorico (): HistoricoMetrica {
    return {
        timestamp: new Date(),
        temperatura: aleatorio(65,95),
        rpm: aleatorio(900,1500),
        eficiencia: aleatorio(85,98),
    }
}

// gerar alertas baseados nos valores gerados
export function gerarAlerta(temperatura: number, rpm: number): Alerta | null {
    if (temperatura > 88)
        return {
            id: crypto.randomUUID(),
            nivel: "CRITICO",
            mensagem: `Temperatura critica: ${temperatura}°C`,
            componente: "Sistema de Resfriamento",
            timestamp: new Date(),
            reconhecido: false,
        }
    
    if (rpm< 1000){
        return {
            id: crypto.randomUUID(),
            nivel: "AVISO",
            mensagem: `RPM abaixo do esperado: ${rpm}`,
            componente: "Motor Principal",
            timestamp: new Date(),
            reconhecido: false,
        }
    }
    return null
}