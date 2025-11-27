import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Search, Plus, MapPin } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatos de Projetos</h1>
          <p className="text-gray-600">
            Veja e reporte problemas ou progressos em projetos de infraestrutura
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">24</div>
              <p className="text-gray-600 mt-2">Total de Relatos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">18</div>
              <p className="text-gray-600 mt-2">Resolvidos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">6</div>
              <p className="text-gray-600 mt-2">Pendentes</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Relatos Recentes</CardTitle>
            <Link href="/reports/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Relato
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">Problema na Estrada Nacional 1</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Relatado por: Cidadão de Xai-Xai • 2 horas atrás
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>Província de Gaza</span>
                    </div>
                  </div>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    Pendente
                  </span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">Progresso na Escola Primária</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Relatado por: Eng. Maria • 1 dia atrás
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>Província de Maputo</span>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Resolvido
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Ver Todos os Relatos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}