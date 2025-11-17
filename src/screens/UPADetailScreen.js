import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import FilaCard from '../components/FilaCard';
import { servicosAPI, filasAPI } from '../api/endpoints';
import { COLORS } from '../utils/constants';

const UPADetailScreen = ({ route }) => {
  const { upa } = route.params;
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEspecialidades = async () => {
    try {
      // Buscar serviços da unidade
      const servicos = await servicosAPI.getByUnidade(upa.id);
      
      // Para cada serviço, buscar tempo médio real
      const especialidadesComDados = await Promise.all(
        servicos.map(async (servico) => {
          try {
            const stats = await filasAPI.getEstatisticas(upa.id, servico.id);
            return {
              nome: servico.nome,
              tempoConsulta: stats.tempoMedio || 15,
            };
          } catch (error) {
            return {
              nome: servico.nome,
              tempoConsulta: 15,
            };
          }
        })
      );
      
      setEspecialidades(especialidadesComDados);
    } catch (error) {
      console.error('Erro ao carregar especialidades:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEspecialidades();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadEspecialidades, 30000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadEspecialidades();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando especialidades...</Text>
      </View>
    );
  }

  // Calcular tempo médio geral
  const tempoMedioConsulta = especialidades.length > 0
    ? Math.round(especialidades.reduce((sum, esp) => sum + esp.tempoConsulta, 0) / especialidades.length)
    : 15;

  return (
    <View style={styles.container}>
      {/* Header com informações gerais */}
      <View style={styles.header}>
        <Text style={styles.upaName}>{upa.nome}</Text>
        <Text style={styles.upaAddress}>{upa.endereco}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{tempoMedioConsulta} min</Text>
            <Text style={styles.statLabel}>Tempo médio</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{especialidades.length}</Text>
            <Text style={styles.statLabel}>Especialidades</Text>
          </View>
        </View>
      </View>

      {/* Lista de especialidades */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Filas por Especialidade</Text>
        
        {especialidades.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma especialidade disponível</Text>
          </View>
        ) : (
          especialidades.map((esp) => (
            <FilaCard
              key={esp.id}
              especialidade={esp.nome}
              tempoConsulta={esp.tempoConsulta}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.gray,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  upaName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  upaAddress: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 12,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
  },
});

export default UPADetailScreen;