import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameStore } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { formatNumber } from '../../utils/format';
import { getPowerUpAsset, POWERUP_META } from '../../constants/powerUpAssets';

interface Props { onPause: () => void }

export const HUD: React.FC<Props> = ({ onPause }) => {
  const { top } = useSafeAreaInsets();
  const score = useGameStore(s => s.score);
  const coins = useGameStore(s => s.coinsCollected);
  const combo = useGameStore(s => s.combo);
  const activePowerUp = useGameStore(s => s.activePowerUp);
  const powerUpTimeLeft = useGameStore(s => s.powerUpTimeLeft);
  const highScore = usePlayerStore(s => s.highScore);
  const puMeta = activePowerUp ? POWERUP_META[activePowerUp] : null;
  const puImage = activePowerUp ? getPowerUpAsset(activePowerUp) : null;

  return (
    <View style={[styles.container, { paddingTop: top + SPACING.xs }]}>
      <View style={styles.row}>
        {/* Score */}
        <View style={styles.scoreBlock}>
          <Text style={styles.score}>{formatNumber(Math.floor(score))}</Text>
          <Text style={styles.scoreLabel}>SCORE</Text>
        </View>

        {/* Center: combo */}
        <View style={styles.center}>
          {combo > 2 && (
            <View style={styles.comboBadge}>
              <Text style={styles.comboText}>x{combo} COMBO!</Text>
            </View>
          )}
        </View>

        {/* Right */}
        <View style={styles.right}>
          <View style={styles.coinChip}>
            <Text style={styles.coinEmoji}>🪙</Text>
            <Text style={styles.coinText}>{coins}</Text>
          </View>
          <TouchableOpacity style={styles.pauseBtn} onPress={onPause}>
            <Text style={styles.pauseIcon}>⏸</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Power-up status bar */}
      {puMeta && (
        <View style={[styles.powerBar, { borderColor: puMeta.hudColor + '99' }]}>
          {/* Power-up icon: real image if available, else emoji */}
          {puImage ? (
            <Image source={puImage} style={styles.puIcon} resizeMode="contain" />
          ) : (
            <Text style={styles.puEmoji}>{puMeta.emoji}</Text>
          )}
          <Text style={[styles.puLabel, { color: puMeta.hudColor }]}>{puMeta.name.toUpperCase()}</Text>
          {activePowerUp !== 'ganesh_blessing' && (
            <View style={styles.puTrack}>
              <View style={[
                styles.puFill,
                { width: `${Math.min(1, powerUpTimeLeft / 12000) * 100}%`, backgroundColor: puMeta.hudColor },
              ]} />
            </View>
          )}
          {activePowerUp === 'ganesh_blessing' && (
            <Text style={[styles.puLabel, { color: puMeta.hudColor }]}>SHIELDED!</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: SPACING.md, zIndex: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scoreBlock: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 12, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, minWidth: 85 },
  score: { color: COLORS.white, fontSize: FONTS.sizes.xxl, fontWeight: '900' },
  scoreLabel: { color: COLORS.saffron, fontSize: FONTS.sizes.xs, fontWeight: '700', letterSpacing: 1.5 },
  center: { flex: 1, alignItems: 'center' },
  comboBadge: { backgroundColor: COLORS.saffron, borderRadius: 20, paddingHorizontal: SPACING.md, paddingVertical: 4, shadowColor: COLORS.saffron, shadowOpacity: 0.8, shadowRadius: 8, elevation: 8 },
  comboText: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.sm, letterSpacing: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  coinChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 20, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, gap: 4 },
  coinEmoji: { fontSize: 14 },
  coinText: { color: COLORS.gold, fontWeight: '800', fontSize: FONTS.sizes.md },
  pauseBtn: { width: 36, height: 36, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  pauseIcon: { fontSize: 16 },
  powerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, borderWidth: 1.5, paddingHorizontal: SPACING.md, paddingVertical: 5, marginTop: SPACING.xs, gap: SPACING.sm },
  puEmoji: { fontSize: 18 },
  puIcon: { width: 28, height: 28 },
  puLabel: { fontWeight: '800', fontSize: FONTS.sizes.xs, letterSpacing: 1 },
  puTrack: { flex: 1, height: 5, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 3, overflow: 'hidden' },
  puFill: { height: 5, borderRadius: 3 },
});
