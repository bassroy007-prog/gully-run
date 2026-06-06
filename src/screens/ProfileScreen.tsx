import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayerStore } from '../store/playerStore';
import { useHeroStore } from '../store/heroStore';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { ProgressBar } from '../components/ui/ProgressBar';
import { formatNumber, formatCoins } from '../utils/format';

const ACHIEVEMENTS = [
  { id: 'first_run', emoji: '🏃', title: 'First Step', desc: 'Complete your first run', condition: (p: any) => p.totalRuns >= 1 },
  { id: 'runs_10', emoji: '🔟', title: 'Regular Runner', desc: '10 runs completed', condition: (p: any) => p.totalRuns >= 10 },
  { id: 'score_1000', emoji: '⭐', title: 'Rising Star', desc: 'Score 1000 in a single run', condition: (p: any) => p.highScore >= 1000 },
  { id: 'score_10000', emoji: '🌟', title: 'Mumbai Sensation', desc: 'Score 10,000 in a single run', condition: (p: any) => p.highScore >= 10000 },
  { id: 'coins_5000', emoji: '🪙', title: 'Coin Collector', desc: 'Earn 5,000 total coins', condition: (p: any) => p.totalCoinsEarned >= 5000 },
  { id: 'level_10', emoji: '📈', title: 'Gully Legend', desc: 'Reach Level 10', condition: (p: any) => p.level >= 10 },
  { id: 'distance_1k', emoji: '📏', title: '1KM Club', desc: 'Run a total of 1km', condition: (p: any) => p.totalDistance >= 1000 },
  { id: 'distance_10k', emoji: '🛣️', title: 'Marathon Runner', desc: 'Run a total of 10km', condition: (p: any) => p.totalDistance >= 10000 },
];

export const ProfileScreen: React.FC = () => {
  const player = usePlayerStore();
  const heroStore = useHeroStore();

  const unlockedHeroes = player.unlockedHeroIds.length;
  const earned = ACHIEVEMENTS.filter(a => a.condition(player));

  return (
    <LinearGradient colors={['#0A0A1A', '#120820', '#0A0A1A']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Profile header */}
          <LinearGradient colors={[COLORS.saffron + '44', 'transparent']} style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>🏃</Text>
            </View>
            <Text style={styles.name}>{player.name}</Text>
            <Text style={styles.levelBadge}>Level {player.level} Runner</Text>
            <View style={styles.xpRow}>
              <Text style={styles.xpText}>{player.xp} / {player.xpToNextLevel} XP</Text>
              <ProgressBar value={player.xp} max={player.xpToNextLevel} color={COLORS.saffron} height={8} />
            </View>
          </LinearGradient>

          {/* Stats */}
          <View style={styles.statsGrid}>
            <StatBox emoji="🏆" label="High Score" value={formatNumber(player.highScore)} />
            <StatBox emoji="🏃" label="Total Runs" value={formatNumber(player.totalRuns)} />
            <StatBox emoji="🪙" label="Coins Earned" value={formatNumber(player.totalCoinsEarned)} />
            <StatBox emoji="📏" label="Distance" value={`${formatNumber(Math.floor(player.totalDistance / 1000))}km`} />
            <StatBox emoji="🦸" label="Heroes" value={`${unlockedHeroes}/10`} />
            <StatBox emoji="💎" label="M.Bucks" value={formatNumber(player.mumbaiBucks)} />
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements  {earned.length}/{ACHIEVEMENTS.length}</Text>
            <ProgressBar value={earned.length} max={ACHIEVEMENTS.length} color={COLORS.gold} height={6} />
            <View style={styles.achievementGrid}>
              {ACHIEVEMENTS.map(a => {
                const done = a.condition(player);
                return (
                  <View key={a.id} style={[styles.achievement, !done && styles.achievementLocked]}>
                    <Text style={styles.achEmoji}>{a.emoji}</Text>
                    <Text style={styles.achTitle} numberOfLines={1}>{a.title}</Text>
                    <Text style={styles.achDesc} numberOfLines={2}>{a.desc}</Text>
                    {done && <View style={styles.checkmark}><Text style={styles.checkText}>✓</Text></View>}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <TouchableOpacity style={styles.settingRow} onPress={() => Alert.alert('Sound', 'Sound settings coming soon')}>
              <Text style={styles.settingText}>🔊 Sound Effects</Text>
              <Text style={styles.settingValue}>ON</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingRow} onPress={() => Alert.alert('Music', 'Music settings coming soon')}>
              <Text style={styles.settingText}>🎵 Background Music</Text>
              <Text style={styles.settingValue}>ON</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingRow} onPress={() => Alert.alert('Haptics', 'Haptic settings coming soon')}>
              <Text style={styles.settingText}>📳 Haptic Feedback</Text>
              <Text style={styles.settingValue}>ON</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingRow} onPress={() => {
              Alert.alert('Reset Data', 'Are you sure you want to reset all game data?', [
                { text: 'Cancel' },
                { text: 'Reset', style: 'destructive', onPress: async () => {
                  await player.loadState();
                }},
              ]);
            }}>
              <Text style={[styles.settingText, { color: COLORS.danger }]}>🗑️ Reset Game Data</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const StatBox = ({ emoji, label, value }: { emoji: string; label: string; value: string }) => (
  <View style={statStyles.box}>
    <Text style={statStyles.emoji}>{emoji}</Text>
    <Text style={statStyles.value}>{value}</Text>
    <Text style={statStyles.label}>{label}</Text>
  </View>
);

const statStyles = StyleSheet.create({
  box: { width: '30%', backgroundColor: COLORS.darkCard, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.darkBorder, marginBottom: SPACING.sm },
  emoji: { fontSize: 22, marginBottom: 2 },
  value: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.lg },
  label: { color: 'rgba(255,255,255,0.4)', fontSize: FONTS.sizes.xs, textAlign: 'center' },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingBottom: 100 },
  profileHeader: { alignItems: 'center', padding: SPACING.xl, gap: SPACING.sm },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.saffron, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: COLORS.gold },
  avatarEmoji: { fontSize: 40 },
  name: { color: COLORS.white, fontSize: FONTS.sizes.xxl, fontWeight: '900' },
  levelBadge: { color: COLORS.saffron, fontSize: FONTS.sizes.sm, fontWeight: '700' },
  xpRow: { width: '80%', gap: 4 },
  xpText: { color: 'rgba(255,255,255,0.5)', fontSize: FONTS.sizes.xs, textAlign: 'right' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: SPACING.lg, gap: SPACING.sm, marginBottom: SPACING.md },
  section: { backgroundColor: COLORS.darkCard, marginHorizontal: SPACING.lg, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.darkBorder },
  sectionTitle: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.lg, marginBottom: SPACING.md },
  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.md },
  achievement: { width: '46%', backgroundColor: COLORS.darkBg, borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.darkBorder, position: 'relative' },
  achievementLocked: { opacity: 0.4 },
  achEmoji: { fontSize: 24, marginBottom: 4 },
  achTitle: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.sm },
  achDesc: { color: 'rgba(255,255,255,0.4)', fontSize: FONTS.sizes.xs, marginTop: 2 },
  checkmark: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.success, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: COLORS.white, fontSize: 10, fontWeight: '900' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  settingText: { color: COLORS.white, fontSize: FONTS.sizes.md },
  settingValue: { color: COLORS.teal, fontWeight: '700', fontSize: FONTS.sizes.sm },
});
