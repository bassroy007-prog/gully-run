import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAudioInit } from './src/audio/useAudio';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null };
  componentDidCatch(error: Error, _info: ErrorInfo) {
    this.setState({ error: `${error.name}: ${error.message}\n${error.stack}` });
  }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, backgroundColor: '#0A0A1A', padding: 20, paddingTop: 60 }}>
          <Text style={{ color: '#FF6B35', fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
            Crash Report
          </Text>
          <ScrollView>
            <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'monospace' }}>
              {this.state.error}
            </Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { usePlayerStore } from './src/store/playerStore';
import { useHeroStore } from './src/store/heroStore';
import { useCityStore } from './src/store/cityStore';

type AppState = 'loading' | 'onboarding' | 'game';

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  useAudioInit();
  const loadPlayer = usePlayerStore(s => s.loadState);
  const loadHeroes = useHeroStore(s => s.loadState);
  const loadCity = useCityStore(s => s.loadState);

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadPlayer(), loadHeroes(), loadCity()]);
      const done = await AsyncStorage.getItem('onboarding_done');
      setAppState(done ? 'game' : 'onboarding');
    };
    init();
  }, []);

  if (appState === 'loading') {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashEmoji}>🏃</Text>
        <Text style={styles.splashTitle}>GULLY RUN</Text>
        <Text style={styles.splashSub}>Mumbai Chapter</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        {appState === 'onboarding' ? (
          <OnboardingScreen onComplete={() => setAppState('game')} />
        ) : (
          <AppNavigator />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#0A0A1A',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  splashEmoji: { fontSize: 80 },
  splashTitle: {
    color: '#FF6B35',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 6,
  },
  splashSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    letterSpacing: 4,
  },
});
