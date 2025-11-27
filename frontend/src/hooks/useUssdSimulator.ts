'use client';

import { useState, useCallback, useEffect } from 'react';
import { UssdMenu, UssdSession, ussdMenus, mockProjectsByProvince, mockProjectsBySector, mockStats } from '@/lib/ussd-menus';

export function useUssdSimulator() {
  const [sessionId, setSessionId] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [currentMenu, setCurrentMenu] = useState<string>('main');
  const [inputValue, setInputValue] = useState<string>('');
  const [sessionHistory, setSessionHistory] = useState<string[]>([]);
  const [sessionData, setSessionData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<Array<{ type: 'user' | 'system'; message: string; timestamp: Date }>>([]);

  // Initialize session
  const initializeSession = useCallback(() => {
    const newSessionId = `USSD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const defaultPhone = '+25884' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');

    setSessionId(newSessionId);
    setPhoneNumber(defaultPhone);
    setCurrentMenu('main');
    setSessionHistory(['main']);
    setSessionData({});
    setInputValue('');

    const initialLog = {
      type: 'system' as const,
      message: `Sessão iniciada: ${newSessionId}`,
      timestamp: new Date()
    };
    setLogs([initialLog]);

    // Log the initial menu
    setTimeout(() => {
      const menu = ussdMenus[currentMenu];
      setLogs(prev => [...prev, {
        type: 'system' as const,
        message: menu.content || menu.title,
        timestamp: new Date()
      }]);
    }, 100);
  }, [currentMenu]);

  // Add log entry
  const addLog = useCallback((type: 'user' | 'system', message: string) => {
    setLogs(prev => [...prev, {
      type,
      message,
      timestamp: new Date()
    }]);
  }, []);

  // Get current menu
  const getCurrentMenu = useCallback((): UssdMenu => {
    return ussdMenus[currentMenu] || ussdMenus['main'];
  }, [currentMenu]);

  // Handle user input
  const handleInput = useCallback((input: string) => {
    if (isLoading) return;

    setIsLoading(true);
    addLog('user', input);

    const menu = getCurrentMenu();

    // Handle different input types
    if (menu.input) {
      // Text/number input menus
      if (menu.input.type === 'text' || menu.input.type === 'number') {
        if (menu.input.validation && !menu.input.validation(input)) {
          addLog('system', '❌ Input inválido. Tente novamente.');
          setIsLoading(false);
          return;
        }

        // Store the input value
        setSessionData(prev => ({ ...prev, [currentMenu]: input }));
        setInputValue(input);

        // For report submission, generate a protocol number
        if (currentMenu.startsWith('report_') && !currentMenu.endsWith('_type')) {
          const protocolNumber = `REL-${Date.now().toString().slice(-8)}`;
          setSessionData(prev => ({ ...prev, protocol: protocolNumber }));

          setTimeout(() => {
            addLog('system', `✅ Relato registrado com sucesso!`);
            addLog('system', `📋 Protocolo: ${protocolNumber}`);
            setCurrentMenu('submit_report');
            setIsLoading(false);
          }, 1000);
          return;
        }
      }
    }

    // Handle option selection
    const selectedOption = menu.options?.find(option => option.id === input.trim());

    if (!selectedOption) {
      addLog('system', '❌ Opção inválida. Tente novamente.');
      setIsLoading(false);
      return;
    }

    // Navigate to next menu
    const nextMenu = selectedOption.next;

    if (nextMenu === 'exit') {
      addLog('system', '👋 Obrigado por usar o COSTANT! Sessão encerrada.');
      setTimeout(() => {
        setCurrentMenu('exit');
        setIsLoading(false);
      }, 1000);
      return;
    }

    // Handle special menu types
    if (nextMenu.startsWith('projects_')) {
      const projects = mockProjectsByProvince[nextMenu] || 'Nenhum projeto encontrado nesta província.';
      setTimeout(() => {
        addLog('system', projects);
        setCurrentMenu(nextMenu);
        setIsLoading(false);
      }, 1000);
      return;
    }

    if (nextMenu.startsWith('sectors_')) {
      const projects = mockProjectsBySector[nextMenu] || 'Nenhum projeto encontrado neste setor.';
      setTimeout(() => {
        addLog('system', projects);
        setCurrentMenu(nextMenu);
        setIsLoading(false);
      }, 1000);
      return;
    }

    if (nextMenu === 'view_stats') {
      const stats = `📊 Estatísticas COSTANT:
• Total: ${mockStats.total}
• Ativos: ${mockStats.active}
• Concluídos: ${mockStats.completed}
• Relatos: ${mockStats.reports}
• Províncias: ${mockStats.provinces}
• Impacto: ${mockStats.impact}`;

      setTimeout(() => {
        addLog('system', stats);
        setCurrentMenu(nextMenu);
        setIsLoading(false);
      }, 1000);
      return;
    }

    if (nextMenu === 'refresh_stats') {
      setTimeout(() => {
        addLog('system', '🔄 Estatísticas atualizadas com sucesso!');
        setCurrentMenu('stats');
        setIsLoading(false);
      }, 1500);
      return;
    }

    if (nextMenu === 'contact') {
      setTimeout(() => {
        addLog('system', `📞 Contato COSTANT:
• USSD: *555#
• Email: info@costant.gov.mz
• Linha Verde: 800 123 456
Horário: 08:00 - 18:00`);
        setCurrentMenu(nextMenu);
        setIsLoading(false);
      }, 1000);
      return;
    }

    // Handle regular menu navigation
    setTimeout(() => {
      setCurrentMenu(nextMenu);
      setSessionHistory(prev => [...prev, nextMenu]);

      const nextMenuData = ussdMenus[nextMenu];
      if (nextMenuData) {
        addLog('system', nextMenuData.content || nextMenuData.title);

        // Show options if available
        if (nextMenuData.options) {
          setTimeout(() => {
            const optionsText = nextMenuData.options
              .map(opt => `${opt.id}. ${opt.text}`)
              .join('\n');
            addLog('system', optionsText);
          }, 200);
        }
      }

      setIsLoading(false);
    }, 1000);
  }, [isLoading, addLog, getCurrentMenu, currentMenu]);

  // Handle navigation
  const navigateTo = useCallback((menuId: string) => {
    setCurrentMenu(menuId);
    setSessionHistory(prev => [...prev, menuId]);

    const menu = ussdMenus[menuId];
    if (menu) {
      addLog('system', menu.content || menu.title);
    }
  }, [addLog]);

  // Go back in history
  const goBack = useCallback(() => {
    if (sessionHistory.length > 1) {
      const newHistory = [...sessionHistory];
      newHistory.pop();
      const previousMenu = newHistory[newHistory.length - 1];

      setCurrentMenu(previousMenu);
      setSessionHistory(newHistory);

      const menu = ussdMenus[previousMenu];
      if (menu) {
        addLog('system', menu.content || menu.title);
      }
    }
  }, [sessionHistory, addLog]);

  // Clear session
  const clearSession = useCallback(() => {
    setSessionId('');
    setPhoneNumber('');
    setCurrentMenu('main');
    setSessionHistory([]);
    setSessionData({});
    setInputValue('');
    setLogs([]);
  }, []);

  // Clear logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Format session for display
  const formatSessionDisplay = useCallback(() => {
    const menu = getCurrentMenu();
    return {
      currentMenu: menu,
      sessionInfo: {
        id: sessionId,
        phone: phoneNumber,
        menu: currentMenu,
        history: sessionHistory
      },
      logs: logs.map(log => ({
        ...log,
        timestamp: log.timestamp.toLocaleTimeString('pt-MZ', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }))
    };
  }, [getCurrentMenu, sessionId, phoneNumber, currentMenu, sessionHistory, logs]);

  return {
    // State
    sessionId,
    phoneNumber,
    currentMenu,
    inputValue,
    sessionHistory,
    sessionData,
    isLoading,
    logs,

    // Actions
    initializeSession,
    handleInput,
    navigateTo,
    goBack,
    clearSession,
    clearLogs,

    // Helpers
    getCurrentMenu,
    formatSessionDisplay,

    // Computed
    isActive: sessionId.length > 0,
    canGoBack: sessionHistory.length > 1
  };
}