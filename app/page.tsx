"use client"
//usestate/effect para pegar os dados, guardar e atualizar em tempo real
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
  const [alertas, setAlertas] = useState<Alerta[]>(() => {
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

  //salva alertas no LocalStorage sempre que a lista muda
  useEffect(() => {
    localStorage.setItem("alertas-dashboard", JSON.stringify(alertas))
  }, [alertas])


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


  useEffect(() => {
    const intervalo = setInterval(() => {

      if (Math.random() < 0.05) {
        setConectado(false)
        return
      }
      setConectado(true)
      const novoStatus = gerarStatusMaquina()
      setMaquina(novoStatus)

      // mantém no máximo 20 linhas no histórico
      setHistorico(anterior => {
        const novoPonto: HistoricoMetrica = {
          timestamp: novoStatus.timestamp,
          temperatura: novoStatus.metricas.temperatura,
          rpm: novoStatus.metricas.rpm,
          eficiencia: novoStatus.metricas.eficiencia,
        }
        return [...anterior, novoPonto].slice(-20)
      })

      //gerando alerta se necessário
      const alerta = gerarAlerta(
        novoStatus.metricas.temperatura,
        novoStatus.metricas.rpm
      )
      if (alerta) {
        // toca som apenas para alertas críticos
        if (alerta.nivel === "CRITICO") {
          tocarAlertaSonoro()
        }
        setAlertas(anterior => [alerta, ...anterior].slice(0, 10))
      }
    }, 3000)

    return () => clearInterval(intervalo)
  }, [])

  // convertendo o formato de minutos para "5h 55m"
  const formatarTempo = (minutos: number) => {
    const h = Math.floor(minutos / 60)
    const m = minutos % 60
    return `${h}h ${m}m`
  }

  //puxando um alerta sonoro da Web Audio API, ele vai notificar quando tiver 'critico"
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


  if (!maquina) return (
    <main className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
      <p className="text-gray-400">Carregando...</p>
    </main>
  )

  const tendenciaTemp = maquina.metricas.temperatura > 80 ? "subindo" : "estavel"
  const tendenciaRpm = maquina.metricas.rpm < 1100 ? "descendo" : "estavel"
  const bg = modoEscuro ? "bg-gray-900" : "bg-blue-50"
  const texto = modoEscuro ? "text-white" : "text-slate-900"



  return (

    //construindo os cards com as metricas 
    <div className={`min-h-screen ${bg} ${texto} transition-colors duration-300`}>
      <Header
        conectado={conectado}
        modoEscuro={modoEscuro}
        alternarModo={() => setModoEscuro(!modoEscuro)}
      />
      <main className="px-8 pb-8">

        <div className="grid grid-cols-5 gap-4 mt-8">
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

        <div className="grid grid-cols-2 gap-6 mt-6">
          <PainelAlertas
            alertas={alertas}
            modoEscuro={modoEscuro}
            onLimpar={() => {
              setAlertas([])
              localStorage.removeItem("alertas-dashboard")
            }}
          />
          <MetricasEficiencia oee={maquina.oee} modoEscuro={modoEscuro} />
        </div>
      </main>

    </div>
  )
}