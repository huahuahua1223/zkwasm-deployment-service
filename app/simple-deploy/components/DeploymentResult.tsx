interface DeploymentResultProps {
  result: any
}

export default function DeploymentResult({ result }: DeploymentResultProps) {
  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Deployment Result</h2>
        <div>No deployment has been made yet.</div>
      </div>
    )
  }

  // 格式化部署结果，使分支信息更加明显
  const formattedResult = result.success && result.details
    ? {
        success: result.success,
        message: result.message,
        details: {
          ...result.details,
          deploymentType: result.details.deploymentType === 'upgrade' ? '🔄 Upgrade' : '🚀 New Deployment',
          actionPerformed: result.details.actionPerformed === 'Upgrade' ? '🔄 Upgraded' : '🚀 Deployed',
        },
        upgradeInfo: result.upgradeInfo,
        notificationType: result.notificationType,
        notificationTitle: result.notificationTitle
      }
    : result

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Deployment Result</h2>
      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
        {JSON.stringify(formattedResult, null, 2)}
      </pre>
    </div>
  )
} 