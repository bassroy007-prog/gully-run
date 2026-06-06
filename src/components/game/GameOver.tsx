import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { formatNumber } from '../../utils/format';
import { Button } from '../ui/Button';

interface Props {
  onRestart: () => void;
  onHome: () => void;
  onRevive?: () => void;
}

export const GameOver: React.FC<Props> = ({ onRestart, onHome, onRevive }) => {
  const score = useGameStore(s => s.score);
  const coins = useGameStore(s => s.coinsCollected);
  const distance = useGameStore(s => s.distance);
  const highScore = usePlayerStore(s => s.highScore);
  const isNewRecord = score > highScore;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={['#1A0A00', '#2A1000']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {isNewRecord && (
            <View style={styles.recordBadge}>
              <Text style={styles.recordText}>🏆 NEW RECORD!</Text>
            </View>
          )}

          <Text style={styles.title}>GAME OVER</Text>
          <Text style={styles.subtitle}>Ek baar aur try karo! 💪</Text>

          <View style={styles.stats}>
            <StatRow emoji="⭐" label="SCORE" value={formatNumber(Math.floor(score))} highlight />
            <StatRow emoji="🪙" label="COINS" value={formatNumber(coins)} />
            <StatRow emoji="📏" label="DISTANCE" value={`${Math.floor(distance)}m`} />
            <View style={styles.divider} />
            <StatRow emoji="🏆" label="BEST" value={formatNumber(Math.floor(Math.max(highScore, score)))} />
          </View>

          <View style={styles.actions}>
            {onRevive && (
              <Button
                label="REVIVE  10"
                emoji="💎"
                onPress={onRevive}
                variant="gold"
                size="lg"
                style={styles.reviveBtn}
              />
            )}
            <Button label="RUN AGAIN" onPress={onRestart} variant="primary" size="lg" style={styles.btn} emoji="🏃" />
            <Button label="Home" onPress={onHome} variant="ghost" size="md" style={styles.homeBtn} />
          </View>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
};

const StatRow = ({ emoji, label, value, highlight }: { emoji: string; label: string; value: string; highlight?: boolean }) => (
  <View style={statStyles.row}>
    <Text style={statStyles.emoji}>{emoji}</Text>
    <Text style={statStyles.label}>{label}</Text>
    <Text style={[statStyles.value, highlight && statStyles.highlight]}>{value}</Text>
  </View>
);

const statStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  emoji: { fontSize: 18, width: 30 },
  label: { flex: 1, color: 'rgba(255,255,255,0.6)', fontSize: FONTS.sizes.sm, fontWeight: '600', letterSpacing: 1 },
  value: { color: COLORS.white, fontSize: FONTS.sizes.lg, fontWeight: '800' },
  highlight: { color: COLORS.gold, fontSize: FONTS.sizes.xl },
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  card: {
    width: 320,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.saffron,
  },
  gradient: { padding: SPACING.xl },
  recordBadge: {
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  recordText: { color: COLORS.black, fontWeight: '900', fontSize: FONTS.sizes.sm },
  title: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xxxl,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 3,
  },
  subtitle: {
    color: COLORS.saffron,
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    marginTop: 4,
  },
  stats: { marginBottom: SPACING.xl },
  divider: { height: 1, backgroundColor: COLORS.darkBorder, marginVertical: SPACING.sm },
  actions: { gap: SPACING.md },
  reviveBtn: { width: '100%' },
  btn: { width: '100%' },
  homeBtn: { width: '100%' },
});
