import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../../store/gameStore';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { Button } from '../ui/Button';
import { formatNumber } from '../../utils/format';

interface Props {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const PauseMenu: React.FC<Props> = ({ onResume, onRestart, onHome }) => {
  const score = useGameStore(s => s.score);
  const coins = useGameStore(s => s.coinsCollected);

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.emoji}>⏸</Text>
        <Text style={styles.title}>PAUSED</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatNumber(Math.floor(score))}</Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{coins}</Text>
            <Text style={styles.statLabel}>Coins</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button label="RESUME" onPress={onResume} variant="primary" size="lg" emoji="▶️" style={styles.btn} />
          <Button label="RESTART" onPress={onRestart} variant="secondary" size="md" emoji="🔄" style={styles.btn} />
          <Button label="QUIT TO HOME" onPress={onHome} variant="ghost" size="md" style={styles.btn} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  card: {
    backgroundColor: COLORS.darkCard,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.teal,
    padding: SPACING.xxl,
    width: 300,
    alignItems: 'center',
  },
  emoji: { fontSize: 40, marginBottom: SPACING.sm },
  title: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xxl,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: SPACING.xl,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    gap: SPACING.xl,
  },
  stat: { alignItems: 'center' },
  statValue: { color: COLORS.white, fontSize: FONTS.sizes.xxl, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: FONTS.sizes.xs, letterSpacing: 1 },
  divider: { width: 1, height: 40, backgroundColor: COLORS.darkBorder },
  actions: { width: '100%', gap: SPACING.md },
  btn: { width: '100%' },
});
