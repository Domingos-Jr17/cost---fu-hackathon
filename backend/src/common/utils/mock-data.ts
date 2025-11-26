import { CostProject } from './data-transform.util';

/**
 * Mock data for fallback when CoST API is unavailable
 * Representative projects from different provinces and sectors
 */

export const mockProjects: CostProject[] = [
  {
    id: 'mock-001',
    ocid: 'ocds-mock-001',
    title: 'Reabilitação da Estrada Nacional EN1 - Trecho Maputo-Xai-Xai',
    description: 'Reabilitação e pavimentação de 450km da estrada principal entre Maputo e Gaza',
    status: 'implementation',
    value: { amount: 2500000000, currency: 'MZN' },
    procurementMethod: 'International Competitive Bidding',
    numberOfTenderers: 8,
    procurementCategory: 'works',
    contractDate: '2023-06-15',
    contractValue: { amount: 2300000000, currency: 'MZN' },
    buyer: { name: 'Ministério das Obras Públicas e Habitação' },
    procuringEntity: { name: 'Administração Regional de Estradas - Sul' },
    supplier: { name: 'China Road and Bridge Corporation' },
    location: 'Maputo - Gaza',
    province: 'Maputo',
    sector: 'Estradas'
  },
  {
    id: 'mock-002',
    ocid: 'ocds-mock-002',
    title: 'Construção de Escola Primária Completa - Chicualacuala',
    description: 'Construção de escola com 6 salas de aula, secretaria e instalações desportivas',
    status: 'completed',
    value: { amount: 15000000, currency: 'MZN' },
    procurementMethod: 'National Competitive Bidding',
    numberOfTenderers: 5,
    procurementCategory: 'works',
    contractDate: '2023-03-20',
    contractValue: { amount: 14500000, currency: 'MZN' },
    buyer: { name: 'Ministério da Educação e Desenvolvimento Humano' },
    procuringEntity: { name: 'Direcção Provincial de Educação - Gaza' },
    supplier: { name: 'Mozambique Construction Ltd' },
    location: 'Chicualacuala, Gaza',
    province: 'Gaza',
    sector: 'Escolas'
  },
  {
    id: 'mock-003',
    ocid: 'ocds-mock-003',
    title: 'Reabilitação do Hospital Central da Beira',
    description: 'Reabilitação completa do hospital central com modernização de equipamentos',
    status: 'implementation',
    value: { amount: 450000000, currency: 'MZN' },
    procurementMethod: 'International Competitive Bidding',
    numberOfTenderers: 12,
    procurementCategory: 'works',
    contractDate: '2023-09-10',
    contractValue: { amount: 420000000, currency: 'MZN' },
    buyer: { name: 'Ministério da Saúde' },
    procuringEntity: { name: 'Hospital Central da Beira' },
    supplier: { name: 'Consórcio Saúde Mozambique' },
    location: 'Beira, Sofala',
    province: 'Sofala',
    sector: 'Hospitais'
  },
  {
    id: 'mock-004',
    ocid: 'ocds-mock-004',
    title: 'Sistema de Abastecimento de Água - Tete City',
    description: 'Implementação de sistema de tratamento e distribuição de água para 200.000 habitantes',
    status: 'planning',
    value: { amount: 89000000, currency: 'MZN' },
    procurementMethod: 'International Competitive Bidding',
    numberOfTenderers: 6,
    procurementCategory: 'works',
    contractDate: '2024-01-15',
    contractValue: { amount: 85000000, currency: 'MZN' },
    buyer: { name: 'Fundação para o Desenvolvimento da Água e Saneamento' },
    procuringEntity: { name: 'Direcção Provincial de Água e Saneamento - Tete' },
    supplier: { name: 'Veolia Water Technologies' },
    location: 'Tete, Tete',
    province: 'Tete',
    sector: 'Água'
  },
  {
    id: 'mock-005',
    ocid: 'ocds-mock-005',
    title: 'Construção de Ponte sobre o Rio Zambeze - Caia',
    description: 'Construção de ponte de 1.200m com acessos rodoviários',
    status: 'tender',
    value: { amount: 1200000000, currency: 'MZN' },
    procurementMethod: 'International Competitive Bidding',
    numberOfTenderers: 0,
    procurementCategory: 'works',
    contractDate: '2022-11-01',
    contractValue: { amount: 0, currency: 'MZN' },
    buyer: { name: 'Ministério das Obras Públicas e Habitação' },
    procuringEntity: { name: 'Administração Nacional de Estradas' },
    supplier: { name: 'Construtora não definida' },
    location: 'Caia, Sofala',
    province: 'Sofala',
    sector: 'Pontes'
  },
  {
    id: 'mock-006',
    ocid: 'ocds-mock-006',
    title: 'Eletrificação Rural - Nampula Province',
    description: 'Extensão da rede elétrica para 50 comunidades rurais',
    status: 'implementation',
    value: { amount: 320000000, currency: 'MZN' },
    procurementMethod: 'Limited International Bidding',
    numberOfTenderers: 4,
    procurementCategory: 'works',
    contractDate: '2023-11-01',
    contractValue: { amount: 300000000, currency: 'MZN' },
    buyer: { name: 'Electricidade de Moçambique (EDM)' },
    procuringEntity: { name: 'Direcção Regional EDM - Norte' },
    supplier: { name: 'Power Grid International' },
    location: 'Nampula',
    province: 'Nampula',
    sector: 'Eletricidade'
  },
  {
    id: 'mock-007',
    ocid: 'ocds-mock-007',
    title: 'Construção de Centro de Saúde - Pemba',
    description: 'Construção de centro de saúde de nível 2 com maternidade e laboratório',
    status: 'completed',
    value: { amount: 28000000, currency: 'MZN' },
    procurementMethod: 'National Competitive Bidding',
    numberOfTenderers: 7,
    procurementCategory: 'works',
    contractDate: '2023-02-10',
    contractValue: { amount: 27000000, currency: 'MZN' },
    buyer: { name: 'Ministério da Saúde' },
    procuringEntity: { name: 'Direcção Provincial de Saúde - Cabo Delgado' },
    supplier: { name: 'Construção Saúde Norte' },
    location: 'Pemba, Cabo Delgado',
    province: 'Cabo Delgado',
    sector: 'Hospitais'
  },
  {
    id: 'mock-008',
    ocid: 'ocds-mock-008',
    title: 'Habitación Social - Cidade de Nacala',
    description: 'Construção de 200 unidades habitacionais de baixo custo',
    status: 'evaluation',
    value: { amount: 68000000, currency: 'MZN' },
    procurementMethod: 'International Competitive Bidding',
    numberOfTenderers: 9,
    procurementCategory: 'works',
    contractDate: '2023-02-15',
    contractValue: { amount: 0, currency: 'MZN' },
    buyer: { name: 'Ministério das Obras Públicas e Habitação' },
    procuringEntity: { name: 'Fundação de Apoio à Habitação' },
    supplier: { name: 'Construtora não definida' },
    location: 'Nacala, Nampula',
    province: 'Nampula',
    sector: 'Habitação'
  },
  {
    id: 'mock-009',
    ocid: 'ocds-mock-009',
    title: 'Sistema de Irrigação - Chokwe',
    description: 'Implementação de sistema de irrigação por gotejamento para 5.000 hectares',
    status: 'implementation',
    value: { amount: 156000000, currency: 'MZN' },
    procurementMethod: 'Limited International Bidding',
    numberOfTenderers: 3,
    procurementCategory: 'goods',
    contractDate: '2023-08-20',
    contractValue: { amount: 150000000, currency: 'MZN' },
    buyer: { name: 'Ministério da Agricultura e Segurança Alimentar' },
    procuringEntity: { name: 'Direcção Provincial de Agricultura - Gaza' },
    supplier: { name: 'Irrigation Tech Mozambique' },
    location: 'Chokwe, Gaza',
    province: 'Gaza',
    sector: 'Irrigação'
  },
  {
    id: 'mock-010',
    ocid: 'ocds-mock-010',
    title: 'Construção de Terminal Portuário - Quelimane',
    description: 'Construção de terminal portuário moderno para carga e passageiros',
    status: 'planning',
    value: { amount: 890000000, currency: 'MZN' },
    procurementMethod: 'International Competitive Bidding',
    numberOfTenderers: 0,
    procurementCategory: 'works',
    contractDate: '2023-01-10',
    contractValue: { amount: 0, currency: 'MZN' },
    buyer: { name: 'Ministério dos Transportes e Comunicações' },
    procuringEntity: { name: 'Administração Nacional de Portos' },
    supplier: { name: 'Construtora não definida' },
    location: 'Quelimane, Zambézia',
    province: 'Zambézia',
    sector: 'Transporte'
  },
  {
    id: 'mock-011',
    ocid: 'ocds-mock-011',
    title: 'Reabilitação de Rede de Saneamento - Maputo',
    description: 'Reabilitação e expansão da rede de esgotos para 100.000 habitantes',
    status: 'implementation',
    value: { amount: 450000000, currency: 'MZN' },
    procurementMethod: 'International Competitive Bidding',
    numberOfTenderers: 5,
    procurementCategory: 'works',
    contractDate: '2023-10-15',
    contractValue: { amount: 420000000, currency: 'MZN' },
    buyer: { name: 'Fundação para o Desenvolvimento da Água e Saneamento' },
    procuringEntity: { name: 'Conservatório de Águas da Cidade de Maputo' },
    supplier: { name: 'Saneamento África do Sul' },
    location: 'Maputo',
    province: 'Maputo',
    sector: 'Saneamento'
  },
  {
    id: 'mock-012',
    ocid: 'ocds-mock-012',
    title: 'Construção de Universidade Técnica - Lichinga',
    description: 'Construção de campus universitário com laboratórios e residências',
    status: 'evaluation',
    value: { amount: 780000000, currency: 'MZN' },
    procurementMethod: 'International Competitive Bidding',
    numberOfTenderers: 11,
    procurementCategory: 'works',
    contractDate: '2022-08-20',
    contractValue: { amount: 0, currency: 'MZN' },
    buyer: { name: 'Ministério da Educação e Desenvolvimento Humano' },
    procuringEntity: { name: 'Universidade Pedagógica' },
    supplier: { name: 'Construtora não definida' },
    location: 'Lichinga, Niassa',
    province: 'Niassa',
    sector: 'Escolas'
  },
  {
    id: 'mock-013',
    ocid: 'ocds-mock-013',
    title: 'Reabilitação de Aeroporto Regional - Chimoio',
    description: 'Modernização de terminal e extensão de pista para aviões de médio porte',
    status: 'tender',
    value: { amount: 125000000, currency: 'MZN' },
    procurementMethod: 'Limited International Bidding',
    numberOfTenderers: 0,
    procurementCategory: 'works',
    contractDate: '2023-05-12',
    contractValue: { amount: 0, currency: 'MZN' },
    buyer: { name: 'Ministério dos Transportes e Comunicações' },
    procuringEntity: { name: 'Administração de Aeroportos de Moçambique' },
    supplier: { name: 'Construtora não definida' },
    location: 'Chimoio, Manica',
    province: 'Manica',
    sector: 'Transporte'
  },
  {
    id: 'mock-014',
    ocid: 'ocds-mock-014',
    title: 'Sistema de Telecomunicações Rurais - Inhambane',
    description: 'Instalação de 100 torres de comunicação 4G para zonas rurais',
    status: 'planning',
    value: { amount: 340000000, currency: 'MZN' },
    procurementMethod: 'International Competitive Bidding',
    numberOfTenderers: 0,
    procurementCategory: 'goods',
    contractDate: '2023-03-18',
    contractValue: { amount: 0, currency: 'MZN' },
    buyer: { name: 'Instituto Nacional das Comunicações de Moçambique' },
    procuringEntity: { name: 'Tmcel' },
    supplier: { name: 'Fornecedor não definido' },
    location: 'Inhambane',
    province: 'Inhambane',
    sector: 'Telecomunicações'
  },
  {
    id: 'mock-015',
    ocid: 'ocds-mock-015',
    title: 'Construção de Estádio Municipal - Xai-Xai',
    description: 'Construção de estádio para 15.000 espectadores com pista de atletismo',
    status: 'implementation',
    value: { amount: 560000000, currency: 'MZN' },
    procurementMethod: 'International Competitive Bidding',
    numberOfTenderers: 6,
    procurementCategory: 'works',
    contractDate: '2023-07-01',
    contractValue: { amount: 540000000, currency: 'MZN' },
    buyer: { name: 'Ministério da Juventude e Desportos' },
    procuringEntity: { name: 'Conselho Municipal de Xai-Xai' },
    supplier: { name: 'Mozambique Sports Infrastructure' },
    location: 'Xai-Xai, Gaza',
    province: 'Gaza',
    sector: 'Edifícios Públicos'
  }
];

/**
 * Get mock projects with optional filtering
 */
export function getMockProjects(filters?: {
  province?: string;
  sector?: string;
  limit?: number;
}): CostProject[] {
  let filteredProjects = [...mockProjects];

  // Apply province filter
  if (filters?.province) {
    filteredProjects = filteredProjects.filter(project =>
      project.province.toLowerCase().includes(filters.province!.toLowerCase())
    );
  }

  // Apply sector filter
  if (filters?.sector) {
    filteredProjects = filteredProjects.filter(project =>
      project.sector.toLowerCase().includes(filters.sector!.toLowerCase())
    );
  }

  // Apply limit
  if (filters?.limit) {
    filteredProjects = filteredProjects.slice(0, filters.limit);
  }

  return filteredProjects;
}

/**
 * Get mock project by ID
 */
export function getMockProjectById(id: string): CostProject | null {
  return mockProjects.find(project => project.id === id || project.ocid === id) || null;
}