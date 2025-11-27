'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Wifi,
  WifiOff,
  Database,
  Clock,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';

interface OfflineStatusProps {
  isOffline: boolean;
  lastSync?: string;
  cacheSize: string;
  hasCachedData: boolean;
  onRefresh?: () => void;
  onClearCache?: () => void;
}

export default function OfflineStatus({
  isOffline,
  lastSync,
  cacheSize,
  hasCachedData,
  onRefresh,
  onClearCache
}: OfflineStatusProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getTimeAgo = (timestamp?: string): string => {
    if (!timestamp) return 'Nunca';

    const now = Date.now();
    const syncTime = new Date(timestamp).getTime();
    const diffMs = now - syncTime;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `há ${days} dia${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `há ${hours} hora${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else {
      return 'agora';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOffline ? (
              <>
                <WifiOff className="w-4 h-4 text-orange-500" />
                <span className="text-orange-600">Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-green-600">Online</span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Menos' : 'Mais'}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Status Badge */}
          <div className="flex items-center justify-center">
            <Badge
              variant={isOffline ? "destructive" : "default"}
              className={isOffline ? "bg-orange-100 text-orange-800 border-orange-300" : ""}
            >
              {isOffline ? 'Modo Offline Ativo' : 'Conectado à Internet'}
            </Badge>
          </div>

          {/* Cache Status */}
          {hasCachedData && (
            <div className="text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3 text-blue-500" />
                  Cache Armazenado:
                </span>
                <span className="font-semibold">{cacheSize}</span>
              </div>

              {lastSync && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    Última Sincronização:
                  </span>
                  <span className="font-semibold text-gray-700">
                    {getTimeAgo(lastSync)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isOffline}
                className="flex-1"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Atualizar
              </Button>
            )}
            {onClearCache && hasCachedData && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearCache}
                className="flex-1"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Limpar Cache
              </Button>
            )}
          </div>

          {/* Detailed Info */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t space-y-3">
              <div className="text-sm text-gray-600">
                <h4 className="font-semibold text-gray-900 mb-2">Informações do Cache:</h4>

                {hasCachedData ? (
                  <ul className="space-y-1 text-xs">
                    <li>• Dados disponíveis mesmo sem conexão</li>
                    <li>• Sincronização automática quando online</li>
                    <li>• Tamanho aproximado: {cacheSize}</li>
                    {lastSync && <li>• Última atualização: {getTimeAgo(lastSync)}</li>}
                  </ul>
                ) : (
                  <ul className="space-y-1 text-xs">
                    <li>• Nenhum dado em cache</li>
                    <li>• Requer conexão para primeira utilização</li>
                  </ul>
                )}
              </div>

              {isOffline && (
                <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <div className="text-xs text-orange-800">
                    <p className="font-semibold">Funcionalidade Limitada</p>
                    <p>Algumas funções podem não estar disponíveis offline.</p>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500">
                <p className="mb-1">
                  <strong>Sobre o Modo Offline:</strong>
                </p>
                <p>
                  Esta aplicação utiliza Progressive Web App (PWA) para fornecer
                  funcionalidade básica mesmo sem acesso à internet. Os dados mais recentes
                  são armazenados localmente e atualizados automaticamente quando a conexão
                  for restabelecida.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}