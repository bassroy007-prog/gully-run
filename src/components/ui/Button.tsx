import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  emoji?: string;
}

const GRADIENTS = {
  primary: [COLORS.saffron, COLORS.saffronDark] as const,
  secondary: [COLORS.teal, COLORS.tealDark] as const,
  gold: [COLORS.gold, COLORS.goldDark] as const,
  danger: ['#F44336', '#C62828'] as const,
  ghost: ['transparent', 'transparent'] as const,
};

export const Button: React.FC<Props> = ({
  label, onPress, variant = 'primary', size = 'md',
  disabled, loading, style, textStyle, emoji,
}) => {
  const pad = size === 'sm' ? SPACING.sm : size === 'lg' ? SPACING.xl : SPACING.md;
  const fontSize = size === 'sm' ? FONTS.sizes.sm : size === 'lg' ? FONTS.sizes.xl : FONTS.sizes.md;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.8} style={style}>
      <LinearGradient
        colors={disabled ? ['#555', '#333'] : GRADIENTS[variant]}
        style={[styles.base, { paddingVertical: pad, paddingHorizontal: pad * 2 }, variant === 'ghost' && styles.ghost]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <Text style={[styles.label, { fontSize }, variant === 'ghost' && styles.ghostLabel, textStyle]}>
            {emoji ? `${emoji} ` : ''}{label}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...SHADOWS.card,
  },
  ghost: {
    borderWidth: 1.5,
    borderColor: COLORS.saffron,
  },
  label: {
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ghostLabel: {
    color: COLORS.saffron,
  },
});
