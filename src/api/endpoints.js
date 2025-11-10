import apiClient from './client';

// Dados mockados para teste
const MOCK_DATA = {
  unidades: [
    {
      id: 1,
      nome: 'UPA Centro',
      endereco: 'Rua Principal, 100 - Centro',
      latitude: -23.5505,
      longitude: -46.6333,
    },
    {
      id: 2,
      nome: 'UPA Zona Norte',
      endereco: 'Av. Norte, 500 - Zona Norte',
      latitude: -23.5405,
      longitude: -46.6233,
    },
    {
      id: 3,
      nome: 'UPA Zona Sul',
      endereco: 'Rua Sul, 300 - Zona Sul',
      latitude: -23.5605,
      longitude: -46.6433,
    },
  ],
  servicos: [
    { id: 1, nome: 'Clínica Geral', unidadeId: 1 },
    { id: 2, nome: 'Pediatria', unidadeId: 1 },
    { id: 3, nome: 'Ortopedia', unidadeId: 1 },
    { id: 4, nome: 'Clínica Geral', unidadeId: 2 },
    { id: 5, nome: 'Cardiologia', unidadeId: 2 },
  ],
};

// Flag para usar dados mockados (mude para false quando a API estiver funcionando)
const USE_MOCK = true;

// Unidades (UPAs)
export const unidadesAPI = {
  getAll: async () => {
    if (USE_MOCK) {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_DATA.unidades;
    }
    const response = await apiClient.get('/unidades');
    return response.data;
  },
  
  getById: async (id) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_DATA.unidades.find(u => u.id === id);
    }
    const response = await apiClient.get(`/unidades/${id}`);
    return response.data;
  },
};


export const servicosAPI = {
  getAll: async () => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_DATA.servicos;
    }
    const response = await apiClient.get('/servicos');
    return response.data;
  },
  
  getByUnidade: async (unidadeId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_DATA.servicos.filter(s => s.unidadeId === unidadeId);
    }
    const response = await apiClient.get(`/servicos?unidade=${unidadeId}`);
    return response.data;
  },
};


export const filasAPI = {
  getByUnidade: async (unidadeId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Gerar fila aleatória
      const quantidade = Math.floor(Math.random() * 20) + 5;
      return Array(quantidade).fill(null).map((_, i) => ({ id: i + 1 }));
    }
    const response = await apiClient.get(`/atendimentos?unidade=${unidadeId}&status=1`);
    return response.data;
  },
  
  getByServico: async (servicoId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const quantidade = Math.floor(Math.random() * 15) + 3;
      return Array(quantidade).fill(null).map((_, i) => ({ id: i + 1 }));
    }
    const response = await apiClient.get(`/atendimentos?servico=${servicoId}&status=1`);
    return response.data;
  },
  
  getEstatisticas: async (unidadeId, servicoId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        tempoMedio: Math.floor(Math.random() * 60) + 15,
        totalAtendimentos: Math.floor(Math.random() * 50) + 10,
      };
    }
    try {
      const response = await apiClient.get('/atendimentos/estatisticas', {
        params: { unidade: unidadeId, servico: servicoId }
      });
      return response.data;
    } catch (error) {
      return {
        tempoMedio: Math.floor(Math.random() * 60) + 15,
        totalAtendimentos: Math.floor(Math.random() * 50) + 10,
      };
    }
  },
};

export const painelAPI = {
  getSenhasChamadas: async (unidadeId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [];
    }
    const response = await apiClient.get(`/painel/${unidadeId}`);
    return response.data;
  },
};
