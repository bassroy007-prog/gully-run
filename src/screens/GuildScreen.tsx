import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useGuildStore } from '../store/guildStore';
import { usePlayerStore } from '../store/playerStore';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { formatNumber } from '../utils/format';

export const GuildScreen: React.FC = () => {
  const { guild, myWeeklyScore, guildPoints } = useGuildStore();
  const player = usePlayerStore();

  if (!guild) {
    return (
      <LinearGradient colors={['#0A0A1A', '#0A0A2A']} style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <Text style={styles.noGuildTitle}>Join a Guild!</Text>
          <Text style={styles.noGuildSub}>Team up with Mumbai runners</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const allMembers = [
    { id: 'me', name: `${player.name} (You)`, level: player.level, weeklyScore: myWeeklyScore, heroId: player.selectedHeroId },
    ...guild.members,
  ].sort((a, b) => b.weeklyScore - a.weeklyScore);

  return (
    <LinearGradient colors={['#0A0A1A', '#1A0A2A', '#0A0A1A']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Guild banner */}
          <LinearGradient colors={[COLORS.saffron, COLORS.saffronDark]} style={styles.banner}>
            <Text style={styles.guildEmoji}>⚔️</Text>
            <Text style={styles.guildName}>{guild.name}</Text>
            <View style={styles.tagBadge}><Text style={styles.tagText}>[{guild.tag}]</Text></View>
            <Text style={styles.guildDesc}>{guild.description}</Text>
            <View style={styles.guildStats}>
              <GuildStat label="Level" value={`${guild.level}`} />
              <GuildStat label="Members" value={`${guild.members.length + 1}/30`} />
              <GuildStat label="Global Rank" value={`#${guild.rank}`} />
            </View>
          </LinearGradient>

          {/* My contribution */}
          <View style={styles.myCard}>
            <Text style={styles.myTitle}>Your Contribution</Text>
            <View style={styles.myStats}>
              <View style={styles.myStat}>
                <Text style={styles.myStatVal}>{formatNumber(myWeeklyScore)}</Text>
                <Text style={styles.myStatLab}>Weekly Score</Text>
              </View>
              <View style={styles.myStat}>
                <Text style={styles.myStatVal}>{guildPoints}</Text>
                <Text style={styles.myStatLab}>Guild Points</Text>
              </View>
              <View style={styles.myStat}>
                <Text style={styles.myStatVal}>{formatNumber(guild.weeklyScore)}</Text>
                <Text style={styles.myStatLab}>Guild Total</Text>
              </View>
            </View>
          </View>

          {/* Guild war banner */}
          <TouchableOpacity style={styles.warBanner}>
            <LinearGradient colors={['#B71C1C', '#7B1FA2']} style={styles.warGrad}>
              <Text style={styles.warEmoji}>⚔️</Text>
              <View>
                <Text style={styles.warTitle}>Guild War LIVE!</Text>
                <Text style={styles.warSub}>vs. Dharavi Destroyers • 18hrs left</Text>
              </View>
              <Text style={styles.warScore}>1,240 : 980</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Members leaderboard */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Leaderboard</Text>
            {allMembers.map((m, idx) => (
              <View key={m.id} style={[styles.memberRow, m.id === 'me' && styles.meRow]}>
                <Text style={styles.rank}>#{idx + 1}</Text>
                <View style={[styles.rankMedal, idx < 3 && { backgroundColor: ['#FFD700','#C0C0C0','#CD7F32'][idx] }]}>
                  <Text style={styles.rankEmoji}>{['🥇','🥈','🥉'][idx] || '🏃'}</Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{m.name}</Text>
                  <Text style={styles.memberLevel}>Lvl {m.level}</Text>
                </View>
                <Text style={styles.memberScore}>{formatNumber(m.weeklyScore)}</Text>
              </View>
            ))}
          </View>

          {/* Guild store */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Guild Store</Text>
            <Text style={styles.guildPointsText}>You have {guildPoints} Guild Points</Text>
            {['Hero Shard Pack (50pts)', 'Coin Bundle (30pts)', 'Revive Token (20pts)'].map(item => (
              <TouchableOpacity key={item} style={styles.storeItem}>
                <Text style={styles.storeItemText}>{item}</Text>
                <Text style={styles.storeItemBuy}>Buy</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const GuildStat = ({ label, value }: { label: string; value: string }) => (
  <View style={guildStatStyles.stat}>
    <Text style={guildStatStyles.value}>{value}</Text>
    <Text style={guildStatStyles.label}>{label}</Text>
  </View>
);

const guildStatStyles = StyleSheet.create({
  stat: { alignItems: 'center', flex: 1 },
  value: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.xl },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.xs },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  noGuildTitle: { color: COLORS.white, fontSize: FONTS.sizes.xxl, textAlign: 'center', marginTop: 80 },
  noGuildSub: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: SPACING.sm },
  scroll: { paddingBottom: 100 },
  banner: { padding: SPACING.xl, alignItems: 'center', gap: SPACING.sm },
  guildEmoji: { fontSize: 40 },
  guildName: { color: COLORS.white, fontSize: FONTS.sizes.xxl, fontWeight: '900' },
  tagBadge: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: RADIUS.round, paddingHorizontal: SPACING.md, paddingVertical: 3 },
  tagText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.sm },
  guildDesc: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.sizes.sm, textAlign: 'center' },
  guildStats: { flexDirection: 'row', width: '100%', marginTop: SPACING.sm },
  myCard: { backgroundColor: COLORS.darkCard, margin: SPACING.lg, borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.saffron },
  myTitle: { color: COLORS.saffron, fontWeight: '800', fontSize: FONTS.sizes.md, marginBottom: SPACING.md },
  myStats: { flexDirection: 'row', justifyContent: 'space-around' },
  myStat: { alignItems: 'center' },
  myStatVal: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.xl },
  myStatLab: { color: 'rgba(255,255,255,0.5)', fontSize: FONTS.sizes.xs },
  warBanner: { marginHorizontal: SPACING.lg, borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.lg },
  warGrad: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, gap: SPACING.md },
  warEmoji: { fontSize: 32 },
  warTitle: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.md },
  warSub: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.xs },
  warScore: { marginLeft: 'auto', color: COLORS.gold, fontWeight: '900', fontSize: FONTS.sizes.lg },
  section: { backgroundColor: COLORS.darkCard, marginHorizontal: SPACING.lg, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.darkBorder },
  sectionTitle: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.lg, marginBottom: SPACING.md },
  memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, gap: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  meRow: { backgroundColor: `${COLORS.saffron}22`, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm },
  rank: { color: 'rgba(255,255,255,0.4)', fontSize: FONTS.sizes.sm, width: 24, textAlign: 'center' },
  rankMedal: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.darkBorder, alignItems: 'center', justifyContent: 'center' },
  rankEmoji: { fontSize: 14 },
  memberInfo: { flex: 1 },
  memberName: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.sm },
  memberLevel: { color: 'rgba(255,255,255,0.4)', fontSize: FONTS.sizes.xs },
  memberScore: { color: COLORS.gold, fontWeight: '800', fontSize: FONTS.sizes.md },
  guildPointsText: { color: COLORS.gold, fontSize: FONTS.sizes.sm, marginBottom: SPACING.md },
  storeItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder },
  storeItemText: { color: COLORS.white, fontSize: FONTS.sizes.sm },
  storeItemBuy: { color: COLORS.saffron, fontWeight: '800', fontSize: FONTS.sizes.sm },
});
