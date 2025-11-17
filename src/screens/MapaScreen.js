import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native';
import * as Location from 'expo-location';
import { unidadesAPI } from '../api/endpoints';
import { COLORS } from '../utils/constants';

const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const formatarDistancia = (km) => {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
};

const MapaScreen = () => {
  const [upas, setUpas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (userLocation !== null) {
      loadUpas();
    }
  }, [userLocation]);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        loadUpas();
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      loadUpas();
    }
  };

  const loadUpas = async () => {
    try {
      const unidades = await unidadesAPI.getAll();
      
      const upasComDistancia = unidades.map((unidade) => {
        let distancia = null;
        if (userLocation && unidade.latitude && unidade.longitude) {
          distancia = calcularDistancia(
            userLocation.latitude,
            userLocation.longitude,
            unidade.latitude,
            unidade.longitude
          );
        }
        return { ...unidade, distancia };
      });
      
      const upasOrdenadas = upasComDistancia.sort((a, b) => {
        if (a.distancia === null) return 1;
        if (b.distancia === null) return -1;
        return a.distancia - b.distancia;
      });
      
      setUpas(upasOrdenadas);
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
              <View style={styles.headerContent}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                {item.distancia !== null && (
                  <Text style={styles.distancia}>{formatarDistancia(item.distancia)}</Text>
                )}
              </View>
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    flex: 1,
  },
  distancia: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
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