/**
 * Utility class for data transformation and validation
 */

export interface CostProject {
  id: string;
  ocid: string;
  title: string;
  description: string;
  status: string;
  value: {
    amount: number;
    currency: string;
  };
  procurementMethod: string;
  numberOfTenderers: number;
  procurementCategory: string;
  contractDate: string;
  contractValue: {
    amount: number;
    currency: string;
  };
  buyer: {
    name: string;
  };
  procuringEntity: {
    name: string;
  };
  supplier: {
    name: string;
  };
  location: string;
  province: string;
  sector: string;
}

export interface SimplifiedProject {
  id: string;
  nome: string;
  descricao: string;
  provincia: string;
  setor: string;
  valor: string;
  moeda: string;
  estado: string;
  progresso: number;
  atraso: number;
  relatos: number;
  dataContrato: string;
  contratante: string;
  contratado: string;
  metodoProcurement: string;
}

export class DataTransformUtil {
  /**
   * Transform complex OC4IDS format to citizen-friendly format
   */
  static transformProject(costProject: CostProject): SimplifiedProject {
    // Extract status and progress
    const status = this.extractStatus(costProject);
    const progress = this.extractProgress(costProject);
    const delay = this.extractDelay(costProject);

    // Format currency
    const formattedValue = this.formatCurrency(costProject.contractValue?.amount || costProject.value?.amount || 0);

    // Extract province and sector from location or description
    const { provincia, setor } = this.extractLocationAndSector(costProject);

    return {
      id: costProject.id || costProject.ocid,
      nome: this.truncateText(costProject.title || costProject.description || 'Projeto sem nome', 60),
      descricao: this.truncateText(costProject.description || 'Sem descrição disponível', 120),
      provincia,
      setor,
      valor: formattedValue,
      moeda: costProject.value?.currency || 'MZN',
      estado: status,
      progresso: progress,
      atraso: delay,
      relatos: 0, // Will be updated from reports database
      dataContrato: costProject.contractDate ? new Date(costProject.contractDate).toLocaleDateString('pt-MZ') : 'Data não disponível',
      contratante: costProject.buyer?.name || costProject.procuringEntity?.name || 'Entidade não especificada',
      contratado: costProject.supplier?.name || 'Contratado não especificado',
      metodoProcurement: costProject.procurementMethod || 'Método não especificado',
    };
  }

  /**
   * Extract project status from complex data
   */
  private static extractStatus(project: CostProject): string {
    if (project.status) {
      const statusMap: { [key: string]: string } = {
        'active': 'Em Andamento',
        'completed': 'Concluído',
        'cancelled': 'Cancelado',
        'pending': 'Pendente',
        'planning': 'Planeamento',
        'tender': 'Em Licitação',
        'evaluation': 'Em Avaliação',
        'contract': 'Contratado',
        'implementation': 'Em Implementação',
        'finalization': 'Em Finalização',
        'closed': 'Encerrado',
      };
      return statusMap[project.status.toLowerCase()] || project.status;
    }

    // Default based on contract date and progress
    if (this.extractProgress(project) >= 100) {
      return 'Concluído';
    } else if (this.extractDelay(project) > 30) {
      return 'Com Atraso';
    } else {
      return 'Em Andamento';
    }
  }

  /**
   * Extract progress percentage (simulated based on available data)
   */
  private static extractProgress(project: CostProject): number {
    // In real implementation, this would come from actual progress data
    // For now, we'll simulate based on status
    const status = project.status?.toLowerCase();

    const progressMap: { [key: string]: number } = {
      'planning': 10,
      'tender': 20,
      'evaluation': 30,
      'contract': 40,
      'implementation': 60,
      'finalization': 85,
      'completed': 100,
      'closed': 100,
    };

    return progressMap[status] || 50; // Default 50% if unknown status
  }

  /**
   * Extract delay in days (simulated)
   */
  private static extractDelay(project: CostProject): number {
    // In real implementation, this would calculate actual delay
    // For now, we'll simulate based on contract date
    if (project.contractDate) {
      const contractDate = new Date(project.contractDate);
      const today = new Date();
      const daysSinceContract = Math.floor((today.getTime() - contractDate.getTime()) / (1000 * 60 * 60 * 24));

      // Simulate some projects with delays
      return Math.random() > 0.7 ? Math.floor(Math.random() * 60) : 0;
    }

    return 0;
  }

  /**
   * Extract province and sector from location or other fields
   */
  private static extractLocationAndSector(project: CostProject): { provincia: string; setor: string } {
    // List of Mozambique provinces
    const provinces = [
      'Maputo', 'Maputo Cidade', 'Gaza', 'Inhambane', 'Manica',
      'Sofala', 'Tete', 'Zambézia', 'Nampula', 'Niassa', 'Cabo Delgado'
    ];

    // List of common sectors
    const sectors = [
      'Estradas', 'Escolas', 'Hospitais', 'Água', 'Eletricidade',
      'Habitação', 'Pontes', 'Edifícios Públicos', 'Irrigação',
      'Saneamento', 'Transporte', 'Telecomunicações'
    ];

    // Extract province from location or description
    let province = 'Província não especificada';
    const text = `${project.location} ${project.description} ${project.buyer?.name} ${project.procuringEntity?.name}`.toLowerCase();

    for (const prov of provinces) {
      if (text.includes(prov.toLowerCase())) {
        province = prov;
        break;
      }
    }

    // Extract sector from title, description, or category
    let sector = 'Setor não especificado';
    const sectorText = `${project.title} ${project.description} ${project.procurementCategory}`.toLowerCase();

    for (const sec of sectors) {
      if (sectorText.includes(sec.toLowerCase())) {
        sector = sec;
        break;
      }
    }

    // Map procurement category to sector
    if (sector === 'Setor não especificado' && project.procurementCategory) {
      const categoryMap: { [key: string]: string } = {
        'works': 'Construção',
        'goods': 'Equipamentos',
        'services': 'Serviços',
        'consulting': 'Consultoria',
      };
      sector = categoryMap[project.procurementCategory.toLowerCase()] || project.procurementCategory;
    }

    return { provincia: province, setor: sector };
  }

  /**
   * Format currency amount to readable format
   */
  private static formatCurrency(amount: number): string {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    } else {
      return amount.toString();
    }
  }

  /**
   * Truncate text to specified length
   */
  private static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Validate if project data is complete
   */
  static validateProject(project: any): boolean {
    return !!(
      project &&
      (project.id || project.ocid) &&
      (project.title || project.description)
    );
  }
}