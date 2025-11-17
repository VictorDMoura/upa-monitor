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
    { id: 6, nome: 'Pediatria', unidadeId: 2 },
    { id: 7, nome: 'Clínica Geral', unidadeId: 3 },
    { id: 8, nome: 'Pediatria', unidadeId: 3 },
    { id: 9, nome: 'Ortopedia', unidadeId: 3 },
  ],
  // Filas por serviço (quantidade de pessoas aguardando)
  filas: {
    1: 8,  // Clínica Geral UPA Centro
    2: 5,  // Pediatria UPA Centro
    3: 2,  // Ortopedia UPA Centro
    4: 12, // Clínica Geral UPA Zona Norte
    5: 3,  // Cardiologia UPA Zona Norte
    6: 7,  // Pediatria UPA Zona Norte
    7: 15, // Clínica Geral UPA Zona Sul
    8: 10, // Pediatria UPA Zona Sul
    9: 4,  // Ortopedia UPA Zona Sul
  },
  // Tempo médio de espera por serviço (em minutos)
  tempos: {
    1: 25,
    2: 30,
    3: 20,
    4: 45,
    5: 35,
    6: 40,
    7: 55,
    8: 50,
    9: 30,
  },
};

// Flag para usar dados mockados (mude para false quando a API estiver funcionando)
const USE_MOCK = false;

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
    // Adicionar limit=1000 para buscar todos os atendimentos sem paginação
    const response = await apiClient.get(`/atendimentos?unidade=${unidadeId}&status=1&limit=1000`);
    return response.data;
  },
  
  getByServico: async (servicoId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const quantidade = MOCK_DATA.filas[servicoId] || Math.floor(Math.random() * 15) + 3;
      return Array(quantidade).fill(null).map((_, i) => ({ id: i + 1, servicoId }));
    }
    // Adicionar limit=1000 para buscar todos os atendimentos sem paginação
    const response = await apiClient.get(`/atendimentos?servico=${servicoId}&status=1&limit=1000`);
    return response.data;
  },
  
  getEstatisticas: async (unidadeId, servicoId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        tempoMedio: servicoId ? (MOCK_DATA.tempos[servicoId] || 30) : Math.floor(Math.random() * 60) + 15,
        totalAtendimentos: Math.floor(Math.random() * 50) + 10,
      };
    }
    
    try {
      // Buscar TODOS os atendimentos (a API não filtra por status corretamente)
      const params = new URLSearchParams();
      if (unidadeId) params.append('unidade', unidadeId);
      if (servicoId) params.append('servico', servicoId);
      params.append('limit', '1000'); // Buscar mais atendimentos para ter finalizados suficientes
      
      const url = `/atendimentos?${params.toString()}`;
      const response = await apiClient.get(url);
      const todosAtendimentos = response.data;
      
      console.log('🔍 [ESTATÍSTICAS] Total retornado:', todosAtendimentos?.length || 0);
      if (todosAtendimentos?.length > 0) {
        console.log('🔍 [ESTATÍSTICAS] Primeiro retornado:', {
          status: todosAtendimentos[0].status,
          servico: todosAtendimentos[0].servico?.nome,
          dataFim: todosAtendimentos[0].dataFim
        });
      }
      
      // Filtrar apenas atendimentos finalizados
      let atendimentosFinalizados = todosAtendimentos.filter(a => 
        a.status === 'finalizado' && (a.dataFim || a.dt_fim)
      );
      
      // Se servicoId foi especificado, filtrar por serviço (a API não filtra corretamente)
      if (servicoId) {
        atendimentosFinalizados = atendimentosFinalizados.filter(a => 
          a.servico?.id === servicoId
        );
      }
      
      if (!atendimentosFinalizados || atendimentosFinalizados.length === 0) {
        return {
          tempoMedio: 15, // Valor padrão se não houver dados
          totalAtendimentos: 0,
        };
      }
      
      // Calcular tempo médio de atendimento
      let totalMinutos = 0;
      let count = 0;
      
      atendimentosFinalizados.forEach((atendimento) => {
        // Calcular pela diferença de datas
        if (atendimento.dataInicio && atendimento.dataFim) {
          const inicio = new Date(atendimento.dataInicio);
          const fim = new Date(atendimento.dataFim);
          const diferencaMs = fim - inicio;
          const minutos = Math.round(diferencaMs / 1000 / 60);
          
          // Considerar apenas atendimentos com tempo razoável (entre 1 e 180 minutos)
          if (minutos > 0 && minutos <= 180) {
            totalMinutos += minutos;
            count++;
          }
        }
      });
      
      const tempoMedio = count > 0 ? Math.round(totalMinutos / count) : 15;
      
      return {
        tempoMedio,
        totalAtendimentos: atendimentosFinalizados.length,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
      return {
        tempoMedio: 15, // Valor padrão em caso de erro
        totalAtendimentos: 0,
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
