import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import UPACard from '../components/UPACard';
import { unidadesAPI, filasAPI } from '../api/endpoints';
import { COLORS } from '../utils/constants';

const HomeScreen = () => {
  const [upas, setUpas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUpas = async () => {
    try {
      const unidades = await unidadesAPI.getAll();
      
      const upasComDados = await Promise.all(
        unidades.map(async (unidade) => {
          try {
            const filas = await filasAPI.getByUnidade(unidade.id);
            const stats = await filasAPI.getEstatisticas(unidade.id);
            
            return {
              ...unidade,
              totalPessoas: filas.length || 0,
              tempoMedioEspera: stats.tempoMedio || 0,
            };
          } catch (error) {
            console.log('Erro ao buscar dados da UPA:', unidade.nome);
            return {
              ...unidade,
              totalPessoas: 0,
              tempoMedioEspera: 0,
            };
          }
        })
      );
      
      setUpas(upasComDados);
    } catch (error) {
      console.error('Erro ao carregar UPAs:', error);
      Alert.alert(
        'Erro',
        'Não foi possível carregar as UPAs. Verifique sua conexão e o IP da API.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUpas();
    
    const interval = setInterval(loadUpas, 30000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadUpas();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando UPAs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>UPAs da Região</Text>
        <Text style={styles.subtitle}>{upas.length} unidades disponíveis</Text>
      </View>
      
      <FlatList
        data={upas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UPACard
            upa={item}
            onPress={() => console.log('Clicou em:', item.nome)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma UPA encontrada</Text>
          </View>
        }
      />
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
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  list: {
    padding: 16,
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

export default HomeScreen;