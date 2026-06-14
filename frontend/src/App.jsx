import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [measurement, setMeasurement] = useState({})
  const [limits, setLimits] = useState({})
  const [formLimits, setFormLimits] = useState({})

  useEffect(() => {
    const timer = setInterval(() => {
      fetch('http://localhost:8080/api/measurements')
        .then(res => res.json())
        .then(data => setMeasurement(data))
        .catch(err => console.error(err))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetch('http://localhost:8080/api/limits')
      .then(res => res.json())
      .then(data => {
        setLimits(data)
        setFormLimits(data)
      })
      .catch(err => console.error(err))
  }, [])

  const handleInput = (e) => {
    setFormLimits({
      ...formLimits,
      [e.target.name]: Number(e.target.value)
    })
  }

  const saveLimits = (e) => {
    e.preventDefault()
    fetch('http://localhost:8080/api/limits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formLimits)
    })
      .then(() => setLimits(formLimits))
      .catch(err => console.error(err))
  }

  const getStyle = (val, max) => {
    if (val > max) {
      return { color: 'red', fontWeight: 'bold' }
    }
    return {}
  }

  const getAlarmText = (val, max, name) => {
    if (val > max) {
      return ` OVER${name.toUpperCase()}!`
    }
    return ''
  }

  return (
    <div className="container">
      <h1>Panel Pomiarowy</h1>

      <div className="measurements-box">
        <h2>Aktualne pomiary</h2>
        <p style={getStyle(measurement.voltage, limits.maxVoltage)}>
          Napięcie: {measurement.voltage} V 
          {getAlarmText(measurement.voltage, limits.maxVoltage, 'voltage')}
        </p>
        <p style={getStyle(measurement.current, limits.maxCurrent)}>
          Prąd: {measurement.current} A 
          {getAlarmText(measurement.current, limits.maxCurrent, 'current')}
        </p>
        <p style={getStyle(measurement.power, limits.maxPower)}>
          Moc: {measurement.power} W 
          {getAlarmText(measurement.power, limits.maxPower, 'power')}
        </p>
        <p style={getStyle(measurement.temperature, limits.maxTemperature)}>
          Temperatura: {measurement.temperature} °C 
          {getAlarmText(measurement.temperature, limits.maxTemperature, 'temperature')}
        </p>
      </div>

      <div className="form-box">
        <h2>Konfiguracja limitów</h2>
        <form onSubmit={saveLimits}>
          <div>
            <label>Max Napięcie (V): </label>
            <input type="number" step="0.1" name="maxVoltage" value={formLimits.maxVoltage || ''} onChange={handleInput} />
          </div>
          <div>
            <label>Max Prąd (A): </label>
            <input type="number" step="0.1" name="maxCurrent" value={formLimits.maxCurrent || ''} onChange={handleInput} />
          </div>
          <div>
            <label>Max Moc (W): </label>
            <input type="number" step="0.1" name="maxPower" value={formLimits.maxPower || ''} onChange={handleInput} />
          </div>
          <div>
            <label>Max Temperatura (°C): </label>
            <input type="number" step="0.1" name="maxTemperature" value={formLimits.maxTemperature || ''} onChange={handleInput} />
          </div>
          <button type="submit">Zapisz limity</button>
        </form>
      </div>
    </div>
  )
}

export default App