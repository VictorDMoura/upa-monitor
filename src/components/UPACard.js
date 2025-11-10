import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getTempoColor } from '../utils/constants';

export default function UPACard({ upa, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(upa)}>
      <View style={styles.cardHeader}>
        <Text style={styles.icon}>🏥</Text>
        <Text style={styles.cardTitle}>{upa.nome}</Text>
      </View>
      <Text style={styles.cardAddress}>{upa.endereco}</Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>👥</Text>
          <Text style={styles.statText}>{upa.pessoas} na fila</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>⏱️</Text>
          <Text style={[styles.statText, { color: getTempoColor(upa.tempo) }]}>
            ~{upa.tempo} min
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
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
    flex: 1,
    color: '#1f2937',
  },
  cardAddress: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
  },
});