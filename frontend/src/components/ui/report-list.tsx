'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface ReportListProps {
  projectId: string;
  projectIdParam?: string;
}

interface Report {
  id: string;
  type: string;
  description: string;
  status: string;
  score: number;
  created_at: string;
  project_id: string;
}

// Mock report data
const mockReports: Report[] = [
  {
    id: 'report-1',
    type: 'qualidade',
    description: 'Buraco no pavimento que causa risco aos veículos',
    status: 'pendente',
    score: 5,
    created_at: '2024-01-15T10:30:00Z',
    project_id: 'mock-001',
  },
  {
    id: 'report-2',
    type: 'corrupcao',
    description: 'Suspeita de desvio de materiais sem devida comprovação',
    status: 'pendente',
    score: 8,
    created_at: '2024-01-14T14:15:00Z',
    project_id: 'mock-001',
  },
];

export default function ReportList({ projectId, projectIdParam }: ReportListProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Use projectId from URL params if not provided
  const currentProjectId = projectIdParam || projectId;

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      setError('');

      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (currentProjectId) {
          params.set('project_id', currentProjectId);
        }
        if (page) {
          params.set('page', page.toString());
        }
        if (statusFilter) {
          params.set('status', statusFilter);
        }
        if (typeFilter) {
          params.set('type', typeFilter);
        }

        // Fetch reports from API
        const response = await fetch(`/api/reports?${params.toString()}`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setReports(data.reports || []);
        } else {
          // Fallback to mock data
          const filteredMockReports = mockReports.filter(report =>
            report.project_id === currentProjectId
          );

          setReports(filteredMockReports);
        }
      } catch (err: any) {
        console.error('Error fetching reports:', err);
        setError('Falha ao carregar relatos. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [currentProjectId, projectIdParam, page, statusFilter, typeFilter]);

  const getReportTypeColor = (type: string): string => {
    const colorMap: { [key: string]: string } = {
      'qualidade': 'badge-warning',
      'corrupcao': 'badge-danger',
      'atraso': 'badge-secondary',
      'outro': 'badge-default',
    };

    return colorMap[type] || 'badge-default';
  };

  const getStatusColor = (status: string): string => {
    const colorMap: { [key: string]: string } = {
      'pendente': 'badge-secondary',
      'verificado': 'badge-success',
      'resolvido': 'badge-success',
      'spam': 'badge-danger',
    };

    return colorMap[status] || 'badge-secondary';
  };

  const getScoreWidth = (score: number): number => {
    // Width based on score (max 10)
    return Math.min(score * 10, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              <MapPin className="w-5 h-5 mr-2" />
              Relatos do Projeto
              <Badge className="ml-2">{reports.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Status
                </label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <option value="">Todos os Status</option>
                  <option value="pendente">Pendente</option>
                  <option value="verificado">Verificado</option>
                  <option value="resolvido">Resolvido</option>
                  <option value="spam">Spam</option>
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Tipo
                </label>
                <select
                  id="type"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full p-2 border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <option value="">Todos os Tipos</option>
                  <option value="qualidade">Qualidade</option>
                  <option value="corrupcao">Corrupção</option>
                  <option value="atraso">Atraso</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            {/* Reports List */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 border-t-transparent"></div>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Nenhum relato encontrado</p>
                <p className="text-sm text-gray-600">
                  {currentProjectId
                    ? 'para este projeto.'
                    : 'para nenhum projeto.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full p-1 text-xs font-medium ${getReportTypeColor(report.type)}`}
                        >
                          {report.type === 'qualidade' && '⚠️'}
                          {report.type === 'corrupcao' && '🚨'}
                          {report.type === 'atraso' && '⏰'}
                          {report.type === 'outro' && '📝'}
                        </div>
                        <span className="ml-2 text-xs text-gray-500">
                          {new Date(report.created_at).toLocaleDateString('pt-MZ', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-500">
                          Score: {report.score}
                        </span>
                        <div
                          className="w-16 h-2 bg-gray-200 rounded-sm">
                            <div
                              className="h-full bg-gray-300 rounded-full"
                              style={{ width: `${getScoreWidth(report.score)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {report.status}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                        >
                          <EyeOff className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardDescription className="text-sm text-gray-600 mt-2">
                    {report.description}
                  </CardDescription>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* New Report Button */}
        <div className="mt-6 text-center">
          <Link href={`/reports/new?projectId=${currentProjectId}`}>
            <Button variant="outline">
              <AlertCircle className="w-4 h-4 mr-2" />
              Fazer um Novo Relato
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}