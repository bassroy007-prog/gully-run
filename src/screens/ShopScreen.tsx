import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayerStore } from '../store/playerStore';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { formatNumber } from '../utils/format';

type ShopTab = 'featured' | 'bucks' | 'coins' | 'battlepass';

const MUMBAI_BUCKS_PACKS = [
  { id: 'starter', emoji: '💎', label: 'Starter Pack', bucks: 80, bonus: 20, price: '₹49', tag: 'Best Start', highlight: false },
  { id: 'small',   emoji: '💎💎', label: 'Mumbai Pack', bucks: 200, bonus: 0, price: '₹99', tag: '', highlight: false },
  { id: 'medium',  emoji: '💎💎💎', label: 'City Pack', bucks: 600, bonus: 100, price: '₹299', tag: 'Popular 🔥', highlight: true },
  { id: 'large',   emoji: '💎✨', label: 'Boss Pack', bucks: 1500, bonus: 300, price: '₹699', tag: '', highlight: false },
  { id: 'mega',    emoji: '💎👑', label: 'Legend Pack', bucks: 3500, bonus: 1000, price: '₹1499', tag: 'Best Value', highlight: false },
];

const COIN_PACKS = [
  { id: 'c1', emoji: '🪙', label: '2,500 Coins', coins: 2500, bucksCost: 30 },
  { id: 'c2', emoji: '🪙🪙', label: '8,000 Coins', coins: 8000, bucksCost: 80 },
  { id: 'c3', emoji: '🪙✨', label: '25,000 Coins', coins: 25000, bucksCost: 220 },
];

const FEATURED_ITEMS = [
  { id: 'ft1', emoji: '🎯', label: 'Starter Bundle', desc: 'Best value for new players', price: '₹49', tag: 'LIMITED', gradient: ['#FF6B35', '#E65100'] as [string,string] },
  { id: 'ft2', emoji: '🏏', label: 'Cricket Star Pack', desc: 'Tapori outfit + 300 Mumbai Bucks', price: '₹199', tag: 'NEW', gradient: ['#1565C0', '#0288D1'] as [string,string] },
  { id: 'ft3', emoji: '🪔', label: 'Diwali Bundle', desc: 'Special Diwali skins + tokens', price: '₹299', tag: 'EVENT', gradient: ['#FF1744', '#FF6B35'] as [string,string] },
];

const BATTLE_PASS_PERKS_FREE = ['50 Coins/day', '3 Daily Missions', 'Basic Hero Frames', '5 Festival Tokens/week'];
const BATTLE_PASS_PERKS_PREMIUM = ['500 Coins/day', '20 Mumbai Bucks/day', 'Exclusive Hero Skin', 'All Daily Missions', '50 Festival Tokens/week', 'Premium Battle Pass Quests', 'Ad-Free Experience', 'VIP Leaderboard Icon'];

export const ShopScreen: React.FC = () => {
  const [tab, setTab] = useState<ShopTab>('featured');
  const player = usePlayerStore();

  const handleBuyBucks = (pack: typeof MUMBAI_BUCKS_PACKS[0]) => {
    Alert.alert(
      `Buy ${pack.label}?`,
      `${pack.bucks + pack.bonus} Mumbai Bucks for ${pack.price}\n\nIn production, this connects to app store IAP.`,
      [
        { text: 'Cancel' },
        {
          text: `Buy ${pack.price}`,
          onPress: () => {
            player.addMumbaiBucks(pack.bucks + pack.bonus);
            Alert.alert('Purchase Complete! 💎', `${pack.bucks + pack.bonus} Mumbai Bucks added!`);
          },
        },
      ],
    );
  };

  const handleBuyCoins = (pack: typeof COIN_PACKS[0]) => {
    if (!player.spendMumbaiBucks(pack.bucksCost)) {
      Alert.alert('Not Enough Mumbai Bucks', 'Purchase Mumbai Bucks to exchange for coins.');
      return;
    }
    player.addCoins(pack.coins);
    Alert.alert('Coins Added! 🪙', `${formatNumber(pack.coins)} coins added to your wallet!`);
  };

  const handleBuyBattlePass = () => {
    Alert.alert(
      'Mumbai Elite Pass',
      'Subscribe for ₹149/month and get premium rewards daily!\n\nIn production, this connects to your app store subscription.',
      [
        { text: 'Cancel' },
        {
          text: 'Subscribe ₹149/mo',
          onPress: () => Alert.alert('Coming Soon!', 'Battle Pass will be available at launch. Stay tuned!'),
        },
      ],
    );
  };

  return (
    <LinearGradient colors={['#050510', '#100820', '#050510']} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.title}>Shop</Text>
          <View style={styles.walletRow}>
            <View style={styles.walletChip}>
              <Text style={styles.wEmoji}>🪙</Text>
              <Text style={styles.wVal}>{formatNumber(player.coins)}</Text>
            </View>
            <View style={[styles.walletChip, styles.walletPremium]}>
              <Text style={styles.wEmoji}>💎</Text>
              <Text style={[styles.wVal, { color: COLORS.teal }]}>{formatNumber(player.mumbaiBucks)}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={styles.tabs}>
          {(['featured', 'bucks', 'coins', 'battlepass'] as ShopTab[]).map(t => (
            <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'featured' ? '⭐ Featured' : t === 'bucks' ? '💎 Mumbai Bucks' : t === 'coins' ? '🪙 Coins' : '👑 Battle Pass'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {tab === 'featured' && (
            <>
              <Text style={styles.sectionLabel}>LIMITED TIME OFFERS</Text>
              {FEATURED_ITEMS.map(item => (
                <TouchableOpacity key={item.id} onPress={() => Alert.alert(item.label, item.desc)}>
                  <LinearGradient colors={item.gradient} style={styles.featuredCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <View style={styles.featuredTag}><Text style={styles.featuredTagText}>{item.tag}</Text></View>
                    <Text style={styles.featuredEmoji}>{item.emoji}</Text>
                    <View style={styles.featuredInfo}>
                      <Text style={styles.featuredLabel}>{item.label}</Text>
                      <Text style={styles.featuredDesc}>{item.desc}</Text>
                    </View>
                    <View style={styles.priceBtn}>
                      <Text style={styles.priceText}>{item.price}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}

              <Text style={[styles.sectionLabel, { marginTop: SPACING.lg }]}>COSMETIC STORE</Text>
              <View style={styles.cosmeticGrid}>
                {[
                  { emoji: '🎩', label: 'Bollywood Hat', price: '80 💎' },
                  { emoji: '🕶️', label: 'Tapori Shades', price: '60 💎' },
                  { emoji: '👟', label: 'Speed Shoes', price: '100 💎' },
                  { emoji: '🎒', label: 'Delivery Bag', price: '70 💎' },
                ].map(item => (
                  <TouchableOpacity key={item.emoji} style={styles.cosmeticCard} onPress={() => Alert.alert('Cosmetic', `${item.label} — ${item.price}`)}>
                    <Text style={styles.cosmeticEmoji}>{item.emoji}</Text>
                    <Text style={styles.cosmeticLabel}>{item.label}</Text>
                    <Text style={styles.cosmeticPrice}>{item.price}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {tab === 'bucks' && (
            <>
              <Text style={styles.sectionLabel}>MUMBAI BUCKS — Premium Currency</Text>
              <Text style={styles.bucksSub}>Use Mumbai Bucks to unlock heroes, buy coins, and get exclusive cosmetics</Text>
              {MUMBAI_BUCKS_PACKS.map(pack => (
                <TouchableOpacity key={pack.id} onPress={() => handleBuyBucks(pack)}>
                  <LinearGradient
                    colors={pack.highlight ? [COLORS.saffron, '#E65100'] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                    style={[styles.bucksCard, pack.highlight && styles.bucksCardHighlight]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  >
                    {pack.tag ? <View style={[styles.packTag, pack.highlight && styles.packTagHighlight]}><Text style={styles.packTagText}>{pack.tag}</Text></View> : null}
                    <Text style={styles.packEmoji}>{pack.emoji}</Text>
                    <View style={styles.packInfo}>
                      <Text style={styles.packLabel}>{pack.label}</Text>
                      <Text style={styles.packAmount}>
                        💎 {formatNumber(pack.bucks)}
                        {pack.bonus > 0 ? ` + ${pack.bonus} BONUS` : ''}
                      </Text>
                    </View>
                    <View style={[styles.priceBtn, pack.highlight && styles.priceBtnDark]}>
                      <Text style={styles.priceText}>{pack.price}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </>
          )}

          {tab === 'coins' && (
            <>
              <Text style={styles.sectionLabel}>EXCHANGE MUMBAI BUCKS FOR COINS</Text>
              <Text style={styles.bucksSub}>You have 💎 {formatNumber(player.mumbaiBucks)} Mumbai Bucks</Text>
              {COIN_PACKS.map(pack => (
                <TouchableOpacity key={pack.id} style={styles.coinCard} onPress={() => handleBuyCoins(pack)}>
                  <Text style={styles.coinEmoji}>{pack.emoji}</Text>
                  <View style={styles.packInfo}>
                    <Text style={styles.packLabel}>{pack.label}</Text>
                    <Text style={styles.packAmount}>Instant delivery to wallet</Text>
                  </View>
                  <View style={[styles.priceBtn, { backgroundColor: COLORS.teal }]}>
                    <Text style={styles.priceText}>💎 {pack.bucksCost}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {tab === 'battlepass' && (
            <>
              {/* Season banner */}
              <LinearGradient colors={['#FF6B35', '#9C27B0', '#2196F3']} style={styles.seasonBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={styles.seasonEmoji}>👑</Text>
                <Text style={styles.seasonTitle}>Mumbai Elite Pass</Text>
                <Text style={styles.seasonSub}>Season 1 — Dharavi Chapter • 28 days left</Text>
              </LinearGradient>

              {/* Free vs Premium comparison */}
              <View style={styles.passComparison}>
                <View style={styles.passCol}>
                  <Text style={styles.passColTitle}>FREE TRACK</Text>
                  {BATTLE_PASS_PERKS_FREE.map(p => (
                    <View key={p} style={styles.perkRow}>
                      <Text style={styles.perkCheck}>○</Text>
                      <Text style={styles.perkText}>{p}</Text>
                    </View>
                  ))}
                </View>
                <View style={[styles.passCol, styles.passColPremium]}>
                  <LinearGradient colors={['#FF6B35', '#FF1744']} style={styles.premiumHeader}>
                    <Text style={styles.passColTitlePremium}>👑 PREMIUM</Text>
                  </LinearGradient>
                  {BATTLE_PASS_PERKS_PREMIUM.map(p => (
                    <View key={p} style={styles.perkRow}>
                      <Text style={[styles.perkCheck, { color: COLORS.gold }]}>★</Text>
                      <Text style={styles.perkText}>{p}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.buyPassBtn} onPress={handleBuyBattlePass}>
                <LinearGradient colors={[COLORS.saffron, '#FF1744']} style={styles.buyPassGrad}>
                  <Text style={styles.buyPassText}>Subscribe ₹149/month</Text>
                  <Text style={styles.buyPassSub}>Cancel anytime • No pay-to-win advantages</Text>
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.noPayWin}>🎮 All gameplay-affecting items remain free. Only cosmetics and time-savers are paid.</Text>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg },
  title: { color: COLORS.white, fontSize: FONTS.sizes.xxl, fontWeight: '900' },
  walletRow: { flexDirection: 'row', gap: SPACING.sm },
  walletChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: RADIUS.round, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  walletPremium: { borderColor: `${COLORS.teal}44` },
  wEmoji: { fontSize: 14 },
  wVal: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.sm },
  tabScroll: { flexGrow: 0, marginBottom: SPACING.sm },
  tabs: { paddingHorizontal: SPACING.lg, gap: SPACING.sm, paddingBottom: SPACING.xs },
  tab: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.round, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.04)' },
  tabActive: { backgroundColor: COLORS.saffron, borderColor: COLORS.saffron },
  tabText: { color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: FONTS.sizes.sm },
  tabTextActive: { color: COLORS.white },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  sectionLabel: { color: 'rgba(255,255,255,0.4)', fontSize: FONTS.sizes.xs, fontWeight: '700', letterSpacing: 1.5, marginBottom: SPACING.md },
  bucksSub: { color: 'rgba(255,255,255,0.5)', fontSize: FONTS.sizes.sm, marginBottom: SPACING.lg },
  featuredCard: { flexDirection: 'row', alignItems: 'center', borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, gap: SPACING.md, overflow: 'hidden', position: 'relative' },
  featuredTag: { position: 'absolute', top: 8, left: 8, backgroundColor: COLORS.gold, borderRadius: RADIUS.round, paddingHorizontal: 8, paddingVertical: 2 },
  featuredTagText: { color: COLORS.black, fontSize: 9, fontWeight: '900' },
  featuredEmoji: { fontSize: 32, marginTop: 12 },
  featuredInfo: { flex: 1 },
  featuredLabel: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.md },
  featuredDesc: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.xs },
  priceBtn: { backgroundColor: COLORS.saffron, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  priceBtnDark: { backgroundColor: 'rgba(0,0,0,0.3)' },
  priceText: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.sm },
  cosmeticGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  cosmeticCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: SPACING.xs },
  cosmeticEmoji: { fontSize: 32 },
  cosmeticLabel: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sizes.sm },
  cosmeticPrice: { color: COLORS.gold, fontSize: FONTS.sizes.xs, fontWeight: '700' },
  bucksCard: { flexDirection: 'row', alignItems: 'center', borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, gap: SPACING.md, position: 'relative', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  bucksCardHighlight: { borderColor: COLORS.saffron },
  packTag: { position: 'absolute', top: 8, right: 8, backgroundColor: COLORS.saffron, borderRadius: RADIUS.round, paddingHorizontal: 8, paddingVertical: 2 },
  packTagHighlight: { backgroundColor: 'rgba(255,255,255,0.25)' },
  packTagText: { color: COLORS.white, fontSize: 9, fontWeight: '900' },
  packEmoji: { fontSize: 28 },
  packInfo: { flex: 1 },
  packLabel: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.md },
  packAmount: { color: COLORS.gold, fontSize: FONTS.sizes.xs, fontWeight: '700', marginTop: 2 },
  coinCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, gap: SPACING.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  coinEmoji: { fontSize: 28 },
  seasonBanner: { borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  seasonEmoji: { fontSize: 48 },
  seasonTitle: { color: COLORS.white, fontSize: FONTS.sizes.xxl, fontWeight: '900' },
  seasonSub: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.sm },
  passComparison: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  passCol: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  passColPremium: { borderColor: COLORS.saffron },
  premiumHeader: { padding: SPACING.md, alignItems: 'center' },
  passColTitle: { color: 'rgba(255,255,255,0.5)', fontWeight: '800', fontSize: FONTS.sizes.xs, letterSpacing: 1, padding: SPACING.md, textAlign: 'center' },
  passColTitlePremium: { color: COLORS.white, fontWeight: '900', fontSize: FONTS.sizes.sm },
  perkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.xs, paddingHorizontal: SPACING.sm, paddingVertical: 3 },
  perkCheck: { color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 1 },
  perkText: { color: 'rgba(255,255,255,0.7)', fontSize: 10, flex: 1 },
  buyPassBtn: { borderRadius: RADIUS.xl, overflow: 'hidden', marginBottom: SPACING.md },
  buyPassGrad: { padding: SPACING.xl, alignItems: 'center', gap: SPACING.xs },
  buyPassText: { color: COLORS.white, fontSize: FONTS.sizes.xl, fontWeight: '900' },
  buyPassSub: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.xs },
  noPayWin: { color: 'rgba(255,255,255,0.35)', fontSize: FONTS.sizes.xs, textAlign: 'center', lineHeight: 16 },
});
