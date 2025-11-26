'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AboutPage() {
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // This would get from API in real app
    const fetchProject = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch('/api/about');
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          throw new Error('Failed to fetch about information');
        }
      } catch (err: any) {
        console.error('Error fetching about:', err);
        setError('Falha ao carregar informações. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, []);

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
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Projeto não encontrado</h1>
              <p className="text-lg text-gray-600 mt-2">O projeto solicitado não foi encontrado ou não está disponível.</p>
            </div>
            <div className="text-center">
              <Link href="/projects">
                <Button>Voltar para Projetos</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    nome,
    descricao,
    provincia,
    setor,
    valor,
    moeda,
    estado,
    progresso,
    atraso,
    relatos,
    dataContrato,
    contratante,
    contratado,
    metodoProcurement,
  } = project;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{nome}</h1>
          <p className="text-xl text-white mb-6">Projeto de Infraestrutura em Moçambique</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{descricao}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Localização</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-lg font-semibold">{provincia}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Setor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-semibold">{setor}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Valor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-gray-900">{valor} {moeda}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(estado)}`} />
                    <span className="text-lg font-semibold ml-2">{estado}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progresso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${progresso}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-semibold text-gray-900 ml-2">{progresso}%</span>
                </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Relatos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900">{relatos}</span>
                    </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data do Contrato</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{dataContrato}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contratante</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{contratante}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contratado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{contratado}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Método Procurement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{metodoProcurement}</p>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:space-y-4 space-x-4 mt-6">
              <Link href={`/projects/${project?.id}/reports/new`}>
                <Button className="w-full">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Fazer um Relato
                </Button>
              </Link>

              <Link href="/projects">
                <Button variant="outline" className="w-full">
                  <MapPin className="w-4 h-4 mr-2" />
                  Voltar para Lista
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getStatusColor(estado: string): string {
  if (estado === 'Concluído') return 'bg-green-500';
  if (estado === 'Em Andamento') return 'bg-blue-500';
  if (estado === 'Cancelado') return 'bg-red-500';
  return 'bg-gray-500';
}