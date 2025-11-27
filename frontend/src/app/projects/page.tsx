'use client';

import { useState, useEffect } from 'react';

// Interface for project data
interface Project {
  id: string;
  nome: string;
  provincia: string;
  setor: string;
  estado: string;
  progresso: number;
  relatos?: number;
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, MapPin, TrendingUp, Calendar, Users, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorMessage from '@/components/ui/error-message';
import { useProjects } from '@/hooks/useApi';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  // Use API hook with parameters
  const {
    data: projectsData,
    loading,
    error,
    refetch
  } = useProjects({
    search: searchQuery,
    provincia: selectedProvince,
    setor: selectedSector,
    limit: 20 // Load 20 projects at a time
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The hook will automatically refetch with new parameters
  };

  const provinces = [
    'Maputo', 'Maputo Cidade', 'Gaza', 'Inhambane', 'Manica',
    'Sofala', 'Tete', 'Zambézia', 'Nampula', 'Niassa', 'Cabo Delgado'
  ];

  const sectors = [
    'Estradas', 'Escolas', 'Hospitais', 'Água', 'Eletricidade',
    'Habitação', 'Pontes', 'Edifícios Públicos', 'Irrigação',
    'Saneamento', 'Transporte', 'Telecomunicações'
  ];

  const projects: Project[] = Array.isArray(projectsData) ? projectsData : (projectsData as any)?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projetos de Infraestrutura</h1>
          <p className="text-gray-600">
            Explore projetos públicos de infraestrutura em Moçambique
          </p>
        </div>

        {/* Stats Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
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
            message={`Erro ao carregar projetos: ${error}`}
            onRetry={refetch}
            className="mb-6"
          />
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
                <p className="text-gray-600 mt-2">Projetos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {projects.filter(p => p.estado === 'Concluído' || p.estado === 'Concluido').length}
                </div>
                <p className="text-gray-600 mt-2">Concluídos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {projects.filter(p => p.estado === 'Em Andamento' || p.estado === 'Em andamento').length}
                </div>
                <p className="text-gray-600 mt-2">Em Andamento</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {projects.reduce((sum, p) => sum + (p.relatos || 0), 0)}
                </div>
                <p className="text-gray-600 mt-2">Relatos Totais</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-300">0</div>
                <p className="text-gray-600 mt-2">Projetos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-300">0</div>
                <p className="text-gray-600 mt-2">Concluídos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-300">0</div>
                <p className="text-gray-600 mt-2">Em Andamento</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-300">0</div>
                <p className="text-gray-600 mt-2">Relatos Totais</p>
              </CardContent>
            </Card>
          </div>
        )}

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Pesquisar projetos..."
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
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos Setores</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
            <Button type="submit" variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Carregando projetos..." />
          </div>
        ) : error ? (
          <ErrorMessage message={`Erro ao carregar projetos: ${error}`} onRetry={refetch} />
        ) : projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project: any) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{project.nome || project.name}</h3>
                          <Badge
                            className={
                              (project.estado || project.estado) === 'Concluído' || (project.estado || project.estado) === 'Concluido'
                                ? 'bg-green-100 text-green-800'
                                : (project.estado || project.estado) === 'Em Andamento' || (project.estado || project.estado) === 'Em andamento'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {project.estado || project.estado || project.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{project.provincia || project.province}</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            <span>{project.setor || project.sector}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{project.dataContrato || project.date}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-gray-900">{project.valor || project.value}</span>
                            {((project.estado || project.estado) === 'Em Andamento' || (project.estado || project.estado) === 'Em andamento') && project.progresso && (
                              <div className="ml-4 w-32">
                                <div className="flex items-center text-sm">
                                  <span className="text-gray-600 mr-2">{project.progresso}%</span>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        project.progresso > 80
                                          ? 'bg-green-500'
                                          : project.progresso > 50
                                            ? 'bg-blue-500'
                                            : 'bg-yellow-500'
                                      }`}
                                      style={{ width: `${project.progresso}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-gray-500 mr-1" />
                            <span className="text-gray-600">{project.relatos || project.reports || 0} relatos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum projeto encontrado com os filtros selecionados.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={refetch}>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Carregar mais projetos
          </Button>
        </div>
      </div>
    </div>
  );
}