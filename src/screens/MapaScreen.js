import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native';
import { unidadesAPI } from '../api/endpoints';
import { COLORS } from '../utils/constants';

const MapaScreen = () => {
  const [upas, setUpas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpas();
  }, []);

  const loadUpas = async () => {
    try {
      const unidades = await unidadesAPI.getAll();
      setUpas(unidades);
    } catch (error) {
      console.error('Erro ao carregar UPAs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Localizações das UPAs</Text>
        <Text style={styles.subtitle}>Mapa em desenvolvimento</Text>
      </View>
      
      <FlatList
        data={upas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>📍</Text>
              <Text style={styles.cardTitle}>{item.nome}</Text>
            </View>
            <Text style={styles.cardAddress}>{item.endereco}</Text>
            {item.latitude && item.longitude && (
              <Text style={styles.coordinates}>
                📍 {item.latitude}, {item.longitude}
              </Text>
            )}
          </View>
        )}
        contentContainerStyle={styles.list}
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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  cardAddress: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 12,
    color: COLORS.primary,
  },
});

export default MapaScreen;