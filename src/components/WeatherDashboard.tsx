"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Thermometer, ThermometerSun, ThermometerSnowflake, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as XLSX from 'xlsx'

const cities = [
  { name: 'São Paulo', lat: -23.55, lon: -46.63 },
  { name: 'Rio de Janeiro', lat: -22.91, lon: -43.17 },
  { name: 'Salvador', lat: -12.97, lon: -38.51 }
]

const formatDate = (date: string) => {
  if (typeof window === 'undefined') return ''
  return new Date(date).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })
}

export function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<any>({})
  const [loading, setLoading] = useState(true)

  const fetchWeatherData = async () => {
    try {
      const data: { [key: string]: any } = {}

      for (const city of cities) {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=temperature_2m_max,temperature_2m_min&current=temperature_2m&timezone=America/Sao_Paulo&forecast_days=4`
        )
        const result = await response.json()
        data[city.name] = result
      }

      setWeatherData(data)
    } catch (error) {
      console.error('Error fetching weather data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeatherData()

    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const exportToExcel = () => {
    const exportData = cities.flatMap(city => {
      const cityData = weatherData[city.name]
      return cityData.daily.time.slice(1, 4).map((date: string, index: number) => ({
        'Cidade': city.name,
        'Temperatura Atual': `${Math.round(cityData.current.temperature_2m)}°C`,
        'Data': formatDate(date),
        'Temperatura Máxima': `${Math.round(cityData.daily.temperature_2m_max[index + 1])}°C`,
        'Temperatura Mínima': `${Math.round(cityData.daily.temperature_2m_min[index + 1])}°C`
      }))
    })

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Previsão do Tempo")
    XLSX.writeFile(wb, "previsao-tempo.xlsx")
  }


  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={exportToExcel}
          disabled={loading || !Object.keys(weatherData).length}
          
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar XLSX
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {cities.map((city) => (
          <Card key={city.name} className="hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl flex items-center justify-between">
                {city.name}
                {loading ? (
                  <Skeleton className="h-4 w-24" />
                ) : weatherData[city.name]?.current && (
                  <Badge variant="secondary" className="text-lg">
                    {Math.round(weatherData[city.name].current.temperature_2m)}°C
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !weatherData[city.name]?.daily ? (
                <div className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Previsão para os próximos dias</span>
                  </div>

                  <div className="space-y-3">
                    {weatherData[city.name].daily.time.slice(1, 4).map((date: string, index: number) => (
                      <Card key={date} className="p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {formatDate(date)}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <ThermometerSun className="h-4 w-4 text-orange-500" />
                              <span>{Math.round(weatherData[city.name].daily.temperature_2m_max[index + 1])}°</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThermometerSnowflake className="h-4 w-4 text-blue-500" />
                              <span>{Math.round(weatherData[city.name].daily.temperature_2m_min[index + 1])}°</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}