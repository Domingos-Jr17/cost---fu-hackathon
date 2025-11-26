'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle, Users, Calendar, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Mock data for development
const mockProjectDetails: { [key: string]: any } = {
  'mock-001': {
    id: 'mock-001',
    ocid: 'ocds-mock-001',
    nome: 'Reabilitação da Estrada Nacional EN1 - Trecho Maputo-Xai-Xai',
    descricao: 'Reabilitação e pavimentação de 450km da estrada principal entre Maputo e Gaza',
    provincia: 'Maputo',
    setor: 'Estradas',
    valor: '2.5B MZN',
    moeda: 'MZN',
    estado: 'Em Andamento',
    progresso: 65,
    atraso: 0,
    relatos: 3,
    dataContrato: '2023-06-15',
    contratante: 'Ministério das Obras Públicas e Habitação',
    contratado: 'China Road and Bridge Corporation',
    metodoProcurement: 'International Competitive Bidding',
  },
};

// Real API call would use this
export default function ProjectDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Try to get project from API first
    const fetchProject = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          throw new Error('Failed to fetch project');
        }
      } catch (err: any) {
        console.error('Error fetching project:', err);
        setError('Falha ao carregar projeto. Tente novamente.');

        // Use mock data as fallback
        setProject(mockProjectDetails[id] || null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Projeto não encontrado</h2>
            <p className="text-gray-600 mb-6">O projeto que você está procurando não existe ou foi removido.</p>
            <Link href="/projects">
              <Button>Voltar para Lista</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <Badge className={project.estado === 'Concluído' ? 'badge-success' : project.estado === 'Em Andamento' ? 'badge-warning' : 'badge-secondary'}>
                {project.estado}
              </Badge>
              <CardTitle className="ml-4">{project.nome}</CardTitle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <CardDescription className="text-sm">Valor</CardDescription>
                <p className="text-2xl font-bold text-gray-900">{project.valor}</p>
              </div>
              <div>
                <CardDescription className="text-sm">Província</CardDescription>
                <p className="text-lg font-semibold">{project.provincia}</p>
              </div>
              <div>
                <CardDescription className="text-sm">Setor</CardDescription>
                <p className="text-lg font-semibold">{project.setor}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <CardDescription className="text-sm">Progresso</CardDescription>
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${getProgressColor(project.progresso)}`}
                      style={{ width: `${project.progresso}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{project.progresso}%</span>
                </div>
              </div>
              <div>
                <CardDescription className="text-sm">Estado</CardDescription>
                <p className="text-lg font-semibold">{project.estado}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <CardDescription className="text-sm">Data Contrato</CardDescription>
                <p className="text-lg font-semibold">{project.dataContrato}</p>
              </div>
              <div>
                <CardDescription className="text-sm">Contratante</CardDescription>
                <p className="text-lg font-semibold">{project.contratante}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <CardDescription className="text-sm">Método Procurement</CardDescription>
                <p className="text-lg font-semibold">{project.metodoProcurement}</p>
              </div>
              <div>
                <CardDescription className="text-sm">Contratado</CardDescription>
                <p className="text-lg font-semibold">{project.contratado}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <CardDescription className="text-sm flex items-center mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">Localização</span>
                </CardDescription>
                <p className="text-lg">{project.location?.address || 'Localização não especificada'}</p>
              </div>
              <div>
                <CardDescription className="text-sm flex items-center mb-2">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">Relatos</span>
                </CardDescription>
                <p className="text-lg font-semibold">{project.relatos}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <CardDescription className="text-sm flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Data Início</span>
                </CardDescription>
                <p className="text-lg font-semibold">{formatDate(project.dataContrato)}</p>
              </div>
              <div>
                <CardDescription className="text-sm flex items-center mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Última Atualização</span>
                </CardDescription>
                <p className="text-lg font-semibold">Ainda não iniciado</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <CardDescription className="text-sm flex items-center mb-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="text-sm">Tendência de Crescimento</span>
                </CardDescription>
                <p className="text-lg font-semibold">Em Andamento</p>
              </div>
              <div>
                <CardDescription className="text-sm flex items-center mb-2">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Status</span>
                </CardDescription>
                <p className="text-lg font-semibold">{project.estado}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:space-y-0 space-y-4 space-x-4 mt-6">
              <Link href={`/projects/${id}/reports/new`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Fazer um Relato
                </Button>
              </Link>

              <Link href="/projects" className="flex-1">
                <Button variant="secondary" className="w-full">
                  <MapPin className="w-4 h-4 mr-2" />
                  Voltar para Lista
                </Button>
              </Link>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getProgressColor(progress: number): string {
  if (progress >= 90) return 'bg-green-500';
  if (progress >= 70) return 'bg-blue-500';
  if (progress >= 50) return 'bg-yellow-500';
  if (progress >= 30) return 'bg-orange-500';
  return 'bg-red-500';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-MZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}