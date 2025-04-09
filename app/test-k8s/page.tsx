'use client'

import { useState } from 'react'

export default function TestK8s() {
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [connectionResult, setConnectionResult] = useState('')

  const testConnection = async () => {
    setLoading(true)
    setStatusMessage('Testing connection...')
    setConnectionResult('')

    try {
      const response = await fetch('/api/test-k8s-connection')
      const result = await response.json()
      
      if (result.success) {
        setStatusMessage('✓ Successfully connected to Kubernetes cluster')
      } else {
        setStatusMessage('✗ Failed to connect to Kubernetes cluster')
      }
      
      setConnectionResult(JSON.stringify(result, null, 2))
    } catch (error: any) {
      setStatusMessage('✗ Error testing connection')
      setConnectionResult(JSON.stringify({ error: error.message }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h1 className="text-3xl font-bold mb-8">Test Kubernetes Connection</h1>
      
      <div className="bg-white rounded-lg shadow-lg mb-8">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Connection Test</h2>
        </div>
        <div className="p-6">
          <button
            onClick={testConnection}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            Test Connection
          </button>
          
          <div className="mt-4">
            <div className="flex items-center mb-2">
              {loading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              )}
              <div className={statusMessage.includes('✓') ? 'text-green-600' : statusMessage.includes('✗') ? 'text-red-600' : ''}>
                {statusMessage}
              </div>
            </div>
            {connectionResult && (
              <pre className="bg-gray-50 p-4 rounded-lg mt-4 max-h-[400px] overflow-y-auto">
                {connectionResult}
              </pre>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Instructions</h2>
        </div>
        <div className="p-6">
          <p className="mb-4">This page tests the connection to your Kubernetes cluster using the KUBECONFIG_BASE64 environment variable.</p>
          <p className="mb-4">Make sure you have set the KUBECONFIG_BASE64 environment variable in your .env file before testing.</p>
          <p className="mb-4">To set the KUBECONFIG_BASE64 environment variable:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Generate the base64 encoded kubeconfig: <code className="bg-gray-100 text-[#D63384] px-2 py-1 rounded">cat ~/kube/config | base64 -w 0 &gt; kubeconfig_base64.txt</code></li>
            <li>Add the content to your .env file: <code className="bg-gray-100 text-[#D63384] px-2 py-1 rounded">KUBECONFIG_BASE64=&lt;content of kubeconfig_base64.txt&gt;</code></li>
            <li>Restart the server</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 