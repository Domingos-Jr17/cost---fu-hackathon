import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, MapPin, TrendingUp, Calendar, Users, Filter } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const projects = [
  {
    id: 'project-001',
    name: 'Reabilitação da Estrada Nacional EN1 - Trecho Maputo-Xai-Xai',
    province: 'Maputo',
    sector: 'Estradas',
    value: '2.5B MZN',
    status: 'Em Andamento',
    progress: 65,
    reports: 3,
    date: '2023-06-15',
  },
  {
    id: 'project-002',
    name: 'Expansão da Rede de Água em Nampula',
    province: 'Nampula',
    sector: 'Água e Saneamento',
    value: '1.8B MZN',
    status: 'Planejado',
    progress: 0,
    reports: 0,
    date: '2023-09-01',
  },
  {
    id: 'project-003',
    name: 'Construção do Hospital Central de Tete',
    province: 'Tete',
    sector: 'Saúde',
    value: '3.2B MZN',
    status: 'Concluído',
    progress: 100,
    reports: 5,
    date: '2023-03-10',
  },
  {
    id: 'project-004',
    name: 'Rede Elétrica Rural em Cabo Delgado',
    province: 'Cabo Delgado',
    sector: 'Energia',
    value: '1.5B MZN',
    status: 'Em Andamento',
    progress: 42,
    reports: 2,
    date: '2023-07-20',
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projetos de Infraestrutura</h1>
          <p className="text-gray-600">
            Explore projetos públicos de infraestrutura em Moçambique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
              <p className="text-gray-600 mt-2">Total de Projetos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {projects.filter(p => p.status === 'Concluído').length}
              </div>
              <p className="text-gray-600 mt-2">Concluídos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {projects.filter(p => p.status === 'Em Andamento').length}
              </div>
              <p className="text-gray-600 mt-2">Em Andamento</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {projects.reduce((sum, p) => sum + (p.reports || 0), 0)}
              </div>
              <p className="text-gray-600 mt-2">Relatos Totais</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Pesquisar projetos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
            <Button>
              <MapPin className="w-4 h-4 mr-2" />
              Mapa
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
                        <Badge 
                          className={
                            project.status === 'Concluído' 
                              ? 'bg-green-100 text-green-800' 
                              : project.status === 'Em Andamento' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{project.province}</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          <span>{project.sector}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{project.date}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-900">{project.value}</span>
                          {project.status === 'Em Andamento' && (
                            <div className="ml-4 w-32">
                              <div className="flex items-center text-sm">
                                <span className="text-gray-600 mr-2">{project.progress}%</span>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      project.progress > 80 
                                        ? 'bg-green-500' 
                                        : project.progress > 50 
                                          ? 'bg-blue-500' 
                                          : 'bg-yellow-500'
                                    }`}
                                    style={{ width: `${project.progress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-500 mr-1" />
                          <span className="text-gray-600">{project.reports} relatos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="outline">
            Carregar mais projetos
          </Button>
        </div>
      </div>
    </div>
  );
}