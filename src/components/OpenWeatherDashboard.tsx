"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Thermometer, ThermometerSun, ThermometerSnowflake, Download, CloudRain } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as XLSX from 'xlsx'

const OPENWEATHER_API_KEY = 'd07e18384a480407bc488618a284bb65'

const cities = [
  { name: 'São Paulo', lat: -23.55, lon: -46.63 },
  { name: 'Rio de Janeiro', lat: -22.91, lon: -43.17 },
  { name: 'Salvador', lat: -12.97, lon: -38.51 }
]

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
}

const getDailyForecasts = (forecastList: any[]) => {
  // Get tomorrow's date at midnight local time
  const tomorrow = new Date()
  tomorrow.setHours(0, 0, 0, 0)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Filter and group forecasts by day
  const dailyForecasts = forecastList
    .filter(forecast => {
      const forecastDate = new Date(forecast.dt * 1000)
      forecastDate.setHours(0, 0, 0, 0)
      return forecastDate >= tomorrow
    })
    .reduce((acc: any, forecast: any) => {
      const date = new Date(forecast.dt * 1000).toDateString()
      
      if (!acc[date]) {
        acc[date] = {
          dt: forecast.dt,
          temp_max: forecast.main.temp_max,
          temp_min: forecast.main.temp_min,
          weather: forecast.weather
        }
      } else {
        if (forecast.main.temp_max > acc[date].temp_max) {
          acc[date].temp_max = forecast.main.temp_max
        }
        if (forecast.main.temp_min < acc[date].temp_min) {
          acc[date].temp_min = forecast.main.temp_min
        }
      }
      
      return acc
    }, {})

  // Sort by date and get next 3 days
  return Object.values(dailyForecasts)
    .sort((a: any, b: any) => a.dt - b.dt)
    .slice(0, 3)
}
export function OpenWeatherDashboard() {
  const [weatherData, setWeatherData] = useState<any>({})
  const [loading, setLoading] = useState(true)

  const fetchWeatherData = async () => {
    try {
      const data: { [key: string]: any } = {}

      for (const city of cities) {
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
        )
        const forecastResult = await forecastResponse.json()
        
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
        )
        const currentResult = await currentResponse.json()
        
        data[city.name] = {
          current: currentResult,
          forecast: getDailyForecasts(forecastResult.list)
        }
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
  }, [])

  const exportToExcel = () => {
    const exportData = cities.flatMap(city => {
      const cityData = weatherData[city.name]
      return cityData.forecast.slice(0, 3).map((forecast: any) => ({
        'Cidade': city.name,
        'Temperatura Atual': `${Math.round(cityData.current.main.temp)}°C`,
        'Data': formatDate(forecast.dt),
        'Temperatura Máxima': `${Math.round(forecast.temp_max)}°C`,
        'Temperatura Mínima': `${Math.round(forecast.temp_min)}°C`,
        'Condição': forecast.weather[0].description
      }))
    })

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Previsão do Tempo")
    XLSX.writeFile(wb, "previsao-tempo-openweather.xlsx")
  }

  return (
    <div className="p-2">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl font-bold">Previsão do Tempo</h2>
        <div className="flex gap-2">
          <Button
            onClick={fetchWeatherData}
            disabled={loading}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            Atualizar
          </Button>
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
      </div>
      <div className="grid gap-6 md:grid-cols-3 p-4">
        {cities.map((city) => (
          <Card key={city.name} className="hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl flex items-center justify-between">
                {city.name}
                {loading ? (
                  <Skeleton className="h-4 w-24" />
                ) : weatherData[city.name]?.current && (
                  <Badge variant="secondary" className="text-lg">
                    {Math.round(weatherData[city.name].current.main.temp)}°C
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !weatherData[city.name]?.forecast ? (
                <div className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CloudRain className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {weatherData[city.name].current.weather[0].description}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {weatherData[city.name].forecast.slice(0, 3).map((forecast: any) => (
                      <Card key={forecast.dt} className="p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {formatDate(forecast.dt)}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <ThermometerSun className="h-4 w-4 text-orange-500" />
                              <span>{Math.round(forecast.temp_max)}°</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThermometerSnowflake className="h-4 w-4 text-blue-500" />
                              <span>{Math.round(forecast.temp_min)}°</span>
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
