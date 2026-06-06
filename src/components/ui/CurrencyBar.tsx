import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { formatNumber } from '../../utils/format';
import { usePlayerStore } from '../../store/playerStore';

interface Props { onAddBucks?: () => void }

export const CurrencyBar: React.FC<Props> = ({ onAddBucks }) => {
  const coins = usePlayerStore(s => s.coins);
  const mumbaiBucks = usePlayerStore(s => s.mumbaiBucks);
  const festivalTokens = usePlayerStore(s => s.festivalTokens);

  return (
    <View style={styles.row}>
      <View style={styles.chip}>
        <Text style={styles.emoji}>🪙</Text>
        <Text style={styles.amount}>{formatNumber(coins)}</Text>
      </View>
      <View style={[styles.chip, styles.premiumChip]}>
        <Text style={styles.emoji}>💎</Text>
        <Text style={[styles.amount, { color: COLORS.teal }]}>{formatNumber(mumbaiBucks)}</Text>
        {onAddBucks && (
          <TouchableOpacity style={styles.addBtn} onPress={onAddBucks}>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        )}
      </View>
      {festivalTokens > 0 && (
        <View style={styles.chip}>
          <Text style={styles.emoji}>🪔</Text>
          <Text style={[styles.amount, { color: COLORS.gold }]}>{formatNumber(festivalTokens)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: SPACING.xs, alignItems: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: RADIUS.round, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 3 },
  premiumChip: { borderColor: `${COLORS.teal}44` },
  emoji: { fontSize: 13 },
  amount: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.xs },
  addBtn: { width: 16, height: 16, backgroundColor: COLORS.teal, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginLeft: 2 },
  plus: { color: COLORS.white, fontWeight: '900', fontSize: 11, lineHeight: 13 },
});
