import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { HEROES, Hero } from '../constants/heroes';
import { usePlayerStore } from '../store/playerStore';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { formatNumber } from '../utils/format';
import { getCharacterAsset, getCharacterPortrait } from '../constants/characterAssets';

const RARITY_COLORS: Record<string, string> = {
  common: COLORS.common,
  rare: COLORS.rare,
  epic: COLORS.epic,
  legendary: COLORS.legendary,
};

const StatBar = ({ label, value }: { label: string; value: number }) => (
  <View style={statStyles.row}>
    <Text style={statStyles.label}>{label}</Text>
    <View style={statStyles.track}>
      {[1,2,3,4,5].map(i => (
        <View key={i} style={[statStyles.dot, i <= value && statStyles.dotFilled]} />
      ))}
    </View>
  </View>
);

const statStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: FONTS.sizes.xs, width: 36, fontWeight: '700' },
  track: { flexDirection: 'row', gap: 4 },
  dot: { width: 12, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.15)' },
  dotFilled: { backgroundColor: COLORS.saffron },
});

export const HeroesScreen: React.FC = () => {
  const player = usePlayerStore();
  const [selected, setSelected] = useState<Hero | null>(null);

  const isUnlocked = (heroId: string) => player.unlockedHeroIds.includes(heroId);
  const isActive = (heroId: string) => player.selectedHeroId === heroId;

  const handleUnlock = (hero: Hero) => {
    if (hero.unlockCurrency === 'free') return;
    if (hero.unlockCurrency === 'coins') {
      if (!player.spendCoins(hero.unlockCost)) {
        Alert.alert('Not Enough Coins', `You need ${formatNumber(hero.unlockCost)} coins to unlock ${hero.name}.`);
        return;
      }
    } else if (hero.unlockCurrency === 'mumbaiBucks') {
      if (!player.spendMumbaiBucks(hero.unlockCost)) {
        Alert.alert('Not Enough Mumbai Bucks', `You need ${hero.unlockCost} 💎 Mumbai Bucks to unlock ${hero.name}.`);
        return;
      }
    }
    player.unlockHero(hero.id);
    player.setSelectedHero(hero.id);
    setSelected(null);
    Alert.alert('Hero Unlocked! 🎉', `${hero.emoji} ${hero.name} is now your active hero!`);
  };

  const handleSelect = (heroId: string) => {
    player.setSelectedHero(heroId);
    setSelected(null);
  };

  const unlockedCount = player.unlockedHeroIds.length;

  return (
    <LinearGradient colors={['#050510', '#0A0820', '#050510']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Heroes</Text>
          <Text style={styles.subtitle}>{unlockedCount}/{HEROES.length} Mumbai Legends Unlocked</Text>
          <ProgressBar value={unlockedCount} max={HEROES.length} color={COLORS.saffron} height={6} />
        </View>

        <FlatList
          data={HEROES}
          numColumns={2}
          keyExtractor={h => h.id}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => {
            const unlocked = isUnlocked(item.id);
            const active = isActive(item.id);
            const rarityColor = RARITY_COLORS[item.rarity];

            return (
              <TouchableOpacity
                style={[styles.card, active && styles.cardActive]}
                onPress={() => setSelected(item)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={unlocked ? item.bgGradient : ['#1A1A2A', '#0A0A1A']}
                  style={styles.cardGrad}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* Rarity top strip */}
                  <View style={[styles.rarityStrip, { backgroundColor: rarityColor }]} />

                  {/* Active badge */}
                  {active && (
                    <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>✓ ACTIVE</Text></View>
                  )}

                  {/* Lock overlay */}
                  {!unlocked && (
                    <View style={styles.lockOverlay}>
                      <Text style={styles.lockEmoji}>🔒</Text>
                      {item.unlockCurrency === 'coins' && (
                        <Text style={styles.lockCost}>🪙 {formatNumber(item.unlockCost)}</Text>
                      )}
                      {item.unlockCurrency === 'mumbaiBucks' && (
                        <Text style={styles.lockCost}>💎 {item.unlockCost}</Text>
                      )}
                    </View>
                  )}

                  {/* Character art or emoji fallback */}
                  {getCharacterPortrait(item.id) ? (
                    <Image source={getCharacterPortrait(item.id)} style={styles.heroImage} resizeMode="contain" />
                  ) : (
                    <Text style={styles.heroEmoji}>{item.emoji}</Text>
                  )}
                  <Text style={styles.heroName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.heroNickname} numberOfLines={1}>"{item.nickname}"</Text>
                  <Text style={[styles.heroRarity, { color: rarityColor }]}>{item.rarity.toUpperCase()}</Text>

                  {/* Mini stats */}
                  <View style={styles.miniStats}>
                    <View style={styles.miniStat}>
                      <Text style={styles.miniStatLabel}>SPD</Text>
                      <View style={styles.miniBar}>
                        <View style={[styles.miniBarFill, { width: `${item.stats.speed * 20}%` }]} />
                      </View>
                    </View>
                    <View style={styles.miniStat}>
                      <Text style={styles.miniStatLabel}>JMP</Text>
                      <View style={styles.miniBar}>
                        <View style={[styles.miniBarFill, { width: `${item.stats.jump * 20}%`, backgroundColor: COLORS.teal }]} />
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          }}
        />

        {/* Hero Detail Modal */}
        {selected && (
          <Modal visible onClose={() => setSelected(null)}>
            <LinearGradient colors={selected.bgGradient} style={detailStyles.heroBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              {getCharacterAsset(selected.id) ? (
                <Image source={getCharacterAsset(selected.id)} style={detailStyles.bigCharImg} resizeMode="contain" />
              ) : (
                <Text style={detailStyles.bigEmoji}>{selected.emoji}</Text>
              )}
              <View style={{ flex: 1 }}>
                <Text style={detailStyles.heroName}>{selected.name}</Text>
                <Text style={detailStyles.heroNickname}>"{selected.nickname}"</Text>
                <Text style={detailStyles.heroTitle}>{selected.title}</Text>
                <View style={[detailStyles.rarityBadge, { backgroundColor: RARITY_COLORS[selected.rarity] }]}>
                  <Text style={detailStyles.rarityText}>{selected.rarity.toUpperCase()}</Text>
                </View>
              </View>
            </LinearGradient>

            <ScrollView style={detailStyles.scroll} showsVerticalScrollIndicator={false}>
              <Text style={detailStyles.story}>{selected.story}</Text>

              {/* Voice lines */}
              <View style={detailStyles.voiceBox}>
                <Text style={detailStyles.voiceTitle}>🎙️ Voice Lines</Text>
                {selected.voiceLines.map((line, i) => (
                  <Text key={i} style={detailStyles.voiceLine}>{line}</Text>
                ))}
              </View>

              {/* Stats */}
              <View style={detailStyles.statsBox}>
                <StatBar label="SPEED" value={selected.stats.speed} />
                <StatBar label="JUMP" value={selected.stats.jump} />
                <StatBar label="COINS" value={selected.stats.coins} />
                <StatBar label="AGILITY" value={selected.stats.agility} />
              </View>

              {/* Abilities */}
              <View style={detailStyles.abilityBox}>
                <Text style={detailStyles.abilityTitle}>⚡ Passive Skill</Text>
                <Text style={detailStyles.abilityText}>{selected.passiveSkill}</Text>
              </View>
              <View style={[detailStyles.abilityBox, { borderColor: COLORS.teal + '44' }]}>
                <Text style={[detailStyles.abilityTitle, { color: COLORS.teal }]}>🌟 {selected.activeSkillName}</Text>
                <Text style={detailStyles.abilityText}>{selected.activeSkill}</Text>
              </View>

              {/* Victory screen */}
              <Text style={detailStyles.victoryLabel}>🏆 Ultimate Rank: {selected.ultimateRank}</Text>
              <Text style={detailStyles.victoryLabel}>🎬 Victory: {selected.victoryScreen}</Text>

              {/* Collectibles */}
              <Text style={detailStyles.collectLabel}>Collectibles</Text>
              <View style={detailStyles.collectRow}>
                {selected.collectibles.map((c, i) => (
                  <View key={i} style={detailStyles.collectChip}>
                    <Text style={detailStyles.collectText}>{c}</Text>
                  </View>
                ))}
              </View>

              {/* Action buttons */}
              <View style={detailStyles.actions}>
                {!isUnlocked(selected.id) ? (
                  <Button
                    label={
                      selected.unlockCurrency === 'free' ? 'Already Unlocked!'
                      : selected.unlockCurrency === 'coins' ? `Unlock — 🪙 ${formatNumber(selected.unlockCost)}`
                      : `Unlock — 💎 ${selected.unlockCost} Mumbai Bucks`
                    }
                    onPress={() => handleUnlock(selected)}
                    variant={selected.unlockCurrency === 'mumbaiBucks' ? 'gold' : 'primary'}
                    disabled={selected.unlockCurrency === 'free'}
                  />
                ) : (
                  <>
                    {!isActive(selected.id) && (
                      <Button label="SET AS ACTIVE HERO" onPress={() => handleSelect(selected.id)} variant="primary" emoji={selected.emoji} />
                    )}
                    {isActive(selected.id) && (
                      <View style={detailStyles.activeNotice}>
                        <Text style={detailStyles.activeNoticeText}>✓ Currently Your Active Hero</Text>
                      </View>
                    )}
                  </>
                )}
              </View>
            </ScrollView>
          </Modal>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const detailStyles = StyleSheet.create({
  heroBanner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg, borderRadius: RADIUS.lg, marginBottom: SPACING.lg },
  bigEmoji: { fontSize: 52 },
  bigCharImg: { width: 80, height: 100, borderRadius: RADIUS.md },
  heroName: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.xl },
  heroNickname: { color: COLORS.gold, fontSize: FONTS.sizes.sm, fontStyle: 'italic', marginBottom: 2 },
  heroTitle: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.sm },
  voiceBox: { backgroundColor: 'rgba(255,107,53,0.08)', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: `${COLORS.saffron}33`, gap: 6 },
  voiceTitle: { color: COLORS.saffron, fontWeight: '800', fontSize: FONTS.sizes.sm },
  voiceLine: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.sm, fontStyle: 'italic', lineHeight: 18 },
  rarityBadge: { borderRadius: RADIUS.round, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 4 },
  rarityText: { color: COLORS.white, fontSize: 9, fontWeight: '900' },
  scroll: { maxHeight: 400 },
  story: { color: 'rgba(255,255,255,0.65)', fontSize: FONTS.sizes.sm, lineHeight: 20, marginBottom: SPACING.md },
  statsBox: { backgroundColor: COLORS.darkBg, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, gap: 8, borderWidth: 1, borderColor: COLORS.darkBorder },
  abilityBox: { backgroundColor: `${COLORS.saffron}11`, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: `${COLORS.saffron}33` },
  abilityTitle: { color: COLORS.saffron, fontWeight: '800', fontSize: FONTS.sizes.sm, marginBottom: 4 },
  abilityText: { color: COLORS.white, fontSize: FONTS.sizes.sm },
  victoryLabel: { color: 'rgba(255,255,255,0.5)', fontSize: FONTS.sizes.xs, marginBottom: 4 },
  collectLabel: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.sm, marginTop: SPACING.md, marginBottom: SPACING.sm },
  collectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  collectChip: { backgroundColor: COLORS.darkBg, borderRadius: RADIUS.round, paddingHorizontal: SPACING.sm, paddingVertical: 3, borderWidth: 1, borderColor: COLORS.darkBorder },
  collectText: { color: 'rgba(255,255,255,0.6)', fontSize: FONTS.sizes.xs },
  actions: { gap: SPACING.sm, paddingBottom: SPACING.lg },
  activeNotice: { backgroundColor: `${COLORS.success}22`, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.success },
  activeNoticeText: { color: COLORS.success, fontWeight: '800', fontSize: FONTS.sizes.md },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: { padding: SPACING.lg, gap: SPACING.sm },
  title: { color: COLORS.white, fontSize: FONTS.sizes.xxl, fontWeight: '900' },
  subtitle: { color: COLORS.saffron, fontSize: FONTS.sizes.sm },
  list: { padding: SPACING.lg, paddingBottom: 100 },
  row: { justifyContent: 'space-between', gap: SPACING.sm, marginBottom: SPACING.sm },
  card: { flex: 1, maxWidth: '48%', borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1.5, borderColor: COLORS.darkBorder },
  cardActive: { borderColor: COLORS.gold, borderWidth: 2.5 },
  cardGrad: { padding: SPACING.md, alignItems: 'center', minHeight: 170, position: 'relative' },
  rarityStrip: { position: 'absolute', top: 0, left: 0, right: 0, height: 3 },
  activeBadge: { position: 'absolute', top: SPACING.sm, right: SPACING.sm, backgroundColor: COLORS.gold, borderRadius: RADIUS.round, paddingHorizontal: 6, paddingVertical: 2 },
  activeBadgeText: { color: COLORS.black, fontSize: 8, fontWeight: '900' },
  lockOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', zIndex: 5, borderRadius: RADIUS.lg, gap: SPACING.xs },
  lockEmoji: { fontSize: 26 },
  lockCost: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.sm, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: RADIUS.round, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  heroEmoji: { fontSize: 38, marginTop: SPACING.sm, marginBottom: SPACING.xs },
  heroImage: { width: 70, height: 80, marginTop: SPACING.sm, marginBottom: SPACING.xs, borderRadius: RADIUS.sm },
  heroName: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.sm, textAlign: 'center' },
  heroNickname: { color: COLORS.gold, fontSize: 9, fontStyle: 'italic', textAlign: 'center', marginBottom: 2 },
  heroRarity: { fontSize: FONTS.sizes.xs, fontWeight: '700', letterSpacing: 1, marginBottom: SPACING.xs },
  miniStats: { width: '100%', gap: 4, marginTop: SPACING.xs },
  miniStat: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  miniStatLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '700', width: 24 },
  miniBar: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  miniBarFill: { height: 4, backgroundColor: COLORS.saffron, borderRadius: 2 },
});
