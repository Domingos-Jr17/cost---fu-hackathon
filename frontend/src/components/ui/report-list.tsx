'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, AlertCircle, Users, TrendingUp, EyeOff } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'qualidade' | 'corrupcao' | 'atraso' | 'outro';
  score: number;
  status: 'pendente' | 'verificado' | 'resolvido';
  location: string;
  created_at: string;
}

interface ReportListProps {
  projectId?: string;
  reports: Report[];
}

export default function ReportList({ projectId, reports }: ReportListProps) {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [scoreFilter, setScoreFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter((report) => {
    const matchesStatus = !statusFilter || report.status === statusFilter;
    const matchesType = !typeFilter || report.type === typeFilter;
    const matchesScore = !scoreFilter || report.score.toString() === scoreFilter;
    const matchesSearch = !searchTerm ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesType && matchesScore && matchesSearch;
  });

  const getReportTypeColor = (type: string): string => {
    switch (type) {
      case 'qualidade':
        return 'bg-yellow-100 text-yellow-800';
      case 'corrupcao':
        return 'bg-red-100 text-red-800';
      case 'atraso':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

              <div>
                <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Score
                </label>
                <select
                  id="score"
                  value={scoreFilter}
                  onChange={(e) => setScoreFilter(e.target.value)}
                  className="w-full p-2 border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <option value="">Todos os Scores</option>
                  <option value="1">Score 1</option>
                  <option value="2">Score 2</option>
                  <option value="3">Score 3</option>
                  <option value="4">Score 4</option>
                  <option value="5">Score 5</option>
                </select>
              </div>

              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Pesquisar
                </label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Pesquisar relatos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Nenhum relato encontrado</p>
                <p className="text-sm text-gray-600">
                  {projectId ? 'para este projeto.' : 'para nenhum projeto.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <Card key={report.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Badge className={getReportTypeColor(report.type)}>
                          {report.type === 'qualidade' && '⚠️ Qualidade'}
                          {report.type === 'corrupcao' && '🚨 Corrupção'}
                          {report.type === 'atraso' && '⏰ Atraso'}
                          {report.type === 'outro' && '📝 Outro'}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(report.created_at).toLocaleDateString('pt-MZ', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <Badge variant="outline">{report.status}</Badge>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Localização:</strong> {report.location}
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Score:</strong> {report.score}/5
                    </div>

                    <CardDescription className="text-sm text-gray-700">
                      {report.description}
                    </CardDescription>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href={`/reports/new?projectId=${projectId}`}>
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