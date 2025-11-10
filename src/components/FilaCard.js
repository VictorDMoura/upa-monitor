import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, getTempoColor } from '../utils/constants';

const FilaCard = ({ especialidade, quantidade, tempoMedio }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>🩺</Text>
        <Text style={styles.especialidade}>{especialidade}</Text>
      </View>
      
      <View style={styles.info}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Pessoas na fila</Text>
          <Text style={styles.value}>{quantidade}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.label}>Tempo médio</Text>
          <Text style={[styles.value, { color: getTempoColor(tempoMedio) }]}>
            {tempoMedio} min
          </Text>
        </View>
      </View>
      
      <View style={[styles.statusBar, { backgroundColor: getTempoColor(tempoMedio) }]} />
    </View>
  );
};

const styles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  especialidade: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  statusBar: {
    height: 4,
    borderRadius: 2,
    marginTop: 12,
  },
});

export default FilaCard;