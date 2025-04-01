import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center bg-gray-100 rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">ZKWasm Deployment Service</h1>
        <p className="text-xl text-gray-600 mb-4">Deploy zkwasm applications to Kubernetes with ease</p>
        <hr className="my-4 border-gray-300" />
        <p className="text-gray-600">A simple service to deploy applications from GitHub to Kubernetes using Helm charts</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link href="/simple-deploy" className="group">
          <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-xl font-semibold mb-2">Simple Deployment</h2>
            <p className="text-gray-600 mb-4">Deploy directly from a GitHub repository URL with minimal configuration</p>
            <div className="text-blue-600">Get Started →</div>
          </div>
        </Link>
        
        <Link href="/test-k8s" className="group">
          <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">Test Kubernetes Connection</h2>
            <p className="text-gray-600 mb-4">Verify your Kubernetes connection and view cluster information</p>
            <div className="text-blue-600">Test Connection →</div>
          </div>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600">
            1. Enter a GitHub repository URL<br />
            2. Specify a Kubernetes namespace<br />
            3. The service will automatically:<br />
            &nbsp;&nbsp;- Check for container images<br />
            &nbsp;&nbsp;- Generate Helm charts<br />
            &nbsp;&nbsp;- Deploy to Kubernetes
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Requirements</h2>
          <p className="text-gray-600">
            <strong>GitHub Repository:</strong><br />
            - Must have a container image published to GitHub Container Registry with the &lsquo;latest&rsquo; tag<br /><br />
            <strong>Kubernetes:</strong><br />
            - Valid kubeconfig with permissions to create and manage resources
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Advanced Options</h2>
          <p className="text-gray-600">
            Need more control? The simple deployment interface includes advanced options for:
            <ul className="list-disc list-inside mt-2">
              <li>Chain ID configuration</li>
              <li>CORS settings</li>
              <li>Deployment modes</li>
              <li>Custom environment variables</li>
            </ul>
          </p>
        </div>
      </div>
      
      <footer className="mt-12 pt-6 text-center text-gray-500">
        <p>ZKWasm Deployment Service &copy; 2024</p>
      </footer>
    </div>
  )
}
