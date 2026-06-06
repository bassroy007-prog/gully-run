import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayerStore } from '../store/playerStore';
import { DAILY_MISSIONS, WEEKLY_MISSIONS, HERO_MISSIONS } from '../constants/missions';
import { ProgressBar } from '../components/ui/ProgressBar';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { formatNumber } from '../utils/format';

type Tab = 'daily' | 'weekly' | 'hero';

export const MissionsScreen: React.FC = () => {
  const [tab, setTab] = useState<Tab>('daily');
  const player = usePlayerStore();

  const missions = tab === 'daily' ? DAILY_MISSIONS : tab === 'weekly' ? WEEKLY_MISSIONS : HERO_MISSIONS;

  const handleClaim = (missionId: string, rewardCoins: number, rewardBucks: number, rewardXP: number) => {
    player.completeMission(missionId);
    player.addCoins(rewardCoins);
    if (rewardBucks > 0) player.addMumbaiBucks(rewardBucks);
    player.addXP(rewardXP);
    Alert.alert('Mission Complete! 🎉', `Claimed:\n🪙 ${rewardCoins} Coins${rewardBucks > 0 ? `\n💎 ${rewardBucks} Mumbai Bucks` : ''}\n⭐ ${rewardXP} XP`);
  };

  const getProgress = (missionId: string) => player.missionProgress[missionId] ?? 0;
  const isCompleted = (missionId: string) => player.completedMissions.includes(missionId);

  return (
    <LinearGradient colors={['#0A0A1A', '#1A0820', '#0A0A1A']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Missions</Text>
          <Text style={styles.subtitle}>Complete to earn big rewards</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['daily', 'weekly', 'hero'] as Tab[]).map(t => (
            <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'daily' ? '📅 Daily' : t === 'weekly' ? '📆 Weekly' : '🦸 Hero'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reset timer */}
        <View style={styles.resetBanner}>
          <Text style={styles.resetText}>
            {tab === 'daily' ? '⏰ Resets in 18h 42m' : tab === 'weekly' ? '📅 Resets in 3 days' : '🎯 Complete for one-time rewards'}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {missions.map(m => {
            const progress = getProgress(m.id);
            const done = isCompleted(m.id);
            const canClaim = progress >= m.target && !done;

            return (
              <View key={m.id} style={[styles.card, done && styles.cardDone]}>
                <LinearGradient
                  colors={done ? ['#1B3A1B', '#1B3A1B'] : ['#12122A', '#1A1A3A']}
                  style={styles.cardGrad}
                >
                  <View style={styles.cardTop}>
                    <Text style={styles.cardEmoji}>{m.emoji}</Text>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>{m.title}</Text>
                      <Text style={styles.cardDesc}>{m.description}</Text>
                      {m.heroId && (
                        <Text style={styles.heroTag}>Hero Mission</Text>
                      )}
                    </View>
                    {done ? (
                      <View style={styles.doneBadge}><Text style={styles.doneText}>✓ Done</Text></View>
                    ) : canClaim ? (
                      <TouchableOpacity
                        style={styles.claimBtn}
                        onPress={() => handleClaim(m.id, m.rewardCoins, m.rewardMumbaiBucks, m.rewardXP)}
                      >
                        <Text style={styles.claimText}>CLAIM!</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>

                  {!done && (
                    <View style={styles.progressSection}>
                      <ProgressBar
                        value={progress}
                        max={m.target}
                        color={canClaim ? COLORS.success : COLORS.saffron}
                        height={6}
                      />
                      <Text style={styles.progressText}>
                        {formatNumber(progress)} / {formatNumber(m.target)}
                      </Text>
                    </View>
                  )}

                  <View style={styles.rewards}>
                    <Text style={styles.rewardLabel}>Rewards:</Text>
                    <View style={styles.rewardChips}>
                      <Text style={styles.rewardChip}>🪙 {formatNumber(m.rewardCoins)}</Text>
                      {m.rewardMumbaiBucks > 0 && (
                        <Text style={styles.rewardChip}>💎 {m.rewardMumbaiBucks}</Text>
                      )}
                      <Text style={styles.rewardChip}>⭐ {m.rewardXP} XP</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: { padding: SPACING.lg },
  title: { color: COLORS.white, fontSize: FONTS.sizes.xxl, fontWeight: '900' },
  subtitle: { color: COLORS.saffron, fontSize: FONTS.sizes.sm },
  tabs: { flexDirection: 'row', marginHorizontal: SPACING.lg, backgroundColor: COLORS.darkCard, borderRadius: RADIUS.round, padding: 4, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.darkBorder },
  tab: { flex: 1, paddingVertical: SPACING.sm, borderRadius: RADIUS.round, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.saffron },
  tabText: { color: 'rgba(255,255,255,0.5)', fontSize: FONTS.sizes.sm, fontWeight: '700' },
  tabTextActive: { color: COLORS.white },
  resetBanner: { backgroundColor: 'rgba(255,107,53,0.1)', borderRadius: RADIUS.md, marginHorizontal: SPACING.lg, padding: SPACING.sm, marginBottom: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: `${COLORS.saffron}44` },
  resetText: { color: COLORS.saffron, fontSize: FONTS.sizes.xs, fontWeight: '600' },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  card: { borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.darkBorder },
  cardDone: { borderColor: COLORS.success, opacity: 0.7 },
  cardGrad: { padding: SPACING.md },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, marginBottom: SPACING.md },
  cardEmoji: { fontSize: 28 },
  cardInfo: { flex: 1, gap: 3 },
  cardTitle: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.md },
  cardDesc: { color: 'rgba(255,255,255,0.6)', fontSize: FONTS.sizes.xs },
  heroTag: { color: COLORS.epic, fontSize: FONTS.sizes.xs, fontWeight: '700', marginTop: 2 },
  doneBadge: { backgroundColor: `${COLORS.success}33`, borderRadius: RADIUS.round, paddingHorizontal: SPACING.sm, paddingVertical: 3, borderWidth: 1, borderColor: COLORS.success },
  doneText: { color: COLORS.success, fontSize: FONTS.sizes.xs, fontWeight: '800' },
  claimBtn: { backgroundColor: COLORS.saffron, borderRadius: RADIUS.round, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
  claimText: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.sm },
  progressSection: { marginBottom: SPACING.sm, gap: 4 },
  progressText: { color: 'rgba(255,255,255,0.4)', fontSize: FONTS.sizes.xs, textAlign: 'right' },
  rewards: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: 4 },
  rewardLabel: { color: 'rgba(255,255,255,0.4)', fontSize: FONTS.sizes.xs },
  rewardChips: { flexDirection: 'row', gap: SPACING.sm },
  rewardChip: { color: COLORS.gold, fontSize: FONTS.sizes.xs, fontWeight: '700', backgroundColor: 'rgba(255,215,0,0.1)', borderRadius: RADIUS.round, paddingHorizontal: 8, paddingVertical: 2 },
});
