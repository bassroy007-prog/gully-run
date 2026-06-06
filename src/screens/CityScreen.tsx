import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BUILDINGS } from '../constants/buildings';
import { useCityStore } from '../store/cityStore';
import { usePlayerStore } from '../store/playerStore';
import { BuildingCard } from '../components/city/BuildingCard';
import { CurrencyBar } from '../components/ui/CurrencyBar';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { formatCoins, formatNumber } from '../utils/format';

export const CityScreen: React.FC = () => {
  const city = useCityStore();
  const player = usePlayerStore();

  const totalIncome = Object.keys(city.buildings).reduce((sum, id) => {
    const b = BUILDINGS.find(b2 => b2.id === id);
    if (!b) return sum;
    const owned = city.buildings[id];
    return sum + (b.baseIncome + b.incomePerLevel * (owned.level - 1));
  }, 0);

  const handleCollect = (buildingId: string) => {
    const income = city.collectIncome(buildingId);
    if (income > 0) player.addCoins(income);
  };

  const handleCollectAll = () => {
    const income = city.collectAllIncome();
    if (income > 0) player.addCoins(income);
  };

  return (
    <LinearGradient colors={['#0A0A1A', '#0A180A', '#0A0A1A']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Mumbai</Text>
            <Text style={styles.income}>⚡ {formatCoins(totalIncome)}/hr passive income</Text>
          </View>
          <CurrencyBar />
        </View>

        {/* City skyline emoji banner */}
        <View style={styles.skyline}>
          <Text style={styles.skylineText}>🏠 🍔 ☕ 🛺 🏏 🎬</Text>
          <Text style={styles.skylineLabel}>Your Gully Empire</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {city.getTotalPendingIncome() > 0 && (
            <View style={styles.collectAllRow}>
              <Text style={styles.pendingText}>
                🏙️ {formatCoins(city.getTotalPendingIncome())} pending
              </Text>
              <View>
                <Text
                  onPress={handleCollectAll}
                  style={styles.collectAllBtn}
                >
                  Collect All
                </Text>
              </View>
            </View>
          )}

          {BUILDINGS.map(b => (
            <BuildingCard
              key={b.id}
              building={b}
              owned={city.buildings[b.id]}
              pendingIncome={city.getPendingIncome(b.id)}
              playerCoins={player.coins}
              playerLevel={player.level}
              onBuy={() => city.purchaseBuilding(b.id, player.spendCoins)}
              onUpgrade={() => city.upgradeBuilding(b.id, player.spendCoins)}
              onCollect={() => handleCollect(b.id)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: SPACING.lg },
  title: { color: COLORS.white, fontSize: FONTS.sizes.xxl, fontWeight: '900' },
  income: { color: COLORS.gold, fontSize: FONTS.sizes.sm, marginTop: 2 },
  skyline: { alignItems: 'center', paddingVertical: SPACING.md, backgroundColor: 'rgba(0,0,0,0.3)' },
  skylineText: { fontSize: 28, letterSpacing: 4 },
  skylineLabel: { color: 'rgba(255,255,255,0.4)', fontSize: FONTS.sizes.xs, marginTop: 4 },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  collectAllRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(76,175,80,0.15)',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  pendingText: { color: COLORS.success, fontWeight: '700', fontSize: FONTS.sizes.md },
  collectAllBtn: {
    color: COLORS.white,
    fontWeight: '900',
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    overflow: 'hidden',
    fontSize: FONTS.sizes.sm,
  },
});
