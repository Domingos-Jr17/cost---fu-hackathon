'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Upload, MapPin } from 'lucide-react';

interface ReportFormProps {
  projectId: string;
  onSubmit: (data: any) => void;
  initialData?: {
    type?: string;
    description?: string;
    photo?: File;
    location?: {
      lat: number;
      lng: number;
      address: string;
    };
  };
}

export default function ReportForm({ projectId, onSubmit, initialData }: ReportFormProps) {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'qualidade',
    description: initialData?.description || '',
    photo: initialData?.photo,
    location: initialData?.location,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await onSubmit({
        projectId,
        ...formData,
        // In real app, this would include location
        location: {
          lat: -25.9685,
          lng: 32.5865,
          address: 'Estrada Nacional EN1, Maputo',
        },
      });

      setFormData({
        type: '',
        description: '',
        photo: undefined,
        location: undefined,
      });

      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar relato');
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
          Fazer um Relato
          <Badge className="ml-2">Obrigatório!</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Problema
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                <option value="atraso">Atraso</option>
                <option value="qualidade">Qualidade</option>
                <option value="corrupcao">Corrupção</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição Detalhada
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full p-2 border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                placeholder="Descreva o problema encontrado..."
                maxLength={1000}
              />
            </div>
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                Foto (Opcional)
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.files?.[0] }))}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  className="px-4 py-2"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Foto'}
                </Button>
              </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Enviando...' : 'Enviar Relato'}
            </Button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}