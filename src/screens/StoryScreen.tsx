import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { STORY_CHAPTERS } from '../constants/story';
import { usePlayerStore } from '../store/playerStore';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { ProgressBar } from '../components/ui/ProgressBar';

export const StoryScreen: React.FC = () => {
  const nav = useNavigation<any>();
  const player = usePlayerStore();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <LinearGradient colors={['#0A0A1A', '#120820', '#0A0A1A']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Story Mode</Text>
          <Text style={styles.subtitle}>Chapter {player.storyChapter} of 8</Text>
          <ProgressBar
            value={player.storyChapter - 1}
            max={8}
            color={COLORS.saffron}
            height={8}
          />
        </View>

        {/* Hero quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteEmoji}>🎬</Text>
          <Text style={styles.quoteText}>"Mumbai Meri Jaan — Every Street Has A Hero."</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {STORY_CHAPTERS.map(ch => {
            const isUnlocked = player.level >= ch.unlockLevel;
            const isCurrentChapter = player.storyChapter === ch.id;
            const isCompleted = player.storyChapter > ch.id;
            const isExpanded = expanded === ch.id;

            return (
              <TouchableOpacity
                key={ch.id}
                onPress={() => setExpanded(isExpanded ? null : ch.id)}
                activeOpacity={0.85}
                disabled={!isUnlocked}
              >
                <View style={[
                  styles.chapterCard,
                  isCurrentChapter && styles.currentChapter,
                  isCompleted && styles.completedChapter,
                  !isUnlocked && styles.lockedChapter,
                ]}>
                  <LinearGradient
                    colors={isUnlocked ? ch.bgGradient : ['#1A1A2A', '#1A1A2A']}
                    style={styles.chapterGrad}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {/* Chapter number */}
                    <View style={[styles.chNum, isCompleted && styles.chNumDone, isCurrentChapter && styles.chNumActive]}>
                      <Text style={styles.chNumText}>
                        {isCompleted ? '✓' : ch.id}
                      </Text>
                    </View>

                    <View style={styles.chInfo}>
                      <View style={styles.chTitleRow}>
                        <Text style={styles.chEmoji}>{ch.emoji}</Text>
                        <View>
                          <Text style={styles.chSubtitle}>{ch.subtitle}</Text>
                          <Text style={styles.chTitle}>{ch.title}</Text>
                        </View>
                        {isCurrentChapter && (
                          <View style={styles.activeBadge}>
                            <Text style={styles.activeBadgeText}>ACTIVE</Text>
                          </View>
                        )}
                      </View>

                      {!isUnlocked && (
                        <Text style={styles.lockText}>🔒 Unlock at Level {ch.unlockLevel}</Text>
                      )}
                    </View>

                    <Text style={[styles.chevron, isExpanded && styles.chevronDown]}>›</Text>
                  </LinearGradient>

                  {/* Expanded detail */}
                  {isExpanded && isUnlocked && (
                    <View style={styles.expandedContent}>
                      <Text style={styles.expandedDesc}>{ch.description}</Text>

                      <Text style={styles.missionsLabel}>Chapter Missions:</Text>
                      {ch.missions.map((m, i) => (
                        <View key={i} style={styles.missionItem}>
                          <View style={[styles.missionDot, isCompleted && styles.missionDotDone]} />
                          <Text style={styles.missionText}>{m}</Text>
                        </View>
                      ))}

                      <View style={styles.rewardRow}>
                        <Text style={styles.rewardLabel}>🎁 Reward:</Text>
                        <Text style={styles.rewardText}>{ch.reward}</Text>
                      </View>

                      {isCurrentChapter && (
                        <TouchableOpacity style={styles.playChapterBtn} onPress={() => nav.navigate('Game')}>
                          <Text style={styles.playChapterText}>▶ Start Chapter {ch.id}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
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
  header: { padding: SPACING.lg, gap: SPACING.sm },
  title: { color: COLORS.white, fontSize: FONTS.sizes.xxl, fontWeight: '900' },
  subtitle: { color: COLORS.saffron, fontSize: FONTS.sizes.sm },
  quoteCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginHorizontal: SPACING.lg, backgroundColor: `${COLORS.saffron}15`, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: `${COLORS.saffron}33` },
  quoteEmoji: { fontSize: 24 },
  quoteText: { flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.sm, fontStyle: 'italic' },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  chapterCard: { borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md, borderWidth: 1.5, borderColor: COLORS.darkBorder },
  currentChapter: { borderColor: COLORS.saffron, borderWidth: 2 },
  completedChapter: { borderColor: COLORS.success },
  lockedChapter: { opacity: 0.5 },
  chapterGrad: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, gap: SPACING.md },
  chNum: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  chNumDone: { backgroundColor: COLORS.success },
  chNumActive: { backgroundColor: COLORS.saffron },
  chNumText: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.md },
  chInfo: { flex: 1 },
  chTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  chEmoji: { fontSize: 22 },
  chSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: FONTS.sizes.xs },
  chTitle: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.md },
  activeBadge: { backgroundColor: COLORS.saffron, borderRadius: RADIUS.round, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 'auto' },
  activeBadgeText: { color: COLORS.white, fontSize: 9, fontWeight: '900' },
  lockText: { color: 'rgba(255,255,255,0.4)', fontSize: FONTS.sizes.xs, marginTop: 3 },
  chevron: { color: 'rgba(255,255,255,0.4)', fontSize: 22, fontWeight: '700', transform: [{ rotate: '0deg' }] },
  chevronDown: { transform: [{ rotate: '90deg' }] },
  expandedContent: { backgroundColor: COLORS.darkBg, padding: SPACING.lg },
  expandedDesc: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.sm, lineHeight: 20, marginBottom: SPACING.md },
  missionsLabel: { color: COLORS.saffron, fontWeight: '800', fontSize: FONTS.sizes.sm, marginBottom: SPACING.sm },
  missionItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.xs },
  missionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.saffron },
  missionDotDone: { backgroundColor: COLORS.success },
  missionText: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.sm },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: `${COLORS.gold}15`, borderRadius: RADIUS.md, padding: SPACING.sm, marginTop: SPACING.md, borderWidth: 1, borderColor: `${COLORS.gold}33` },
  rewardLabel: { color: COLORS.gold, fontWeight: '800', fontSize: FONTS.sizes.sm },
  rewardText: { color: COLORS.white, fontSize: FONTS.sizes.xs, flex: 1 },
  playChapterBtn: { backgroundColor: COLORS.saffron, borderRadius: RADIUS.round, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.md },
  playChapterText: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.md },
});
