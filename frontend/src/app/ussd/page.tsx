'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Wifi, WifiOff, AlertCircle, Smartphone, MessageSquare, Clock, ArrowLeft, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useUssdSimulator } from '@/hooks/useUssdSimulator';

export default function UssdSimulatorPage() {
  const {
    sessionId,
    phoneNumber,
    currentMenu,
    inputValue,
    sessionHistory,
    sessionData,
    isLoading,
    logs,
    initializeSession,
    handleInput,
    goBack,
    clearSession,
    clearLogs,
    getCurrentMenu,
    isActive,
    canGoBack
  } = useUssdSimulator();

  const [simulatorMode, setSimulatorMode] = useState<'phone' | 'web'>('web');
  const [userInput, setUserInput] = useState('');

  // USSD Code
  const ussdCode = '*555#';

  // Initialize session on mount
  useEffect(() => {
    if (!isActive) {
      initializeSession();
    }
  }, [isActive, initializeSession]);

  // Handle input submission
  const handleSubmitInput = () => {
    if (!userInput.trim() || isLoading) return;

    handleInput(userInput.trim());
    setUserInput('');
  };

  // Handle option click (for web mode)
  const handleOptionClick = (optionId: string) => {
    if (isLoading) return;
    handleInput(optionId);
  };

  const menu = getCurrentMenu();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-gray-900 p-4">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-6 max-w-4xl mx-auto">
          {/* Header */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                  <h1 className="text-2xl font-bold text-blue-600">Simulador USSD</h1>
                  <Badge variant="secondary">INTERATIVO</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={simulatorMode === 'web' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSimulatorMode('web')}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Web
                  </Button>
                  <Button
                    variant={simulatorMode === 'phone' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSimulatorMode('phone')}
                  >
                    <Smartphone className="w-4 h-4 mr-1" />
                    Telefone
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Simulador completo USSD {ussdCode} - Plataforma COSTANT
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Session Info */}
              {isActive && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        <Wifi className="w-3 h-3 mr-1" />
                        Sessão Ativa
                      </Badge>
                      <span className="font-mono text-green-700">{sessionId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Fone:</span>
                      <span className="font-mono text-green-700">{phoneNumber}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-6">
                {/* USSD Screen */}
                <div>
                  <Card className="border-2 border-gray-300 bg-gray-900 text-green-400">
                    <CardHeader className="bg-gray-800 border-b border-gray-700 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          <span className="text-xs font-bold text-green-400">USSD {ussdCode}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date().toLocaleTimeString('pt-MZ', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      {/* Menu Content */}
                      <div className="mb-4 min-h-[200px]">
                        {menu && (
                          <div className="space-y-2">
                            <div className="text-white text-sm font-semibold mb-2">
                              {menu.title}
                            </div>
                            <div className="text-green-300 text-sm leading-relaxed">
                              {menu.content}
                            </div>

                            {/* Options */}
                            {menu.options && simulatorMode === 'web' && (
                              <div className="mt-3 space-y-1">
                                {menu.options.map((option) => (
                                  <Button
                                    key={option.id}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOptionClick(option.id)}
                                    className="w-full justify-start text-left text-green-300 hover:text-green-100 hover:bg-gray-700 p-2 h-auto"
                                    disabled={isLoading}
                                  >
                                    <span className="mr-2 font-bold">{option.id}.</span>
                                    {option.text}
                                  </Button>
                                ))}
                              </div>
                            )}

                            {/* Show options for phone mode */}
                            {menu.options && simulatorMode === 'phone' && (
                              <div className="mt-3 space-y-1 text-green-300 text-sm">
                                {menu.options.map((option) => (
                                  <div key={option.id} className="font-mono">
                                    {option.id}. {option.text}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Input field */}
                            {menu.input && (
                              <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-700">
                                <div className="text-xs text-gray-400 mb-1">
                                  {menu.input.type === 'text' ? 'Texto:' : 'Número:'}
                                </div>
                                <Input
                                  type={menu.input.type}
                                  placeholder={menu.input.placeholder}
                                  value={userInput}
                                  onChange={(e) => setUserInput(e.target.value)}
                                  className="bg-gray-700 border-gray-600 text-green-300 placeholder-gray-500"
                                  maxLength={160}
                                  disabled={isLoading}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Navigation buttons */}
                      <div className="flex gap-2 mt-4">
                        {canGoBack && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={goBack}
                            className="flex-1"
                            disabled={isLoading}
                          >
                            <ArrowLeft className="w-3 h-3 mr-1" />
                            Voltar
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearSession}
                          className="flex-1"
                          disabled={isLoading}
                        >
                          <LogOut className="w-3 h-3 mr-1" />
                          Encerrar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Input Controls */}
                  {simulatorMode === 'phone' && (
                    <Card className="mt-4">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <Input
                            type="text"
                            placeholder="Digite sua resposta (1, 2, 3...) ou texto"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            maxLength={160}
                            disabled={isLoading}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSubmitInput();
                              }
                            }}
                          />
                          <Button
                            onClick={handleSubmitInput}
                            disabled={isLoading || !userInput.trim()}
                            className="w-full"
                          >
                            {isLoading ? 'Processando...' : 'Enviar'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Session Logs */}
                <div>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Histórico da Sessão
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearLogs}
                        >
                          Limpar
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="bg-black text-green-400 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
                        {logs.length === 0 ? (
                          <div className="text-gray-500 text-center">
                            Nenhuma interação ainda
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {logs.map((log, index) => (
                              <div
                                key={index}
                                className={`border-l-2 pl-3 py-1 ${
                                  log.type === 'user'
                                    ? 'border-blue-400 text-blue-300'
                                    : 'border-green-400 text-green-300'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs text-gray-500">
                                    [{log.timestamp.toLocaleTimeString('pt-MZ', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}]
                                  </span>
                                  <Badge
                                    variant="outline"
                                    size="sm"
                                    className={`${
                                      log.type === 'user'
                                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                                        : 'bg-green-100 text-green-800 border-green-300'
                                    }`}
                                  >
                                    {log.type === 'user' ? 'VOCÊ' : 'SYS'}
                                  </Badge>
                                </div>
                                <div className="break-all">{log.message}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Current status indicator */}
                        {isLoading && (
                          <div className="text-center py-2">
                            <Badge className="animate-pulse bg-yellow-100 text-yellow-800 border-yellow-300">
                              Processando...
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-600">Como Usar o Simulador</h3>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📱 Modo Telefone</h4>
                  <p className="text-gray-700 text-sm">
                    Simula a experiência real de USSD. Digite os números das opções
                    no campo de input e pressione Enter ou clique em Enviar.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🖥️ Modo Web</h4>
                  <p className="text-gray-700 text-sm">
                    Interface mais intuitiva com botões clicáveis para cada opção.
                    Ideal para demonstração e testes rápidos.
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>USSD Real:</strong> Discar {ussdCode} em qualquer telefone
                  moçambicano para acessar o serviço real da COSTANT.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex gap-4">
            <Link href="/projects">
              <Button variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Ver Projetos
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                🏠 Início
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}