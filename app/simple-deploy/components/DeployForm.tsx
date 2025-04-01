'use client'

import { useState } from 'react'

interface FormData {
  githubUrl: string
  namespace: string
  forceImageTag: boolean
  envVars: {
    chainId?: string
    allowedOrigins?: string
    deployValue?: string
    remoteValue?: string
    migrateValue?: string
    migrateImageValue?: string
    imageValue?: string
    autoSubmitValue?: string
    settlementContractAddress?: string
    rpcProvider?: string
    custom?: Record<string, any>
  }
  miniService: {
    enabled: boolean
    depositServiceEnabled: boolean
    settlementServiceEnabled: boolean
  }
}

export default function DeployForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [miniServiceEnabled, setMiniServiceEnabled] = useState(true)
  const [migrateValue, setMigrateValue] = useState('FALSE')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: FormData = {
      githubUrl: formData.get('githubUrl') as string,
      namespace: formData.get('namespace') as string,
      forceImageTag: formData.get('forceImageTag') === 'on',
      envVars: {},
      miniService: {
        enabled: true,
        depositServiceEnabled: true,
        settlementServiceEnabled: true
      }
    }

    if (showAdvancedOptions) {
      data.envVars = {
        chainId: formData.get('chainId') as string,
        allowedOrigins: formData.get('allowedOrigins') as string,
        deployValue: formData.get('deployValue') as string,
        remoteValue: formData.get('remoteValue') as string,
        migrateValue: formData.get('migrateValue') as string,
        migrateImageValue: formData.get('migrateImageValue') as string,
        imageValue: formData.get('imageValue') as string,
        autoSubmitValue: formData.get('autoSubmitValue') as string,
        settlementContractAddress: formData.get('settlementContractAddress') as string,
        rpcProvider: formData.get('rpcProvider') as string
      }

      data.miniService = {
        enabled: formData.get('miniServiceEnabled') === 'on',
        depositServiceEnabled: formData.get('depositServiceEnabled') === 'on',
        settlementServiceEnabled: formData.get('settlementServiceEnabled') === 'on'
      }

      const customEnvVars = formData.get('customEnvVars') as string
      if (customEnvVars) {
        try {
          data.envVars.custom = JSON.parse(customEnvVars)
        } catch (error) {
          alert('Invalid JSON format for custom environment variables')
          return
        }
      }
    }

    onSubmit(data)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Deploy Application</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
            GitHub Repository URL
          </label>
          <input
            type="text"
            id="githubUrl"
            name="githubUrl"
            required
            placeholder="https://github.com/owner/repo"
            className="w-full px-3 py-2 border rounded-md"
          />
          <p className="mt-1 text-sm text-gray-500">
            Examples:<br />
            - https://github.com/username/repository<br />
            - https://github.com/username/repository/tree/branch
          </p>
        </div>

        <div>
          <label htmlFor="namespace" className="block text-sm font-medium text-gray-700 mb-1">
            Kubernetes Namespace
          </label>
          <input
            type="text"
            id="namespace"
            name="namespace"
            required
            placeholder="Enter namespace"
            className="w-full px-3 py-2 border rounded-md"
          />
          <p className="mt-1 text-sm text-gray-500">
            The namespace where the application will be deployed. If it doesn't exist, it will be created.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Advanced Options</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showAdvancedOptions"
              checked={showAdvancedOptions}
              onChange={(e) => setShowAdvancedOptions(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="showAdvancedOptions" className="ml-2 text-sm text-gray-700">
              Show advanced options
            </label>
          </div>
        </div>

        {showAdvancedOptions && (
          <div className="space-y-6">
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Mini-Service Deployment Options</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="miniServiceEnabled"
                    name="miniServiceEnabled"
                    checked={miniServiceEnabled}
                    onChange={(e) => setMiniServiceEnabled(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label htmlFor="miniServiceEnabled" className="ml-2 text-sm text-gray-700">
                    Enable Mini Services
                  </label>
                </div>

                <div className={`ml-6 space-y-4 ${!miniServiceEnabled && 'opacity-50'}`}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="depositServiceEnabled"
                      name="depositServiceEnabled"
                      checked={miniServiceEnabled}
                      disabled={!miniServiceEnabled}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <label htmlFor="depositServiceEnabled" className="ml-2 text-sm text-gray-700">
                      Deploy Deposit Service
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="settlementServiceEnabled"
                      name="settlementServiceEnabled"
                      checked={miniServiceEnabled}
                      disabled={!miniServiceEnabled}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <label htmlFor="settlementServiceEnabled" className="ml-2 text-sm text-gray-700">
                      Deploy Settlement Service
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chainId" className="block text-sm font-medium text-gray-700 mb-1">
                  Chain ID
                </label>
                <input
                  type="text"
                  id="chainId"
                  name="chainId"
                  placeholder="Enter chain ID (e.g. 56 for BSC)"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="allowedOrigins" className="block text-sm font-medium text-gray-700 mb-1">
                  Allowed Origins
                </label>
                <input
                  type="text"
                  id="allowedOrigins"
                  name="allowedOrigins"
                  defaultValue="*"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="deployValue" className="block text-sm font-medium text-gray-700 mb-1">
                  Deploy Value
                </label>
                <select
                  id="deployValue"
                  name="deployValue"
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="TRUE">TRUE</option>
                  <option value="">FALSE</option>
                </select>
              </div>

              <div>
                <label htmlFor="remoteValue" className="block text-sm font-medium text-gray-700 mb-1">
                  Remote Value
                </label>
                <select
                  id="remoteValue"
                  name="remoteValue"
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="TRUE">TRUE</option>
                  <option value="FALSE">FALSE</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="migrateValue" className="block text-sm font-medium text-gray-700 mb-1">
                  Migrate Value
                </label>
                <select
                  id="migrateValue"
                  name="migrateValue"
                  value={migrateValue}
                  onChange={(e) => setMigrateValue(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="FALSE">FALSE</option>
                  <option value="TRUE">TRUE</option>
                </select>
              </div>

              <div>
                <label htmlFor="autoSubmitValue" className="block text-sm font-medium text-gray-700 mb-1">
                  Auto Submit Value
                </label>
                <input
                  type="text"
                  id="autoSubmitValue"
                  name="autoSubmitValue"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="migrateImageValue" className="block text-sm font-medium text-gray-700 mb-1">
                  Migrate Image Value (MD5)
                </label>
                <input
                  type="text"
                  id="migrateImageValue"
                  name="migrateImageValue"
                  placeholder="MD5 hash of the image to migrate from"
                  pattern="[a-fA-F0-9]{32}"
                  title="Please enter a valid 32-character MD5 hash"
                  className={`w-full px-3 py-2 border rounded-md ${
                    migrateValue === 'TRUE' ? 'border-yellow-400' : ''
                  }`}
                  required={migrateValue === 'TRUE'}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Required when Migrate Value is TRUE
                </p>
              </div>

              <div>
                <label htmlFor="imageValue" className="block text-sm font-medium text-gray-700 mb-1">
                  Image Value (MD5)
                </label>
                <input
                  type="text"
                  id="imageValue"
                  name="imageValue"
                  placeholder="MD5 hash of the image"
                  pattern="[a-fA-F0-9]{32}"
                  title="Please enter a valid 32-character MD5 hash"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="forceImageTag"
                  name="forceImageTag"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="forceImageTag" className="ml-2 text-sm text-gray-700">
                  Force use branch as image tag
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enable this option if you want to use the branch name as the image tag even if the image check fails.
                This is useful when you know the image exists but the system cannot detect it automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="settlementContractAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Settlement Contract Address
                </label>
                <input
                  type="text"
                  id="settlementContractAddress"
                  name="settlementContractAddress"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="rpcProvider" className="block text-sm font-medium text-gray-700 mb-1">
                  RPC Provider
                </label>
                <input
                  type="text"
                  id="rpcProvider"
                  name="rpcProvider"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="customEnvVars" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Environment Variables (JSON format)
              </label>
              <textarea
                id="customEnvVars"
                name="customEnvVars"
                rows={3}
                placeholder='{"KEY1": "value1", "KEY2": "value2"}'
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Deploy
          </button>
        </div>
      </form>
    </div>
  )
} 