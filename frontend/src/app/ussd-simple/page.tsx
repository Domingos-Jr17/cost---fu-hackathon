'use client';

import { useState, useEffect } from 'react';

// Simplified USSD Menu Structure
const ussdMenus = {
  main: {
    title: 'COSTANT - Transparência de Infraestrutura',
    content: 'Bem-vindo! Escolha uma opção:\n\n1. Projetos\n2. Estatísticas\n3. Relatar Problema\n4. Sobre\n5. Sair',
    options: ['1', '2', '3', '4', '5']
  },
  projects: {
    title: 'PROJETOS',
    content: 'Consulte projetos por:\n\n1. Província\n2. Setor\n3. Nome\n0. Voltar',
    options: ['1', '2', '3', '0']
  },
  stats: {
    title: 'ESTATÍSTICAS',
    content: '📊 Estatísticas COSTANT:\n• Total: 1,247 projetos\n• Ativos: 892\n• Concluídos: 355\n• Relatos: 1,892\n• Províncias: 11\n\n9. Atualizar\n0. Voltar',
    options: ['9', '0']
  },
  report_type: {
    title: 'RELATAR PROBLEMA',
    content: 'Tipo de problema:\n\n1. Estradas\n2. Pontes\n3. Escolas\n4. Hospitais\n5. Água\n6. Energia\n0. Voltar',
    options: ['1', '2', '3', '4', '5', '6', '0']
  },
  about: {
    title: 'SOBRE COSTANT',
    content: 'COSTANT - Construção Otimizada e Sustentável\n\nPlataforma nacional de transparência de infraestrutura.\n\nAcompanhe projetos, relate problemas e contribua para o desenvolvimento de Moçambique.\n\n0. Voltar',
    options: ['0']
  },
  exit: {
    title: 'OBRIGADO',
    content: '👋 Obrigado por usar o COSTANT!\n\nPara usar novamente:\nDisque *555# em qualquer telefone moçambicano.\n\nwww.costant.gov.mz',
    options: []
  }
};

export default function UssdSimplePage() {
  const [currentMenu, setCurrentMenu] = useState('main');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(['main']);
  const [displayText, setDisplayText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const menu = ussdMenus[currentMenu as keyof typeof ussdMenus];
    setDisplayText(menu.content);
  }, [currentMenu]);

  const handleInput = (value: string) => {
    if (isProcessing) return;

    setInput(value);
    setIsProcessing(true);

    // Simulate USSD processing delay
    setTimeout(() => {
      const menu = ussdMenus[currentMenu as keyof typeof ussdMenus];

      // Handle back navigation
      if (value === '0' && history.length > 1) {
        const newHistory = [...history];
        newHistory.pop();
        const previousMenu = newHistory[newHistory.length - 1];
        setCurrentMenu(previousMenu);
        setHistory(newHistory);
        setInput('');
        setIsProcessing(false);
        return;
      }

      // Handle main menu options
      switch (currentMenu) {
        case 'main':
          switch (value) {
            case '1':
              setCurrentMenu('projects');
              setHistory([...history, 'projects']);
              break;
            case '2':
              setCurrentMenu('stats');
              setHistory([...history, 'stats']);
              break;
            case '3':
              setCurrentMenu('report_type');
              setHistory([...history, 'report_type']);
              break;
            case '4':
              setCurrentMenu('about');
              setHistory([...history, 'about']);
              break;
            case '5':
              setCurrentMenu('exit');
              setHistory([...history, 'exit']);
              break;
            default:
              // Invalid option
              break;
          }
          break;
        case 'projects':
          if (value === '0') {
            const newHistory = [...history];
            newHistory.pop();
            setCurrentMenu('main');
            setHistory(newHistory);
          } else {
            // Show mock projects based on selection
            const projects = {
              '1': '📍 Maputo: 142 projetos\n🏗️ Estrada Nacional 1\n🏫 Escola Primária de Matola\n🏥 Hospital Central de Maputo',
              '2': '🏫 Educação: 324 projetos\n📚 Escolas primárias construídas\n🎓 Bibliotecas equipadas\n💻 Laboratórios informáticos',
              '3': '🔍 Pesquisa de projetos...\nDigite o nome do projeto'
            };

            if (projects[value as keyof typeof projects]) {
              setCurrentMenu('project_results');
              setHistory([...history, 'project_results']);
              // Update menu content dynamically
              ussdMenus['project_results'] = {
                title: 'RESULTADOS',
                content: projects[value as keyof typeof projects] + '\n\n0. Voltar',
                options: ['0']
              };
            }
          }
          break;
        case 'stats':
          if (value === '9') {
            // Refresh stats
            setCurrentMenu('stats_refresh');
            ussdMenus['stats_refresh'] = {
              title: 'ESTATÍSTICAS ATUALIZADAS',
              content: '🔄 Estatísticas atualizadas com sucesso!\n\n• +12 projetos novos\n• +8 relatos recebidos\n• -2 projetos concluídos\n\n0. Voltar',
              options: ['0']
            };
            setHistory([...history, 'stats_refresh']);
          } else if (value === '0') {
            const newHistory = [...history];
            newHistory.pop();
            setCurrentMenu('main');
            setHistory(newHistory);
          }
          break;
        case 'report_type':
          if (value === '0') {
            const newHistory = [...history];
            newHistory.pop();
            setCurrentMenu('main');
            setHistory(newHistory);
          } else {
            setCurrentMenu('report_details');
            setHistory([...history, 'report_details']);
            ussdMenus['report_details'] = {
              title: 'DETALHES DO PROBLEMA',
              content: `Problema selecionado: ${value}\n\nPor favor, descreva o problema:\n(Localização, tipo, urgência)\n\nEnvie sua descrição ou\n0. Voltar`,
              options: ['0']
            };
          }
          break;
        case 'about':
          if (value === '0') {
            const newHistory = [...history];
            newHistory.pop();
            setCurrentMenu('main');
            setHistory(newHistory);
          }
          break;
        case 'report_details':
          if (value === '0') {
            const newHistory = [...history];
            newHistory.pop();
            setCurrentMenu('report_type');
            setHistory(newHistory);
          } else if (value.length > 10) {
            setCurrentMenu('report_confirm');
            setHistory([...history, 'report_confirm']);
            const protocol = `REL-${Date.now().toString().slice(-8)}`;
            ussdMenus['report_confirm'] = {
              title: 'RELATO REGISTRADO',
              content: `✅ Relato registrado com sucesso!\n\n📋 Protocolo: ${protocol}\n📍 Sua denuncia foi recebida\n🔍 Será analisada em 24h\n\nObrigado pela colaboração!\n\n5. Voltar ao menu principal`,
              options: ['5']
            };
          }
          break;
        case 'project_results':
        case 'stats_refresh':
        case 'report_confirm':
          if (value === '0' || value === '5') {
            setCurrentMenu('main');
            setHistory(['main']);
          }
          break;
        case 'exit':
          // Restart from exit
          setCurrentMenu('main');
          setHistory(['main']);
          break;
      }

      setInput('');
      setIsProcessing(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInput(input);
    }
  };

  const handleRestart = () => {
    setCurrentMenu('main');
    setHistory(['main']);
    setInput('');
  };

  const menu = ussdMenus[currentMenu as keyof typeof ussdMenus];

  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* USSD Phone Frame */}
        <div className="bg-gray-900 rounded-3xl p-4 border-4 border-gray-700 shadow-2xl">
          {/* Phone Header */}
          <div className="flex items-center justify-between mb-4 text-green-400 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-bold">USSD *555#</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-gray-700 rounded-sm"></div>
                <div className="w-4 h-4 bg-gray-700 rounded-sm"></div>
                <div className="w-4 h-4 bg-gray-700 rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* USSD Screen */}
          <div className="bg-black rounded-lg p-4 mb-4 min-h-[300px] max-h-[400px] overflow-y-auto">
            {/* Menu Title */}
            <div className="text-green-300 font-bold text-sm mb-3 border-b border-green-800 pb-2">
              {menu.title}
            </div>

            {/* Menu Content */}
            <div className="text-green-400 text-sm font-mono leading-relaxed whitespace-pre-line mb-4">
              {displayText}
              {isProcessing && (
                <div className="animate-pulse mt-2">
                  Processando...
                </div>
              )}
            </div>

            {/* Visual Options Grid */}
            {!isProcessing && menu.options.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-6 border-t border-green-800 pt-4">
                {menu.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleInput(option)}
                    className="bg-gray-800 hover:bg-gray-700 text-green-400 font-mono text-lg py-3 rounded border border-green-800 transition-colors"
                    disabled={isProcessing}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          {!isProcessing && (currentMenu === 'report_details' || menu.options.length === 0) && (
            <div className="bg-gray-800 rounded-lg p-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua resposta..."
                className="w-full bg-transparent text-green-400 placeholder-green-700 outline-none font-mono text-sm"
                maxLength={160}
                disabled={isProcessing}
              />
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleRestart}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-green-400 py-2 rounded text-sm font-mono transition-colors"
            >
              Reiniciar
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-green-400 py-2 rounded text-sm font-mono transition-colors"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-gray-700">
          <h3 className="text-green-400 font-bold text-sm mb-2">Como usar:</h3>
          <ul className="text-green-300 text-xs space-y-1 font-mono">
            <li>• Clique nos números das opções</li>
            <li>• Digite texto quando solicitado</li>
            <li>• Pressione Enter para enviar</li>
            <li>• Use 0 para voltar ao menu anterior</li>
            <li>• USSD Real: *555# (Moçambique)</li>
          </ul>
        </div>

        {/* Back Navigation */}
        <div className="mt-4 text-center">
          <a
            href="/ussd"
            className="text-green-400 hover:text-green-300 text-sm underline"
          >
            ← Versão completa do simulador
          </a>
        </div>
      </div>
    </div>
  );
}