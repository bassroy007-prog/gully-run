import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Building, getBuildingUpgradeCost, getBuildingIncome } from '../../constants/buildings';
import { OwnedBuilding } from '../../store/cityStore';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { ProgressBar } from '../ui/ProgressBar';
import { formatNumber, formatCoins } from '../../utils/format';

interface Props {
  building: Building;
  owned?: OwnedBuilding;
  pendingIncome: number;
  onBuy: () => void;
  onUpgrade: () => void;
  onCollect: () => void;
  playerCoins: number;
  playerLevel: number;
}

export const BuildingCard: React.FC<Props> = ({
  building, owned, pendingIncome, onBuy, onUpgrade, onCollect, playerCoins, playerLevel,
}) => {
  const isOwned = !!owned;
  const isLocked = playerLevel < building.unlockLevel;
  const level = owned?.level ?? 0;
  const upgradeCost = isOwned ? getBuildingUpgradeCost(building, level) : building.baseCost;
  const income = isOwned ? getBuildingIncome(building, level) : building.baseIncome;
  const canAfford = playerCoins >= upgradeCost;
  const isMaxLevel = level >= building.maxLevel;

  return (
    <View style={[styles.card, isLocked && styles.locked]}>
      <LinearGradient
        colors={[`${building.bgColor}33`, 'transparent']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>{building.emoji}</Text>
          <View style={styles.info}>
            <Text style={styles.name}>{building.name}</Text>
            <Text style={styles.description} numberOfLines={1}>{building.description}</Text>
          </View>
          {isOwned && (
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>L{level}</Text>
            </View>
          )}
        </View>

        {isOwned && (
          <>
            <ProgressBar value={level} max={building.maxLevel} color={building.bgColor} height={5} />
            <View style={styles.statsRow}>
              <Text style={styles.incomeText}>⚡ {formatCoins(income)}/hr</Text>
              {pendingIncome > 0 && (
                <TouchableOpacity style={styles.collectBtn} onPress={onCollect}>
                  <Text style={styles.collectText}>Collect +{formatNumber(pendingIncome)}</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}

        {isLocked ? (
          <View style={styles.lockRow}>
            <Text style={styles.lockText}>🔒 Unlock at Level {building.unlockLevel}</Text>
          </View>
        ) : isOwned ? (
          isMaxLevel ? (
            <View style={styles.maxBadge}><Text style={styles.maxText}>MAX LEVEL</Text></View>
          ) : (
            <TouchableOpacity
              style={[styles.actionBtn, !canAfford && styles.disabled]}
              onPress={onUpgrade}
              disabled={!canAfford}
            >
              <Text style={styles.actionText}>
                ⬆ Upgrade {formatCoins(upgradeCost)}
              </Text>
            </TouchableOpacity>
          )
        ) : (
          <TouchableOpacity
            style={[styles.actionBtn, styles.buyBtn, !canAfford && styles.disabled]}
            onPress={onBuy}
            disabled={!canAfford}
          >
            <Text style={styles.actionText}>
              {building.baseCost === 0 ? '🏠 Your Chawl' : `Buy ${formatCoins(upgradeCost)}`}
            </Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.darkCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  locked: { opacity: 0.5 },
  gradient: { padding: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.sm },
  emoji: { fontSize: 32 },
  info: { flex: 1 },
  name: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.md },
  description: { color: 'rgba(255,255,255,0.5)', fontSize: FONTS.sizes.xs },
  levelBadge: {
    backgroundColor: COLORS.saffron,
    borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  levelText: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.xs },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: SPACING.sm },
  incomeText: { color: COLORS.gold, fontWeight: '700', fontSize: FONTS.sizes.sm },
  collectBtn: {
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  collectText: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.xs },
  lockRow: { alignItems: 'center', paddingVertical: SPACING.sm },
  lockText: { color: 'rgba(255,255,255,0.4)', fontSize: FONTS.sizes.sm },
  actionBtn: {
    backgroundColor: COLORS.saffron,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  buyBtn: { backgroundColor: COLORS.teal },
  disabled: { opacity: 0.4 },
  actionText: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.sm },
  maxBadge: { alignItems: 'center', paddingVertical: SPACING.sm },
  maxText: { color: COLORS.gold, fontWeight: '900', letterSpacing: 2, fontSize: FONTS.sizes.sm },
});
