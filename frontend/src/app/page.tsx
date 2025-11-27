'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, TrendingUp, Users, AlertCircle, Wifi, WifiOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data for development
const mockStats = {
  totalProjects: 1250,
  activeProjects: 342,
  completedProjects: 785,
  totalReports: 15420,
  provincesCovered: 11,
  sectorsCovered: 12,
};

const mockRecentProjects = [
  {
    id: 'mock-1',
    nome: 'Reabilitação da Estrada Nacional EN1 - Trecho Maputo-Xai-Xai',
    provincia: 'Maputo',
    setor: 'Estradas',
    estado: 'Em Andamento',
    progresso: 65,
  },
  {
    id: 'mock-2',
    nome: 'Construção de Escola Primária Completa - Chicualacuala',
    provincia: 'Gaza',
    setor: 'Escolas',
    estado: 'Concluído',
    progresso: 100,
  },
  {
    id: 'mock-3',
    nome: 'Reabilitação do Hospital Central da Beira',
    provincia: 'Sofala',
    setor: 'Hospitais',
    estado: 'Em Andamento',
    progresso: 45,
  },
];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/logo-removebg-preview.png"
                alt="Costant Logo"
                className="w-32 h-16 object-contain"
              />
        
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
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

      {/* Quick Stats */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{mockStats.totalProjects}</div>
              <div className="text-sm text-gray-600">Projetos Totais</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{mockStats.activeProjects}</div>
              <div className="text-sm text-gray-600">Em Andamento</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">{mockStats.completedProjects}</div>
              <div className="text-sm text-gray-600">Concluídos</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{mockStats.totalReports}</div>
              <div className="text-sm text-gray-600">Relatos</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{mockStats.provincesCovered}</div>
              <div className="text-sm text-gray-600">Províncias</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{mockStats.sectorsCovered}</div>
              <div className="text-sm text-gray-600">Setores</div>
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
          {mockRecentProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{project.nome}</CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {project.provincia} • {project.setor}
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
                        project.estado === 'Concluído'
                          ? 'badge-success'
                          : project.estado === 'Em Andamento'
                          ? 'badge-warning'
                          : 'badge-secondary'
                      }
                    >
                      {project.estado}
                    </Badge>
                    <span className="text-sm text-gray-600">{project.progresso}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${project.progresso}%`,
                        backgroundColor:
                          project.estado === 'Concluído'
                            ? '#10b981'
                            : project.estado === 'Em Andamento'
                            ? '#f59e0b'
                            : '#6b7280',
                      }}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link href={`/projects/${project.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        Ver Detalhes
                      </Button>
                    </Link>
                    <Link href={`/reports/new?projectId=${project.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Relatar
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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