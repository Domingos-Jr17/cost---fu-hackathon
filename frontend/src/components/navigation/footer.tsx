import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Costant</h3>
            <p className="text-gray-600 text-sm">
              A Ponte entre os Dados da Infraestrutura e Todos os Cidadãos
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-blue-600 text-sm">Início</Link></li>
              <li><Link href="/projects" className="text-gray-600 hover:text-blue-600 text-sm">Projetos</Link></li>
              <li><Link href="/reports" className="text-gray-600 hover:text-blue-600 text-sm">Relatos</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-blue-600 text-sm">Sobre</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li><Link href="/ussd" className="text-gray-600 hover:text-blue-600 text-sm">Acesso USSD</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">API Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Dados Abertos</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Relatórios</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacte-nos</h3>
            <address className="text-gray-600 text-sm not-italic">
              <p>Ministério das Obras Públicas e Habitação</p>
              <p>Maputo, Moçambique</p>
              <p className="mt-2">Email: info@costant.mz</p>
              <p>Telefone: *123# (Acesso USSD)</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Costant - Plataforma de Transparência de Infraestrutura. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}