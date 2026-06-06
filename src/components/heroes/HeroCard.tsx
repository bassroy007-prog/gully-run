import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Hero } from '../../constants/heroes';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  hero: Hero;
  isSelected?: boolean;
  isUnlocked?: boolean;
  onPress: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  common: COLORS.common, rare: COLORS.rare, epic: COLORS.epic, legendary: COLORS.legendary,
};

export const HeroCard: React.FC<Props> = ({ hero, isSelected, isUnlocked, onPress }) => {
  const rarityColor = RARITY_COLORS[hero.rarity];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.wrapper, isSelected && styles.selected]}>
      <LinearGradient
        colors={isUnlocked ? hero.bgGradient : ['#1A1A2A', '#0A0A1A']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.rarityStrip, { backgroundColor: rarityColor }]} />
        {isSelected && <View style={styles.activeBadge}><Text style={styles.activeText}>✓</Text></View>}
        {!isUnlocked && <View style={styles.lockOverlay}><Text style={styles.lockIcon}>🔒</Text></View>}
        <Text style={styles.emoji}>{hero.emoji}</Text>
        <Text style={styles.name} numberOfLines={1}>{hero.name}</Text>
        <Text style={[styles.rarity, { color: rarityColor }]}>{hero.rarity.toUpperCase()}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, maxWidth: '48%', borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.darkBorder, overflow: 'hidden' },
  selected: { borderColor: COLORS.gold, borderWidth: 2.5 },
  card: { padding: SPACING.md, alignItems: 'center', minHeight: 130, position: 'relative' },
  rarityStrip: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  activeBadge: { position: 'absolute', top: SPACING.sm, right: SPACING.sm, width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center' },
  activeText: { color: COLORS.black, fontSize: 11, fontWeight: '900' },
  lockOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', zIndex: 5, borderRadius: RADIUS.lg },
  lockIcon: { fontSize: 22 },
  emoji: { fontSize: 34, marginTop: SPACING.sm, marginBottom: SPACING.xs },
  name: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.sm, textAlign: 'center' },
  rarity: { fontSize: FONTS.sizes.xs, fontWeight: '700', letterSpacing: 1 },
});
