'use client'

import { useState } from 'react'
import DeployForm from './components/DeployForm'
import DeploymentResult from './components/DeploymentResult'
import LoadingOverlay from './components/LoadingOverlay'

interface DeployFormData {
  githubUrl: string
  namespace: string
  forceImageTag: boolean
  envVars: Record<string, any>
  miniService?: {
    enabled: boolean
    depositServiceEnabled: boolean
    settlementServiceEnabled: boolean
  }
  releaseName?: string
  upgradeOnly?: boolean
}

export default function SimpleDeploy() {
  const [loading, setLoading] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<any>(null)
  const [showCleanup, setShowCleanup] = useState(false)
  const [cleanupNamespace, setCleanupNamespace] = useState('')
  const [cleanupReleaseName, setCleanupReleaseName] = useState('')

  const handleDeploy = async (formData: DeployFormData) => {
    setLoading(true)
    try {
      const response = await fetch('/api/helm/deploy-from-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      setDeploymentResult(result)

      if (!result.success) {
        if (result.code === 'INGRESS_CONFLICT') {
          alert('Deployment failed due to Ingress conflict.')
        } else if (result.code === 'EXISTING_DEPLOYMENT') {
          if (confirm('An existing deployment was detected. Do you want to upgrade it?')) {
            const upgradeData = {
              ...formData,
              upgradeOnly: true,
              releaseName: result.details?.currentRelease
            }
            
            setLoading(true)
            const upgradeResponse = await fetch('/api/helm/deploy-from-github', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(upgradeData)
            })
            
            const upgradeResult = await upgradeResponse.json()
            setDeploymentResult(upgradeResult)
            
            if (upgradeResult.success) {
              alert('Upgrade successful!')
            } else {
              alert(`Upgrade failed: ${upgradeResult.error || upgradeResult.message}`)
            }
          } else {
            alert('Upgrade cancelled by user.')
          }
        } else if (result.details?.includes('another operation in progress')) {
          const releaseNameMatch = result.details.match(/release\s+([^\s]+)/i)
          const releaseName = releaseNameMatch ? releaseNameMatch[1] : ''
          setShowCleanup(true)
          setCleanupNamespace(formData.namespace)
          setCleanupReleaseName(releaseName || formData.releaseName || '')
        }
      } else {
        const actionType = result.details?.deploymentType === 'upgrade' ? 'Upgrade' : 'Deployment'
        alert(`${actionType} successful!`)
      }
    } catch (error: any) {
      console.error('Error deploying application:', error)
      alert(`Error deploying application: ${error.message}`)
      setDeploymentResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleCleanup = async () => {
    if (!cleanupNamespace || !cleanupReleaseName) {
      alert('Please enter both namespace and release name')
      return
    }

    try {
      const response = await fetch('/api/helm/cleanup-helm-operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ namespace: cleanupNamespace, releaseName: cleanupReleaseName })
      })
      
      const result = await response.json()
      if (result.success) {
        alert(result.message)
      } else {
        alert(`${result.error}\n${result.message || ''}`)
      }
    } catch (error: any) {
      console.error('Error cleaning up operations:', error)
      alert(`Error: ${error.message}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h1 className="text-3xl font-bold mb-8">Deploy from GitHub</h1>
      
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Using Branch Information</h2>
          <p className="mb-2">You can now specify a branch in your GitHub URL by using the format: <code className="bg-gray-100 px-2 py-1 rounded">https://github.com/username/repository/tree/branch</code></p>
          <p className="mb-2">When a branch is specified:</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>The system will try to find a container image with a tag matching the branch name</li>
            <li>If no exact match is found, it will try variations like <code className="bg-gray-100 px-2 py-1 rounded">branch-name</code>, <code className="bg-gray-100 px-2 py-1 rounded">feature-xyz</code> (for <code className="bg-gray-100 px-2 py-1 rounded">feature/xyz</code>), or <code className="bg-gray-100 px-2 py-1 rounded">branch-feature-xyz</code></li>
            <li>If no branch-specific image is found, it will fall back to the <code className="bg-gray-100 px-2 py-1 rounded">latest</code> tag</li>
          </ul>
          <p>This feature is useful for deploying specific versions or feature branches of your application.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">MD5 Image Values</h2>
          <p className="mb-2">When using the advanced options, you may need to provide MD5 hash values for images:</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li><strong>Image Value (MD5)</strong>: The MD5 hash of the image to be deployed</li>
            <li><strong>Migrate Image Value (MD5)</strong>: The MD5 hash of the image to migrate from (required when Migrate Value is TRUE)</li>
          </ul>
          <p>To obtain an MD5 hash for an image:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Use the zkWasm CLI tool to get the image hash</li>
            <li>Or check the zkWasm dashboard for existing image hashes</li>
            <li>The MD5 hash should be a 32-character hexadecimal string</li>
          </ol>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Mini-Services (Deposit & Settlement)</h2>
          <p className="mb-2">The deployment can include additional services for token transactions between layers:</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li><strong>Deposit Service</strong>: Handles L1 to L2 token deposits (transfer from Ethereum to rollup)</li>
            <li><strong>Settlement Service</strong>: Processes L2 to L1 token settlements (transfer from rollup to Ethereum)</li>
          </ul>
          <p>These services can be enabled/disabled individually in the advanced options. When enabled, they:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Share the same MongoDB database with the main service</li>
            <li>Will be deployed as separate pods in the same namespace</li>
            <li>Require the main RPC service to function properly</li>
          </ul>
          <p className="mt-4">For most applications that need token transfers between L1 and L2, both services should be enabled.</p>
        </div>

        <DeployForm onSubmit={handleDeploy} />
        <DeploymentResult result={deploymentResult} />
        
        {showCleanup && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
            <p className="mb-4">If you&apos;re seeing errors about &quot;another operation in progress&quot;, you can try to clean up stuck operations:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Namespace</label>
                <input
                  type="text"
                  value={cleanupNamespace}
                  onChange={(e) => setCleanupNamespace(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Release Name</label>
                <input
                  type="text"
                  value={cleanupReleaseName}
                  onChange={(e) => setCleanupReleaseName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <button
              onClick={handleCleanup}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
            >
              Clean Up Stuck Operations
            </button>
          </div>
        )}
      </div>

      {loading && <LoadingOverlay />}
    </div>
  )
} 