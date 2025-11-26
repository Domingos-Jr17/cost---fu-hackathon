'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function UssdSimulatorPage() {
  const [sessionId, setSessionId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // In real app, this would be from API
  const ussdCode = '*555#'; // From environment

  useEffect(() => {
    // Initialize with mock session for demo
    setSessionId('demo-session');
  }, []);

  const handleSendUssd = async () => {
    if (!phoneNumber.trim()) {
      alert('Por favor, digite seu número de telefone');
      return;
    }

    setIsLoading(true);
    setLogs(prev => [...prev, `Enviando: *${ussdCode}#${phoneNumber}`]);
    setLogs(prev => [...prev, `Texto: ${message}`]);

    try {
      const response = await fetch('/api/ussd/simulator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          phoneNumber: '+258840000000', // Mock number for Mozambique
          text: message,
        }),
      });

      const result = await response.json();

      setLogs(prev => [...prev, `Resposta: ${result.text}`]);
      setMessage('');

      if (result.continue) {
        setSessionId(result.sessionId || sessionId);
      }
    } catch (error: any) {
      setLogs(prev => [...prev, `Erro: ${error.message}`]);
      setMessage('Erro ao enviar requisição USSD');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-900 p-4">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-6">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h1 className="text-2xl font-bold text-blue-600">Simulador USSD</h1>
                <Badge className="ml-2">DEMO</Badge>
              </CardTitle>
              <CardDescription>
                Simulador de interface USSD para o projeto Costant
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Phone Number Input */}
                <div>
                  <Input
                    type="text"
                    placeholder="Digite seu número de telefone (formato: +2588XXXXXXX)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <Input
                    type="text"
                    placeholder="Digite a mensagem USSD (max 160 caracteres)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full"
                    maxLength={160}
                  />
                </div>

                {/* Send Button */}
                <Button
                  onClick={handleSendUssd}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Enviando...' : 'Enviar USSD'}
                </Button>

                {/* Session Info */}
                {sessionId && (
                  <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Sessão Ativa:</strong> {sessionId}
                    </p>
                  </div>
                )}

                {/* Logs */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Logs da Sessão</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearLogs}
                    >
                      Limpar Logs
                    </Button>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {logs.length === 0 ? (
                      <p className="text-gray-500 text-center">Nenhuma requisição ainda</p>
                    ) : (
                      <div className="space-y-2">
                        {logs.map((log, index) => (
                          <div
                            key={index}
                            className="bg-white p-3 rounded border border-gray-200"
                          >
                            <div className="font-mono text-sm text-gray-700">{log}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wifi className="w-5 h-5 mr-2 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-600">Como Funciona</h3>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  <strong>1. Discar *555#</strong> no seu telefone
                </p>
                <p className="text-gray-700">
                  <strong>2. Selecione as opções:</strong> Siga as instruções do menu
                </p>
                <p className="text-gray-700">
                  <strong>3. Relatar problema:</strong> Escolha o tipo de problema e descreva
                </p>
                <p className="text-gray-700">
                  <strong>4. Sair:</strong> Encerra a sessão
                </p>
                <p className="text-gray-700">
                  <strong>Limitações:</strong> Máximo de 160 caracteres por resposta
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="mt-6">
            <Link href="/projects">
              <Button variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Ver Projetos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}