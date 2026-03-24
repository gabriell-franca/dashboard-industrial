"use client"
// importamei os hooks essenciais do React: useState (quando preciso gerenciar estado) e useEffect (quando preciso lidar com o ciclo de vida do componente)
import { useState, useEffect } from "react"
import { StatusMaquina, Alerta, HistoricoMetrica } from "./types"
import CardMetrica from "./components/MetricCard"
import GraficoHistorico from "./components/GraficoHistorico"
import MetricasEficiencia from "./components/MetricasEficiencia"
import PainelAlertas from "./components/PainelAlerta"
import { gerarStatusMaquina, gerarAlerta } from "./lib/simulator"
import Header from "./components/Header"
import CardEstadoMaquina from "./components/CardEstadoMaquina"

export default function Pagina() {
  const [maquina, setMaquina] = useState<StatusMaquina | null>(null)
  
  // inicializei a lista de alertas buscando dados prévios no navegador para manter o histórico (Persistência de estado)
  const [alertas, setAlertas] = useState<Alerta[]>(() => {
    // verificação necessária pois o Next.js também renderiza no servidor (SSR), quando o 'window' não existe, ou seja, pra não bugar ao tentar achar o "window" para acessar o localstorage
    if (typeof window === "undefined") return []
    try {
      const salvo = localStorage.getItem("alertas-dashboard")
      return salvo ? JSON.parse(salvo) : []
    } catch {
      return []
    }
  })

  const [historico, setHistorico] = useState<HistoricoMetrica[]>([])
  const [conectado, setConectado] = useState(true)
  const [modoEscuro, setModoEscuro] = useState(true)
  const [minutosOperacao, setMinutosOperacao] = useState(323)

  // efeito colateral: quando a variável 'alertas' sofrer mutação, o React executa este bloco e salva no navegador
  useEffect(() => {
    localStorage.setItem("alertas-dashboard", JSON.stringify(alertas))
  }, [alertas])

  // executado apenas uma vez, quando ocorre a montagem do componente para buscar o status inicial da máquina
  useEffect(() => {
    const status = gerarStatusMaquina()
    setMaquina(status)
    setHistorico([{
      timestamp: status.timestamp,
      temperatura: status.metricas.temperatura,
      rpm: status.metricas.rpm,
      eficiencia: status.metricas.eficiencia,
    }])
  }, [])

  // lógica central de Polling (atualização em tempo real)
  useEffect(() => {
    const intervalo = setInterval(() => {
      // simulação de perda de pacotes/conexão (quando há 5% de chance)
      if (Math.random() < 0.05) {
        setConectado(false)
        return
      }
      setConectado(true)
      
      // busca os dados atualizados do simulador
      const novoStatus = gerarStatusMaquina()
      setMaquina(novoStatus)

      setHistorico(anterior => {
        const novoPonto: HistoricoMetrica = {
          timestamp: novoStatus.timestamp,
          temperatura: novoStatus.metricas.temperatura,
          rpm: novoStatus.metricas.rpm,
          eficiencia: novoStatus.metricas.eficiencia,
        }
        // controle de memória: quando usado o slice(-20) garante que o array não cresça infinitamente, mantendo apenas as últimas 20 leituras
        return [...anterior, novoPonto].slice(-20)
      })

      // verificação de regras de negócio para geração de alertas
      const alerta = gerarAlerta(
        novoStatus.metricas.temperatura,
        novoStatus.metricas.rpm
      )
      
      if (alerta) {
        // feedback sonoro restrito apenas quando ocorrem eventos de nivel alto
        if (alerta.nivel === "CRITICO") {
          tocarAlertaSonoro()
        }
        // adiciona o novo alerta no topo da lista e descarta os mais antigos, quando atinge o limite de 10
        setAlertas(anterior => [alerta, ...anterior].slice(0, 10))
      }
    }, 3000) 

    // função de cleanup: destrói o intervalo quando o componente for desmontado, evitando memory leaks
    return () => clearInterval(intervalo)
  }, [])

  // função utilitária para formatação de tempo
  const formatarTempo = (minutos: number) => {
    const h = Math.floor(minutos / 60)
    const m = minutos % 60
    return `${h}h ${m}m`
  }

  // utilização da Web Audio API nativa para feedback sonoro, evitando a instalação de dependências externas
  const tocarAlertaSonoro = () => {
    const contexto = new AudioContext()
    const oscilador = contexto.createOscillator()
    const ganho = contexto.createGain()

    oscilador.connect(ganho)
    ganho.connect(contexto.destination)

    oscilador.frequency.value = 880
    oscilador.type = "square"

    ganho.gain.setValueAtTime(0.3, contexto.currentTime)
    ganho.gain.exponentialRampToValueAtTime(0.001, contexto.currentTime + 0.5)

    oscilador.start(contexto.currentTime)
    oscilador.stop(contexto.currentTime + 0.5)
  }

  // fallback de carregamento quando a máquina não inicializou
  if (!maquina) return (
    <main className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
      <p className="text-gray-400">Carregando...</p>
    </main>
  )

  // usando operador ternario, verdadeiro/falso pra definir o "estilo", tanto quando altera a tendencia quanto info do cabeçalho
  const tendenciaTemp = maquina.metricas.temperatura > 80 ? "subindo" : "estavel"
  const tendenciaRpm = maquina.metricas.rpm < 1100 ? "descendo" : "estavel"
  const bg = modoEscuro ? "bg-gray-900" : "bg-blue-50"
  const texto = modoEscuro ? "text-white" : "text-slate-900"

  return (
    // renderização dos componentes da interface
    <div className={`min-h-screen ${bg} ${texto} transition-colors duration-300`}>
      <Header
        conectado={conectado}
        modoEscuro={modoEscuro}
        alternarModo={() => setModoEscuro(!modoEscuro)}
      />
      <main className="px-8 pb-8">

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
          <CardEstadoMaquina
            estado={maquina.estado}
            modoEscuro={modoEscuro}
          />
          <CardMetrica
            titulo="Temperatura"
            valor={`${maquina.metricas.temperatura}°C`}
            subtitulo="Máx: 85°C" tendencia={tendenciaTemp}
            modoEscuro={modoEscuro} />

          <CardMetrica titulo="RPM"
            valor={String(maquina.metricas.rpm)}
            subtitulo="Máx: 1500"
            tendencia={tendenciaRpm}
            modoEscuro={modoEscuro} />

          <CardMetrica titulo="Eficiência"
            valor={`${maquina.metricas.eficiencia}%`}
            subtitulo="Meta: 90%"
            tendencia="estavel"
            modoEscuro={modoEscuro} />

          <CardMetrica
            titulo="Tempo de Operação"
            valor={formatarTempo(minutosOperacao)}
            subtitulo="Turno: 8h"
            tendencia="estavel"
            modoEscuro={modoEscuro} />
        </div>
        <GraficoHistorico dados={historico} modoEscuro={modoEscuro} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <PainelAlertas
            alertas={alertas}
            modoEscuro={modoEscuro}
            onLimpar={() => {
              setAlertas([])
              // remove explicitamente os dados salvos do navegador quando clica no limpar
              localStorage.removeItem("alertas-dashboard")
            }}
          />
          <MetricasEficiencia oee={maquina.oee} modoEscuro={modoEscuro} />
        </div>
      </main>

    </div>
  )
}