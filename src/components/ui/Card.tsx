import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  glowColor?: string;
  padded?: boolean;
}

export const Card: React.FC<Props> = ({ children, style, glowColor, padded = true }) => (
  <View style={[
    styles.card,
    padded && styles.padded,
    glowColor && { shadowColor: glowColor, shadowOpacity: 0.5, shadowRadius: 12 },
    style,
  ]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.darkCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
    ...SHADOWS.card,
  },
  padded: {
    padding: SPACING.lg,
  },
});
