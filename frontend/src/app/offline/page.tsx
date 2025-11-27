export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <svg 
            className="w-16 h-16 mx-auto text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            ></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sem conexão</h1>
        <p className="text-gray-600 mb-6">
          Parece que você está offline. Os dados que você vê agora podem estar desatualizados.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <span className="font-medium">Dica:</span> Quando sua conexão for restaurada, 
            atualize a página para obter os dados mais recentes.
          </p>
        </div>
      </div>
    </div>
  );
}