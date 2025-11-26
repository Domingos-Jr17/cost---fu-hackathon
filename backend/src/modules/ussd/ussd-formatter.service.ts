import { Injectable } from '@nestjs/common';

/**
 * USSD Formatter Service - Formats responses for USSD display
 */
@Injectable()
export class UssdFormatterService {
  /**
   * Format main menu
   */
  formatMainMenu(): string {
    return `MENU PRINCIPAL\n1. Selecionar Província\n2. Selecionar Setor\n3. Ver Projetos\n0. Sair`;
  }

  /**
   * Format province list
   */
  formatProvinceList(provinces: string[]): string {
    const provinceOptions = provinces.map((province, index) => `${index + 1}. ${province}`);

    return `SELECIONE UMA PROVÍNCIA:\n${provinceOptions.join('\n')}`;
  }

  /**
   * Format sector list
   */
  formatSectorList(sectors: string[]): string {
    const sectorOptions = sectors.map((sector, index) => `${index + 1}. ${sector}`);

    return `SELECIONE UM SETOR:\n${sectorOptions.join('\n')}`;
  }

  /**
   * Format project list
   */
  formatProjectList(projects: any[], startIndex: number): string {
    const projectOptions = projects.slice(startIndex, startIndex + 10).map((project, index) => {
      const optionIndex = startIndex + index + 1;
      return `${optionIndex}. ${project.nome}`;
    });

    return `SELECIONE UM PROJETO:\n${projectOptions.join('\n')}`;
  }

  /**
   * Format project details
   */
  formatProjectDetails(project: any): string {
    const lines = [
      `PROJETO: ${project.nome}`,
      `PROVÍNCIA: ${project.provincia}`,
      `SETOR: ${project.setor}`,
      `VALOR: ${project.valor} ${project.moeda}`,
      `ESTADO: ${project.estado}`,
      `PROGRESSO: ${project.progresso}%`,
      `DATA CONTRATO: ${project.dataContrato}`,
      `CONTRATANTE: ${project.contratante}`,
      `CONTRATADO: ${project.contratado}`,
    ];

    return lines.join('\n');
  }

  /**
   * Format report confirmation
   */
  formatReportConfirmation(): string {
    return 'RELATO REGISTADO! Obrigado pela sua participação.\nAgradecemos Costant!';
  }

  /**
   * Format error message
   */
  formatError(error: string): string {
    return `ERRO: ${error}\nTente novamente ou contate o suporte.`;
  }

  /**
   * Format project selection menu
   */
  formatProjectSelectionMenu(projectCount: number): string {
    return `PROJETO SELECIONADO:\n${projectCount}\n0. Voltar ao menu principal\n1. Relatar problema`;
  }

  /**
   * Format report type menu
   */
  formatReportTypeMenu(): string {
    return `TIPO DE RELATO:\n1. Atraso\n2. Qualidade\n3. Corrupção\n4. Outro`;
  }

  /**
   * Format report description prompt
   */
  formatReportDescriptionPrompt(): string {
    return `DESCREVA O PROBLEMA (max 160 chars):`;
  }

  /**
   * Truncate text for USSD
   */
  truncateForUssd(text: string, maxLength: number = 160): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Truncate project name for USSD
   */
  truncateProjectNameForUssd(name: string, maxLength: number = 30): string {
    if (name.length <= maxLength) {
      return name;
    }
    return name.substring(0, maxLength - 3) + '...';
  }
}