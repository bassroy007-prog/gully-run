import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePlayerStore } from '../store/playerStore';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

interface Props {
  onComplete: () => void;
}

const STARTER_HEROES = [
  { id: 'dabbawala', emoji: '🍱', name: 'Dabbawala Raj', desc: 'Earn 5% more coins' },
  { id: 'fisherwoman', emoji: '🐟', name: 'Meera Koli', desc: 'Earn 5% more XP' },
];

export const OnboardingScreen: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedHero, setSelectedHero] = useState('dabbawala');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const player = usePlayerStore();

  const goNext = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setStep(s => s + 1);
  };

  const handleFinish = async () => {
    const finalName = name.trim() || 'Runner';
    player.setName(finalName);
    player.setSelectedHero(selectedHero);
    await AsyncStorage.setItem('onboarding_done', 'true');
    await player.saveState();
    onComplete();
  };

  const slides = [
    {
      emoji: '🏙️',
      title: 'Welcome to\nMumbai!',
      subtitle: 'The city that never sleeps.\nCan you run its streets?',
      cta: "Let's Go →",
      action: goNext,
    },
    {
      emoji: '🏃',
      title: 'Swipe to Run!',
      subtitle: '← → Change lanes\n↑ Jump over obstacles\n↓ Slide under barriers',
      cta: 'Got it! →',
      action: goNext,
    },
    {
      emoji: '🦸',
      title: 'Build Your Empire',
      subtitle: 'Collect heroes, build businesses,\njoin guilds, and dominate\nthe Mumbai leaderboard!',
      cta: "I'm Ready! →",
      action: goNext,
    },
  ];

  if (step < slides.length) {
    const slide = slides[step];
    return (
      <LinearGradient colors={['#0A0A1A', '#1A0520']} style={styles.container}>
        <Animated.View style={[styles.slide, { opacity: fadeAnim }]}>
          <View style={styles.dots}>
            {slides.map((_, i) => (
              <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
            ))}
          </View>
          <Text style={styles.slideEmoji}>{slide.emoji}</Text>
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={slide.action}>
            <LinearGradient colors={[COLORS.saffron, COLORS.saffronDark]} style={styles.ctaGrad}>
              <Text style={styles.ctaText}>{slide.cta}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    );
  }

  if (step === slides.length) {
    return (
      <LinearGradient colors={['#0A0A1A', '#1A0520']} style={styles.container}>
        <View style={styles.nameStep}>
          <Text style={styles.nameTitle}>What's your name,{'\n'}Runner?</Text>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            maxLength={20}
            autoFocus
          />
          <TouchableOpacity style={styles.ctaBtn} onPress={goNext} disabled={!name.trim()}>
            <LinearGradient
              colors={name.trim() ? [COLORS.saffron, COLORS.saffronDark] : ['#555', '#333']}
              style={styles.ctaGrad}
            >
              <Text style={styles.ctaText}>Next →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0A0A1A', '#1A0520']} style={styles.container}>
      <View style={styles.heroStep}>
        <Text style={styles.heroStepTitle}>Choose Your\nStarter Hero</Text>
        <Text style={styles.heroStepSub}>You can unlock all heroes as you play!</Text>
        <View style={styles.heroChoices}>
          {STARTER_HEROES.map(h => (
            <TouchableOpacity
              key={h.id}
              style={[styles.heroChoice, selectedHero === h.id && styles.heroChoiceSelected]}
              onPress={() => setSelectedHero(h.id)}
            >
              <Text style={styles.heroChoiceEmoji}>{h.emoji}</Text>
              <Text style={styles.heroChoiceName}>{h.name}</Text>
              <Text style={styles.heroChoiceDesc}>{h.desc}</Text>
              {selectedHero === h.id && <View style={styles.checkmark}><Text style={styles.checkText}>✓</Text></View>}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.ctaBtn} onPress={handleFinish}>
          <LinearGradient colors={[COLORS.saffron, COLORS.saffronDark]} style={styles.ctaGrad}>
            <Text style={styles.ctaText}>START RUNNING! 🏃</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  slide: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', gap: SPACING.xl },
  dots: { flexDirection: 'row', gap: 8, position: 'absolute', top: 60 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { backgroundColor: COLORS.saffron, width: 24 },
  slideEmoji: { fontSize: 80 },
  slideTitle: { color: COLORS.white, fontSize: FONTS.sizes.xxxl, fontWeight: '900', textAlign: 'center', lineHeight: 40 },
  slideSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: FONTS.sizes.lg, textAlign: 'center', lineHeight: 28 },
  ctaBtn: { width: '80%', borderRadius: RADIUS.round, overflow: 'hidden' },
  ctaGrad: { paddingVertical: SPACING.lg, alignItems: 'center' },
  ctaText: { color: COLORS.white, fontSize: FONTS.sizes.xl, fontWeight: '900', letterSpacing: 1 },
  nameStep: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', gap: SPACING.xl },
  nameTitle: { color: COLORS.white, fontSize: FONTS.sizes.xxxl, fontWeight: '900', textAlign: 'center', lineHeight: 42 },
  nameInput: { width: '90%', backgroundColor: COLORS.darkCard, borderRadius: RADIUS.lg, padding: SPACING.lg, color: COLORS.white, fontSize: FONTS.sizes.xl, borderWidth: 1.5, borderColor: COLORS.saffron, textAlign: 'center', fontWeight: '700' },
  heroStep: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', gap: SPACING.xl },
  heroStepTitle: { color: COLORS.white, fontSize: FONTS.sizes.xxxl, fontWeight: '900', textAlign: 'center', lineHeight: 42 },
  heroStepSub: { color: 'rgba(255,255,255,0.5)', fontSize: FONTS.sizes.sm, textAlign: 'center' },
  heroChoices: { flexDirection: 'row', gap: SPACING.lg },
  heroChoice: { flex: 1, backgroundColor: COLORS.darkCard, borderRadius: RADIUS.xl, padding: SPACING.lg, alignItems: 'center', gap: SPACING.sm, borderWidth: 2, borderColor: COLORS.darkBorder, position: 'relative' },
  heroChoiceSelected: { borderColor: COLORS.saffron, backgroundColor: `${COLORS.saffron}22` },
  heroChoiceEmoji: { fontSize: 40 },
  heroChoiceName: { color: COLORS.white, fontWeight: '800', fontSize: FONTS.sizes.sm, textAlign: 'center' },
  heroChoiceDesc: { color: 'rgba(255,255,255,0.5)', fontSize: FONTS.sizes.xs, textAlign: 'center' },
  checkmark: { position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.saffron, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: COLORS.white, fontSize: 12, fontWeight: '900' },
});
