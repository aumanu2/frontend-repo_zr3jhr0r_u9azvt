import { useState } from 'react'

function App() {
  const [inputs, setInputs] = useState({
    sepal_length: 5.1,
    sepal_width: 3.5,
    petal_length: 1.4,
    petal_width: 0.2,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleChange = (e) => {
    const { name, value } = e.target
    setInputs((prev) => ({ ...prev, [name]: value === '' ? '' : Number(value) }))
  }

  const predict = async (e) => {
    e?.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${baseUrl}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sepal_length: Number(inputs.sepal_length),
          sepal_width: Number(inputs.sepal_width),
          petal_length: Number(inputs.petal_length),
          petal_width: Number(inputs.petal_width),
        }),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Iris Flower Classifier</h1>
          <p className="text-gray-600 mt-2">Enter measurements to predict the species using a machine learning model.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={predict} className="bg-white/80 backdrop-blur p-6 rounded-xl shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-700">Sepal Length (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  name="sepal_length"
                  value={inputs.sepal_length}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Sepal Width (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  name="sepal_width"
                  value={inputs.sepal_width}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Petal Length (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  name="petal_length"
                  value={inputs.petal_length}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Petal Width (cm)</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  name="petal_width"
                  value={inputs.petal_width}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition"
            >
              {loading ? 'Predicting…' : 'Predict Species'}
            </button>
            <p className="text-xs text-gray-500 mt-2">Backend: {baseUrl}</p>
          </form>

          <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow">
            {!result && !error && (
              <div className="text-gray-600">
                Submit the form to see the predicted species and probabilities.
              </div>
            )}
            {error && (
              <div className="text-red-600">{error}</div>
            )}
            {result && (
              <div>
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">Prediction</h2>
                  <p className="text-gray-700 mt-1">Most likely species: <span className="font-bold capitalize">{result.species}</span></p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Probabilities</h3>
                  <div className="space-y-2">
                    {Object.entries(result.probabilities).map(([label, value]) => (
                      <div key={label} className="">
                        <div className="flex justify-between text-sm text-gray-700">
                          <span className="capitalize">{label}</span>
                          <span>{(value * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded">
                          <div
                            className="h-2 bg-indigo-500 rounded"
                            style={{ width: `${Math.max(3, value * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
