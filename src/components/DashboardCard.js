import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, IconButton } from 'react-native-paper';

const DashboardCard = ({ title, value, icon, color, onPress, subtitle }) => {
  return (
    <Surface style={[styles.card, { borderLeftColor: color }]} elevation={2}>
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <View style={styles.content}>
          <View style={styles.mainInfo}>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <IconButton icon={icon} iconColor={color} size={24} />
          </View>
        </View>
      </TouchableOpacity>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainInfo: {
    flex: 1,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  iconContainer: {
    borderRadius: 8,
    marginLeft: 8,
  },
});

export default DashboardCard;
