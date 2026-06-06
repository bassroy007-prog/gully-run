import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayerStore } from '../store/playerStore';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { formatNumber } from '../utils/format';

type Tab = 'global' | 'friends' | 'guild';

const MOCK_GLOBAL = [
  { id: '1', name: 'CricketKing99', score: 980000, level: 87, heroId: 'cricket', flag: '🇮🇳' },
  { id: '2', name: 'MumbaiFlash', score: 845000, level: 79, heroId: 'bollywood', flag: '🇮🇳' },
  { id: '3', name: 'RajaOfRun', score: 720000, level: 71, heroId: 'tapori', flag: '🇮🇳' },
  { id: '4', name: 'GullyBoss', score: 650000, level: 65, heroId: 'hacker', flag: '🇮🇳' },
  { id: '5', name: 'SpeedDemon', score: 580000, level: 58, heroId: 'autoking', flag: '🇮🇳' },
  { id: '6', name: 'DharaviKing', score: 510000, level: 52, heroId: 'tapori', flag: '🇮🇳' },
  { id: '7', name: 'MarineDrive', score: 445000, level: 48, heroId: 'monsoon', flag: '🇮🇳' },
  { id: '8', name: 'BandraGal', score: 380000, level: 43, heroId: 'fisherwoman', flag: '🇮🇳' },
  { id: '9', name: 'VadaPavVeer', score: 315000, level: 38, heroId: 'vadapav', flag: '🇮🇳' },
  { id: '10', name: 'ColabaCruiser', score: 250000, level: 33, heroId: 'dabbawala', flag: '🇮🇳' },
];

const MOCK_FRIENDS = [
  { id: 'f1', name: 'Raj Sharma', score: 45000, level: 22, heroId: 'autoking', flag: '🇮🇳' },
  { id: 'f2', name: 'Priya K', score: 32000, level: 18, heroId: 'hacker', flag: '🇮🇳' },
  { id: 'f3', name: 'Arjun M', score: 28000, level: 15, heroId: 'dabbawala', flag: '🇮🇳' },
];

export const LeaderboardScreen: React.FC = () => {
  const [tab, setTab] = useState<Tab>('global');
  const player = usePlayerStore();

  const data = tab === 'global' ? MOCK_GLOBAL : tab === 'friends' ? MOCK_FRIENDS : MOCK_GLOBAL.slice(0, 5);
  const myEntry = { id: 'me', name: `${player.name} (You)`, score: player.highScore, level: player.level, heroId: player.selectedHeroId, flag: '🇮🇳' };
  const myRank = data.findIndex(d => d.score <= player.highScore) + 1 || data.length + 1;

  return (
    <LinearGradient colors={['#0A0A1A', '#0A0A2A', '#0A0A1A']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.subtitle}>🇮🇳 Mumbai's Finest Runners</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['global', 'friends', 'guild'] as Tab[]).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'global' ? '🌍 Global' : t === 'friends' ? '👥 Friends' : '⚔️ Guild'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top 3 podium */}
        {tab === 'global' && data.length >= 3 && (
          <View style={styles.podium}>
            <PodiumCard entry={data[1]} rank={2} />
            <PodiumCard entry={data[0]} rank={1} height={90} />
            <PodiumCard entry={data[2]} rank={3} />
          </View>
        )}

        {/* List */}
        <FlatList
          data={tab === 'global' ? data.slice(3) : data}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <LeaderRow entry={item} rank={(tab === 'global' ? index + 4 : index + 1)} isMe={item.id === 'me'} />
          )}
          ListFooterComponent={() => (
            <View style={styles.myRankCard}>
              <Text style={styles.myRankLabel}>Your Rank</Text>
              <Text style={styles.myRankVal}>#{myRank}</Text>
              <Text style={styles.myRankScore}>{formatNumber(player.highScore)} pts</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const PodiumCard = ({ entry, rank, height = 70 }: { entry: any; rank: number; height?: number }) => (
  <View style={[podiumStyles.card, { marginTop: rank === 1 ? 0 : 20 }]}>
    <Text style={podiumStyles.medal}>{['🥇', '🥈', '🥉'][rank - 1]}</Text>
    <Text style={podiumStyles.name} numberOfLines={1}>{entry.name}</Text>
    <Text style={podiumStyles.score}>{formatNumber(entry.score)}</Text>
    <View style={[podiumStyles.bar, { height, backgroundColor: ['#FFD700','#C0C0C0','#CD7F32'][rank - 1] }]}>
      <Text style={podiumStyles.rankNum}>#{rank}</Text>
    </View>
  </View>
);

const LeaderRow = ({ entry, rank, isMe }: { entry: any; rank: number; isMe?: boolean }) => (
  <View style={[rowStyles.row, isMe && rowStyles.me]}>
    <Text style={rowStyles.rank}>#{rank}</Text>
    <View style={rowStyles.flag}><Text>{entry.flag}</Text></View>
    <View style={rowStyles.info}>
      <Text style={rowStyles.name}>{entry.name}</Text>
      <Text style={rowStyles.level}>Lvl {entry.level}</Text>
    </View>
    <Text style={rowStyles.score}>{formatNumber(entry.score)}</Text>
  </View>
);

const podiumStyles = StyleSheet.create({
  card: { flex: 1, alignItems: 'center', gap: 4 },
  medal: { fontSize: 28 },
  name: { color: COLORS.white, fontWeight: '700', fontSize: 10, textAlign: 'center' },
  score: { color: COLORS.gold, fontSize: FONTS.sizes.xs, fontWeight: '800' },
  bar: { width: '100%', borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  rankNum: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.lg },
});

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.darkBorder, gap: SPACING.sm },
  me: { backgroundColor: `${COLORS.saffron}22` },
  rank: { color: 'rgba(255,255,255,0.4)', width: 28, textAlign: 'center', fontSize: FONTS.sizes.sm },
  flag: { width: 24, alignItems: 'center' },
  info: { flex: 1 },
  name: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.sm },
  level: { color: 'rgba(255,255,255,0.4)', fontSize: FONTS.sizes.xs },
  score: { color: COLORS.gold, fontWeight: '900', fontSize: FONTS.sizes.md },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: { padding: SPACING.lg },
  title: { color: COLORS.white, fontSize: FONTS.sizes.xxl, fontWeight: '900' },
  subtitle: { color: COLORS.saffron, fontSize: FONTS.sizes.sm },
  tabs: { flexDirection: 'row', marginHorizontal: SPACING.lg, backgroundColor: COLORS.darkCard, borderRadius: RADIUS.round, padding: 4, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.darkBorder },
  tab: { flex: 1, paddingVertical: SPACING.sm, borderRadius: RADIUS.round, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.saffron },
  tabText: { color: 'rgba(255,255,255,0.5)', fontSize: FONTS.sizes.sm, fontWeight: '700' },
  tabTextActive: { color: COLORS.white },
  podium: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg, gap: SPACING.sm },
  list: { paddingBottom: 100 },
  myRankCard: { margin: SPACING.lg, backgroundColor: COLORS.darkCard, borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', borderWidth: 2, borderColor: COLORS.saffron },
  myRankLabel: { color: 'rgba(255,255,255,0.5)', fontSize: FONTS.sizes.sm },
  myRankVal: { color: COLORS.white, fontSize: FONTS.sizes.hero, fontWeight: '900' },
  myRankScore: { color: COLORS.gold, fontSize: FONTS.sizes.lg, fontWeight: '800' },
});
