import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayerStore } from '../store/playerStore';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { formatNumber } from '../utils/format';

interface FestivalEvent {
  id: string;
  name: string;
  emoji: string;
  description: string;
  daysLeft: number;
  bonusMultiplier: number;
  gradient: [string, string];
  rewards: string[];
  exclusiveHero?: string;
  isLive: boolean;
}

const EVENTS: FestivalEvent[] = [
  {
    id: 'diwali',
    name: 'Diwali Dhamaka',
    emoji: '🪔',
    description: 'Festival of lights! Diyas everywhere, fireworks as obstacles. 2x coins for all runs!',
    daysLeft: 6,
    bonusMultiplier: 2.0,
    gradient: ['#FF6B35', '#FF1744'],
    rewards: ['Exclusive Diwali Skin', '500 Coins/day', '50 Festival Tokens', 'Diwali Hero Frame'],
    exclusiveHero: 'Diwali Champion',
    isLive: true,
  },
  {
    id: 'ganesh',
    name: 'Ganesh Utsav',
    emoji: '🐘',
    description: 'Ganpati Bappa Morya! Run through the procession streets of Mumbai.',
    daysLeft: 0,
    bonusMultiplier: 1.5,
    gradient: ['#E65100', '#FF8F00'],
    rewards: ['Ganesh Blessing Power-up x10', '300 Festival Tokens', 'Exclusive Modak Trail'],
    isLive: false,
  },
  {
    id: 'holi',
    name: 'Holi Rush',
    emoji: '🎨',
    description: 'Bura na mano, Holi hai! Color the streets and score massive combos.',
    daysLeft: 0,
    bonusMultiplier: 1.75,
    gradient: ['#E91E63', '#9C27B0'],
    rewards: ['Color Explosion Skin', '400 Festival Tokens', 'Holi Trail Effect'],
    isLive: false,
  },
  {
    id: 'monsoon',
    name: 'Monsoon Madness',
    emoji: '🌧️',
    description: 'Mumbai floods! Puddles everywhere, but the spirit never drowns. 1.5x XP!',
    daysLeft: 0,
    bonusMultiplier: 1.5,
    gradient: ['#0277BD', '#00BCD4'],
    rewards: ['Monsoon Hero Skin', 'Monsoon Glide x15', '350 Festival Tokens'],
    isLive: false,
  },
  {
    id: 'ipl',
    name: 'IPL Fever',
    emoji: '🏏',
    description: 'Cricket fever hits Mumbai! Run through stadium zones and collect cricket balls.',
    daysLeft: 0,
    bonusMultiplier: 1.25,
    gradient: ['#1565C0', '#0288D1'],
    rewards: ['Cricket Star Skin', 'Stadium Zone Access', '200 Festival Tokens'],
    isLive: false,
  },
  {
    id: 'eid',
    name: 'Eid Celebration',
    emoji: '🌙',
    description: 'Eid Mubarak! Celebrate with special routes through Bhendi Bazaar.',
    daysLeft: 0,
    bonusMultiplier: 1.5,
    gradient: ['#1B5E20', '#2E7D32'],
    rewards: ['Eid Festive Outfit', '300 Festival Tokens', 'Special Crescent Trail'],
    isLive: false,
  },
];

const DAILY_CHALLENGES = [
  { id: 'dc1', title: 'Speed Demon', desc: 'Run for 90 seconds without dying', emoji: '⚡', reward: '150 Coins', timeLeft: '18h' },
  { id: 'dc2', title: 'Coin Crazy', desc: 'Collect 300 coins in a single run', emoji: '🪙', reward: '200 Coins + 5 💎', timeLeft: '18h' },
  { id: 'dc3', title: 'Near Miss Master', desc: 'Get 10 near misses in one run', emoji: '😱', reward: '100 Coins', timeLeft: '18h' },
];

export const EventsScreen: React.FC = () => {
  const player = usePlayerStore();
  const [showDailyReward, setShowDailyReward] = useState(false);

  const handleClaimDaily = () => {
    const reward = player.claimDailyReward();
    if (reward.coins === 0) {
      Alert.alert('Already Claimed', 'Come back tomorrow for your next daily reward!');
    } else {
      Alert.alert('Daily Reward! 🎁', `Day ${player.dailyReward.streak} Streak!\n\n🪙 ${reward.coins} Coins${reward.mumbaiBucks > 0 ? `\n💎 ${reward.mumbaiBucks} Mumbai Bucks` : ''}`);
    }
  };

  const liveEvents = EVENTS.filter(e => e.isLive);
  const upcomingEvents = EVENTS.filter(e => !e.isLive);

  return (
    <LinearGradient colors={['#0A0A1A', '#1A0510', '#0A0A1A']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Events</Text>
          <Text style={styles.subtitle}>Mumbai Festival Calendar</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Daily Login Reward */}
          <TouchableOpacity onPress={handleClaimDaily} style={styles.dailyCard}>
            <LinearGradient colors={['#1B5E20', '#388E3C']} style={styles.dailyGrad}>
              <Text style={styles.dailyEmoji}>🎁</Text>
              <View style={styles.dailyInfo}>
                <Text style={styles.dailyTitle}>Daily Login Reward</Text>
                <Text style={styles.dailySub}>Day {player.dailyReward.streak} Streak — Keep it going!</Text>
                <View style={styles.streakDots}>
                  {[1,2,3,4,5,6,7].map(d => (
                    <View key={d} style={[styles.dot, d <= player.dailyReward.streak % 7 && styles.dotFilled]}>
                      <Text style={styles.dotText}>{d}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.claimDailyBtn}>
                <Text style={styles.claimDailyText}>CLAIM</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Daily Challenges */}
          <Text style={styles.sectionTitle}>⚡ Daily Challenges</Text>
          {DAILY_CHALLENGES.map(ch => (
            <View key={ch.id} style={styles.challengeCard}>
              <Text style={styles.challengeEmoji}>{ch.emoji}</Text>
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeTitle}>{ch.title}</Text>
                <Text style={styles.challengeDesc}>{ch.desc}</Text>
              </View>
              <View style={styles.challengeRight}>
                <Text style={styles.challengeReward}>{ch.reward}</Text>
                <Text style={styles.challengeTime}>⏰ {ch.timeLeft}</Text>
              </View>
            </View>
          ))}

          {/* Festival Tokens balance */}
          <View style={styles.tokenBanner}>
            <Text style={styles.tokenEmoji}>🪔</Text>
            <Text style={styles.tokenText}>You have {formatNumber(player.festivalTokens)} Festival Tokens</Text>
            <Text style={styles.tokenShop}>Shop →</Text>
          </View>

          {/* Live Events */}
          {liveEvents.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>🔴 LIVE NOW</Text>
              {liveEvents.map(ev => (
                <EventCard key={ev.id} event={ev} onPress={() =>
                  Alert.alert(ev.name, `${ev.description}\n\n🎁 Rewards:\n${ev.rewards.join('\n')}`)
                } />
              ))}
            </>
          )}

          {/* Upcoming Events */}
          <Text style={styles.sectionTitle}>📅 Upcoming Festivals</Text>
          {upcomingEvents.map(ev => (
            <EventCard key={ev.id} event={ev} isUpcoming onPress={() =>
              Alert.alert(ev.name, `${ev.description}\n\n🎁 Rewards:\n${ev.rewards.join('\n')}\n\n📅 Coming Soon!`)
            } />
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const EventCard = ({ event, isUpcoming, onPress }: { event: FestivalEvent; isUpcoming?: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.eventCard, isUpcoming && styles.eventUpcoming]}>
    <LinearGradient colors={event.gradient} style={styles.eventGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
      {isUpcoming && <View style={styles.upcomingOverlay} />}
      <Text style={styles.eventEmoji}>{event.emoji}</Text>
      <View style={styles.eventInfo}>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.eventDesc} numberOfLines={2}>{event.description}</Text>
        <View style={styles.eventMeta}>
          <View style={styles.multiplierBadge}>
            <Text style={styles.multiplierText}>{event.bonusMultiplier}x Bonus</Text>
          </View>
          {event.daysLeft > 0 && (
            <Text style={styles.daysLeft}>🔥 {event.daysLeft} days left</Text>
          )}
          {isUpcoming && <Text style={styles.comingSoon}>Coming Soon</Text>}
        </View>
      </View>
      <Text style={styles.arrowText}>›</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: { padding: SPACING.lg },
  title: { color: COLORS.white, fontSize: FONTS.sizes.xxl, fontWeight: '900' },
  subtitle: { color: COLORS.saffron, fontSize: FONTS.sizes.sm },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  dailyCard: { borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.lg, borderWidth: 2, borderColor: COLORS.success },
  dailyGrad: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, gap: SPACING.md },
  dailyEmoji: { fontSize: 32 },
  dailyInfo: { flex: 1 },
  dailyTitle: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.md },
  dailySub: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.xs, marginBottom: SPACING.sm },
  streakDots: { flexDirection: 'row', gap: 4 },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  dotFilled: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  dotText: { color: COLORS.white, fontSize: 9, fontWeight: '900' },
  claimDailyBtn: { backgroundColor: COLORS.gold, borderRadius: RADIUS.round, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  claimDailyText: { color: COLORS.black, fontWeight: '900', fontSize: FONTS.sizes.sm },
  sectionTitle: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.lg, marginBottom: SPACING.md, marginTop: SPACING.sm },
  challengeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.darkCard, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, gap: SPACING.md, borderWidth: 1, borderColor: COLORS.darkBorder },
  challengeEmoji: { fontSize: 26 },
  challengeInfo: { flex: 1 },
  challengeTitle: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.sm },
  challengeDesc: { color: 'rgba(255,255,255,0.5)', fontSize: FONTS.sizes.xs },
  challengeRight: { alignItems: 'flex-end' },
  challengeReward: { color: COLORS.gold, fontWeight: '700', fontSize: FONTS.sizes.sm },
  challengeTime: { color: 'rgba(255,255,255,0.4)', fontSize: FONTS.sizes.xs },
  tokenBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${COLORS.saffron}22`, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1, borderColor: `${COLORS.saffron}44`, gap: SPACING.sm },
  tokenEmoji: { fontSize: 22 },
  tokenText: { flex: 1, color: COLORS.white, fontSize: FONTS.sizes.sm, fontWeight: '600' },
  tokenShop: { color: COLORS.saffron, fontWeight: '800', fontSize: FONTS.sizes.sm },
  eventCard: { borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  eventUpcoming: { opacity: 0.65 },
  eventGrad: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, gap: SPACING.md, position: 'relative' },
  upcomingOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.3)' },
  eventEmoji: { fontSize: 36 },
  eventInfo: { flex: 1, gap: 4 },
  eventName: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.lg },
  eventDesc: { color: 'rgba(255,255,255,0.75)', fontSize: FONTS.sizes.xs },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: 4 },
  multiplierBadge: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: RADIUS.round, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  multiplierText: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.xs },
  daysLeft: { color: COLORS.gold, fontSize: FONTS.sizes.xs, fontWeight: '700' },
  comingSoon: { color: 'rgba(255,255,255,0.6)', fontSize: FONTS.sizes.xs },
  arrowText: { color: 'rgba(255,255,255,0.6)', fontSize: 24, fontWeight: '700' },
});
