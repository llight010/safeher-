import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getSafetyTips } from '../services/api';
import SafetyTipCard from '../components/SafetyTipCard';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SafetyTipsScreen = () => {
  const { theme, mode } = useTheme();
  const [tips, setTips] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTips();
  }, []);

  const loadTips = async () => {
    setRefreshing(true);
    try {
      const safetyTips = await getSafetyTips();
      setTips(safetyTips);
    } catch (error) {
      console.error('❌ Error loading safety tips:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => <SafetyTipCard tip={item} />;

  return (
    <LinearGradient
      colors={
        mode === 'dark'
          ? ['#1e1e2f', '#2c2c3e']
          : ['#fdfbfb', '#ebedee']
      }
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <LottieView
          source={require('../../assets/animations/shield.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={[styles.header, { color: theme.text }]}>🛡️ Safety Tips</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          Stay informed and protected
        </Text>
      </View>

      {tips.length === 0 && !refreshing ? (
        <LottieView
          source={require('../../assets/animations/loading.json')}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
      ) : (
        <FlatList
          data={tips}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadTips}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          }
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No safety tips found.
            </Text>
          }
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  lottie: {
    width: 100,
    height: 100,
    marginBottom: -10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 40,
  },
  loadingAnimation: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 80,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 50,
  },
});

export default SafetyTipsScreen;

