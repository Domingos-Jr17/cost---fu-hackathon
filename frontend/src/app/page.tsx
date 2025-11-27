'use client';

import { useState, useEffect } from 'react';

// Interface for stats data
interface StatsData {
  totalProjects?: number;
  activeProjects?: number;
  completedProjects?: number;
  totalReports?: number;
  provincesCovered?: number;
  sectorsCovered?: number;
}
import Link from 'next/link';
import { Search, Filter, MapPin, TrendingUp, Users, AlertCircle, Wifi, WifiOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorMessage from '@/components/ui/error-message';
import OfflineStatus from '@/components/ui/offline-status';
import { useOfflineStats } from '@/hooks/useOfflineApi';
import { useOfflineStatus } from '@/hooks/useOfflineApi';

export default function HomePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  // Monitor online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      updateOfflineIndicator();
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial check
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const updateOfflineIndicator = () => {
    const indicator = document.getElementById('offline-indicator');
    if (navigator.onLine) {
      indicator?.classList.add('hidden');
    } else {
      indicator?.classList.remove('hidden');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to projects page with search filters
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedProvince) params.set('provincia', selectedProvince);
    if (selectedSector) params.set('setor', selectedSector);

    window.location.href = `/projects${params.toString() ? '?' + params.toString() : ''}`;
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

  // Use the offline-enabled API hook for stats
  const { data: statsData, loading: statsLoading, error: statsError, isOffline: statsOffline, refetch: refetchStats } = useOfflineStats();

  // Use offline status hook for cache management
  const { status: cacheStatus, clearAllCache } = useOfflineStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Estatísticas e insights sobre projetos de infraestrutura</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Online Status */}
            <div className="flex items-center space-x-2 text-sm">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-600">Offline</span>
                </>
              )}
            </div>

            {/* USSD Info */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">USSD:</span> *555#
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Estatísticas Gerais</h2>
          {statsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner text="Carregando estatísticas..." />
            </div>
          ) : statsError ? (
            <ErrorMessage
              message={`Erro ao carregar estatísticas: ${statsError}`}
              onRetry={refetchStats}
              className="mb-6"
            />
          ) : statsData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{statsData.totalProjects || 0}</div>
                  <p className="text-sm text-gray-600">Projetos</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{statsData.activeProjects || 0}</div>
                  <p className="text-sm text-gray-600">Ativos</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">{statsData.completedProjects || 0}</div>
                  <p className="text-sm text-gray-600">Concluídos</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">{statsData.totalReports || 0}</div>
                  <p className="text-sm text-gray-600">Relatos</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">{statsData.provincesCovered || 0}</div>
                  <p className="text-sm text-gray-600">Províncias</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-indigo-600">{statsData.sectorsCovered || 0}</div>
                  <p className="text-sm text-gray-600">Setores</p>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            A Ponte entre os Dados da Infraestrutura e Todos os Cidadãos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Acesse informações sobre projetos de infraestrutura em todo o Moçambique.
            Funciona offline e está disponível para todos os tipos de telefone.
          </p>

          {/* Search Form */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar projetos por nome..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="input"
                  >
                    <option value="">Todas as Províncias</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="input"
                  >
                    <option value="">Todos os Setores</option>
                    {sectors.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" className="w-full btn-primary">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Projetos
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>


      {/* Recent Projects */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Projetos Recentes</h3>
          <Link href="/projects">
            <Button variant="outline">
              Ver Todos
              <Filter className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* This section will be populated with actual project data when API is implemented */}
          {statsLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))
          ) : statsError ? (
            <div className="col-span-full text-center py-8">
              <ErrorMessage message={`Erro ao carregar projetos recentes: ${statsError}`} onRetry={refetchStats} />
            </div>
          ) : (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">Projeto de exemplo {index + 1}</CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        Maputo • Estradas
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <Badge
                        className={
                          index % 3 === 0
                            ? 'bg-green-100 text-green-800'
                            : index % 3 === 1
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {index % 3 === 0 ? 'Concluído' : index % 3 === 1 ? 'Em Andamento' : 'Planejado'}
                      </Badge>
                      <span className="text-sm text-gray-600">{Math.floor(Math.random() * 40) + 40}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${Math.floor(Math.random() * 40) + 40}%`,
                          backgroundColor:
                            index % 3 === 0
                              ? '#10b981'  // green for completed
                              : index % 3 === 1
                                ? '#f59e0b'  // yellow for ongoing
                                : '#6b7280',  // gray for planned
                        }}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link href={`/projects/${index}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          Ver Detalhes
                        </Button>
                      </Link>
                      <Link href={`/reports/new?projectId=${index}`} className="flex-1">
                        <Button className="w-full" size="sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Relatar
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-8">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Participa na Transparência!
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Ajude-nos a monitorar projetos de infraestrutura em toda a Moçambique.
              Com o USSD *555# ou esta aplicação, você pode fazer relatos anónimos
              sobre problemas que encontrar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/reports/new">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Fazer um Relato
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                  Saber Mais
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <div className="mb-4">
              <p className="font-medium">Costant - Plataforma de Transparência de Infraestrutura</p>
              <p className="text-sm">A Ponte entre os Dados e Todos os Cidadãos</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Moçambique
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Para Todos os Cidadãos
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Hackathon Project
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              Desenvolvido para promover transparência e accountability em Moçambique
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}