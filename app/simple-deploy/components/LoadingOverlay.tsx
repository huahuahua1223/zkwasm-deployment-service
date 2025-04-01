export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <div className="mt-4 text-white text-lg">Deploying application...</div>
      </div>
    </div>
  )
} 