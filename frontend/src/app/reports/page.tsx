'use client';

import { useState } from 'react';

// Interface for report data
interface Report {
  id: string;
  estado: string;
  [key: string]: any;
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Search, Plus, MapPin, Filter, Loader2 } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorMessage from '@/components/ui/error-message';
import { useReports } from '@/hooks/useApi';

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Use API hook with parameters
  const {
    data: reportsData,
    loading,
    error,
    refetch
  } = useReports({
    limit: 20
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The hook will automatically refetch with new parameters
  };

  const provinces = [
    'Maputo', 'Maputo Cidade', 'Gaza', 'Inhambane', 'Manica',
    'Sofala', 'Tete', 'Zambézia', 'Nampula', 'Niassa', 'Cabo Delgado'
  ];

  const statusOptions = [
    'Todos', 'Pendente', 'Resolvido', 'Em Análise'
  ];

  const reports: Report[] = Array.isArray(reportsData) ? reportsData : (reportsData as any)?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatos de Projetos</h1>
          <p className="text-gray-600">
            Veja e reporte problemas ou progressos em projetos de infraestrutura
          </p>
        </div>

        {/* Stats Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-gray-300">--</div>
                  <p className="text-gray-400 mt-2">Carregando...</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <ErrorMessage
            message={`Erro ao carregar relatos: ${error}`}
            onRetry={refetch}
            className="mb-6"
          />
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{reports.length}</div>
                <p className="text-gray-600 mt-2">Total de Relatos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {reports.filter(r => r.estado === 'Resolvido').length}
                </div>
                <p className="text-gray-600 mt-2">Resolvidos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {reports.filter(r => r.estado === 'Pendente').length}
                </div>
                <p className="text-gray-600 mt-2">Pendentes</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-300">0</div>
                <p className="text-gray-600 mt-2">Total de Relatos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-300">0</div>
                <p className="text-gray-600 mt-2">Resolvidos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-300">0</div>
                <p className="text-gray-600 mt-2">Pendentes</p>
              </CardContent>
            </Card>
          </div>
        )}

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Pesquisar relatos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas Províncias</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <Button type="submit" variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </form>

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
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner text="Carregando relatos..." />
              </div>
            ) : error ? (
              <ErrorMessage message={`Erro ao carregar relatos: ${error}`} onRetry={refetch} />
            ) : reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report: any) => (
                  <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{report.titulo || report.nome}</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Relatado por: {report.autor || 'Cidadão'} • {report.dataRelato || report.createdAt}
                        </p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{report.provincia || 'Província não especificada'}</span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        report.estado === 'Resolvido'
                          ? 'bg-green-100 text-green-800'
                          : report.estado === 'Pendente'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.estado || 'Não definido'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Nenhum relato encontrado com os filtros selecionados.</p>
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={refetch}>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Carregar mais relatos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}