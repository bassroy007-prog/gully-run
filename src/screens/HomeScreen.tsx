import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { usePlayerStore } from '../store/playerStore';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { ProgressBar } from '../components/ui/ProgressBar';
import { formatNumber, formatCoins } from '../utils/format';
import { getHeroById } from '../constants/heroes';
import { ZONES } from '../constants/gameConfig';
import { STORY_CHAPTERS } from '../constants/story';

const RARITY_COLORS: Record<string, string> = {
  common: COLORS.common,
  rare: COLORS.rare,
  epic: COLORS.epic,
  legendary: COLORS.legendary,
};

export const HomeScreen: React.FC = () => {
  const nav = useNavigation<any>();
  const player = usePlayerStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  const hero = getHeroById(player.selectedHeroId);
  const currentChapter = STORY_CHAPTERS.find(c => c.id === player.storyChapter);
  const currentZone = ZONES.find(z => z.id === 'gully')!;
  const pendingDailyReward = player.dailyReward.lastClaimedDay !== Math.floor(Date.now() / 86400000);

  useEffect(() => {
    player.loadState();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient colors={['#050510', '#0A0820', '#050510']} style={styles.bg}>
      <SafeAreaView style={styles.safe}>
        {/* TOP BAR — Mumbai Passport */}
        <View style={styles.topBar}>
          <View style={styles.passport}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{hero?.emoji ?? '🏃'}</Text>
            </View>
            <View>
              <Text style={styles.playerName}>{player.name}</Text>
              <View style={styles.levelRow}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>LVL {player.level}</Text>
                </View>
                <ProgressBar value={player.xp} max={player.xpToNextLevel} color={COLORS.saffron} height={5} />
              </View>
            </View>
          </View>
          {/* Currency chips */}
          <View style={styles.currencies}>
            <TouchableOpacity style={styles.currencyChip} onPress={() => nav.navigate('Shop')}>
              <Text style={styles.currEmoji}>🪙</Text>
              <Text style={styles.currVal}>{formatNumber(player.coins)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.currencyChip, styles.currencyChipPremium]} onPress={() => nav.navigate('Shop')}>
              <Text style={styles.currEmoji}>💎</Text>
              <Text style={[styles.currVal, { color: COLORS.teal }]}>{formatNumber(player.mumbaiBucks)}</Text>
              <Text style={styles.plusBtn}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Daily reward notification */}
          {pendingDailyReward && (
            <TouchableOpacity style={styles.dailyBanner} onPress={() => nav.navigate('Events')}>
              <LinearGradient colors={['#1B5E20', '#2E7D32']} style={styles.dailyGrad}>
                <Text style={styles.dailyEmoji}>🎁</Text>
                <Text style={styles.dailyText}>Daily Reward Ready! Day {(player.dailyReward.streak % 7) + 1}</Text>
                <Text style={styles.dailyArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* === MAIN RUN BUTTON === */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }, { translateY: floatAnim }] }}>
            <TouchableOpacity onPress={() => nav.navigate('Game')} activeOpacity={0.9} style={styles.runBtnWrap}>
              <LinearGradient
                colors={['#FF6B35', '#FF1744']}
                style={styles.runBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Glow ring */}
                <View style={styles.runGlow} />
                <Text style={styles.runHeroEmoji}>{hero?.emoji ?? '🏃'}</Text>
                <Text style={styles.runBtnText}>TAP TO RUN!</Text>
                <Text style={styles.runBtnZone}>📍 {ZONES[0].name}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <GlassStatChip emoji="🏆" label="Best" value={formatNumber(player.highScore)} />
            <GlassStatChip emoji="🏃" label="Runs" value={formatNumber(player.totalRuns)} />
            <GlassStatChip emoji="📏" label="Distance" value={`${formatNumber(Math.floor(player.totalDistance / 1000))}km`} />
          </View>

          {/* Active Hero card */}
          {hero && (
            <View style={styles.glassCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>Active Hero</Text>
                <TouchableOpacity onPress={() => nav.navigate('Heroes')}>
                  <Text style={styles.cardLink}>Change →</Text>
                </TouchableOpacity>
              </View>
              <LinearGradient colors={hero.bgGradient} style={styles.heroPreviewGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.heroPreviewEmoji}>{hero.emoji}</Text>
                <View style={styles.heroPreviewInfo}>
                  <Text style={styles.heroPreviewName}>{hero.name}</Text>
                  <Text style={[styles.heroRarity, { color: RARITY_COLORS[hero.rarity] }]}>
                    {hero.rarity.toUpperCase()}
                  </Text>
                  <Text style={styles.heroPassive}>{hero.passiveSkill}</Text>
                </View>
                <View style={styles.heroStatsCol}>
                  <StatStar label="SPD" value={hero.stats.speed} />
                  <StatStar label="JMP" value={hero.stats.jump} />
                  <StatStar label="COIN" value={hero.stats.coins} />
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Story Chapter */}
          {currentChapter && (
            <TouchableOpacity style={styles.glassCard} onPress={() => nav.navigate('Story')}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>📖 Story Mode</Text>
                <Text style={styles.cardLink}>View All →</Text>
              </View>
              <LinearGradient colors={currentChapter.bgGradient} style={styles.chapterPreview} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.chEmoji}>{currentChapter.emoji}</Text>
                <View style={styles.chInfo}>
                  <Text style={styles.chSubtitle}>Chapter {currentChapter.id}</Text>
                  <Text style={styles.chTitle}>{currentChapter.title}</Text>
                  <Text style={styles.chSubtitle}>{currentChapter.subtitle}</Text>
                </View>
                <View style={styles.playChBtn}>
                  <Text style={styles.playChText}>▶</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Quick access grid */}
          <View style={styles.quickGrid}>
            <QuickBtn emoji="⚡" label="Missions" color="#1565C0" onPress={() => nav.navigate('Missions')} />
            <QuickBtn emoji="🎉" label="Events" color="#880E4F" onPress={() => nav.navigate('Events')} />
            <QuickBtn emoji="🏅" label="Leaderboard" color="#1B5E20" onPress={() => nav.navigate('Leaderboard')} />
            <QuickBtn emoji="🛒" label="Shop" color="#4A148C" onPress={() => nav.navigate('Shop')} />
          </View>

          {/* Live event banner */}
          <TouchableOpacity onPress={() => nav.navigate('Events')}>
            <LinearGradient colors={['#FF6B35', '#FF1744']} style={styles.eventBanner}>
              <Text style={styles.eventBannerEmoji}>🪔</Text>
              <View>
                <View style={styles.liveRow}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
                <Text style={styles.eventBannerTitle}>Diwali Dhamaka!</Text>
                <Text style={styles.eventBannerSub}>2x coins for all runs • 6 days left</Text>
              </View>
              <Text style={styles.eventBannerArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const GlassStatChip = ({ emoji, label, value }: { emoji: string; label: string; value: string }) => (
  <View style={glassStatStyles.chip}>
    <Text style={glassStatStyles.emoji}>{emoji}</Text>
    <Text style={glassStatStyles.value}>{value}</Text>
    <Text style={glassStatStyles.label}>{label}</Text>
  </View>
);

const StatStar = ({ label, value }: { label: string; value: number }) => (
  <View style={starStyles.row}>
    <Text style={starStyles.label}>{label}</Text>
    <Text style={starStyles.stars}>{'★'.repeat(value)}{'☆'.repeat(5 - value)}</Text>
  </View>
);

const QuickBtn = ({ emoji, label, color, onPress }: { emoji: string; label: string; color: string; onPress: () => void }) => (
  <TouchableOpacity style={[quickStyles.btn, { borderColor: `${color}66` }]} onPress={onPress}>
    <LinearGradient colors={[`${color}44`, `${color}22`]} style={quickStyles.grad}>
      <Text style={quickStyles.emoji}>{emoji}</Text>
      <Text style={quickStyles.label}>{label}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const glassStatStyles = StyleSheet.create({
  chip: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  emoji: { fontSize: 20, marginBottom: 2 },
  value: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.lg },
  label: { color: 'rgba(255,255,255,0.4)', fontSize: FONTS.sizes.xs },
});

const starStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.sm },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: '700', width: 32 },
  stars: { color: COLORS.gold, fontSize: 10 },
});

const quickStyles = StyleSheet.create({
  btn: { flex: 1, borderRadius: RADIUS.md, overflow: 'hidden', borderWidth: 1 },
  grad: { alignItems: 'center', paddingVertical: SPACING.md, gap: 4 },
  emoji: { fontSize: 24 },
  label: { color: COLORS.white, fontSize: FONTS.sizes.xs, fontWeight: '700' },
});

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  passport: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.saffron, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.gold },
  avatarText: { fontSize: 22 },
  playerName: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.md },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: 2, width: 130 },
  levelBadge: { backgroundColor: COLORS.saffron, borderRadius: RADIUS.round, paddingHorizontal: 6, paddingVertical: 1 },
  levelText: { color: COLORS.white, fontSize: 9, fontWeight: '900' },
  currencies: { flexDirection: 'row', gap: SPACING.xs },
  currencyChip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: RADIUS.round, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  currencyChipPremium: { borderColor: `${COLORS.teal}44` },
  currEmoji: { fontSize: 12 },
  currVal: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.xs },
  plusBtn: { color: COLORS.teal, fontWeight: '900', fontSize: 12 },
  scroll: { paddingHorizontal: SPACING.lg, paddingBottom: 100, gap: SPACING.md },
  dailyBanner: { borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1.5, borderColor: COLORS.success },
  dailyGrad: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md },
  dailyEmoji: { fontSize: 26 },
  dailyText: { flex: 1, color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.sm },
  dailyArrow: { color: COLORS.white, fontSize: 20, fontWeight: '900' },
  runBtnWrap: { borderRadius: RADIUS.xl, overflow: 'hidden', shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 20, elevation: 20 },
  runBtn: { borderRadius: RADIUS.xl, padding: SPACING.xxl, alignItems: 'center', justifyContent: 'center', minHeight: 180, position: 'relative' },
  runGlow: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.1)', top: '50%', left: '50%', marginTop: -60, marginLeft: -60 },
  runHeroEmoji: { fontSize: 56, marginBottom: SPACING.sm },
  runBtnText: { color: COLORS.white, fontSize: 34, fontWeight: '900', letterSpacing: 4 },
  runBtnZone: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.sm, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: SPACING.sm },
  glassCard: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: RADIUS.xl, padding: SPACING.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  cardTitle: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.lg },
  cardLink: { color: COLORS.saffron, fontSize: FONTS.sizes.sm },
  heroPreviewGrad: { borderRadius: RADIUS.lg, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  heroPreviewEmoji: { fontSize: 40 },
  heroPreviewInfo: { flex: 1, gap: 3 },
  heroPreviewName: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.md },
  heroRarity: { fontSize: FONTS.sizes.xs, fontWeight: '700', letterSpacing: 1 },
  heroPassive: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.xs },
  heroStatsCol: { gap: 4 },
  chapterPreview: { borderRadius: RADIUS.lg, flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md },
  chEmoji: { fontSize: 30 },
  chInfo: { flex: 1 },
  chSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: FONTS.sizes.xs },
  chTitle: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.md },
  playChBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  playChText: { color: COLORS.white, fontSize: FONTS.sizes.lg, fontWeight: '900' },
  quickGrid: { flexDirection: 'row', gap: SPACING.sm },
  eventBanner: { borderRadius: RADIUS.xl, flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, gap: SPACING.md },
  eventBannerEmoji: { fontSize: 36 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.white },
  liveText: { color: COLORS.white, fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  eventBannerTitle: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.lg },
  eventBannerSub: { color: 'rgba(255,255,255,0.75)', fontSize: FONTS.sizes.xs },
  eventBannerArrow: { marginLeft: 'auto', color: COLORS.white, fontSize: FONTS.sizes.xxl, fontWeight: '900' },
});
