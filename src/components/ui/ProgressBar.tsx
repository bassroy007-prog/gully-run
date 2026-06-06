import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, FONTS } from '../../constants/theme';

interface Props {
  value: number;
  max: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<Props> = ({
  value, max, color = COLORS.saffron, height = 8, showLabel, label,
}) => {
  const pct = Math.min(1, Math.max(0, value / max));
  return (
    <View>
      {(showLabel || label) && (
        <Text style={styles.label}>{label || `${Math.floor(pct * 100)}%`}</Text>
      )}
      <View style={[styles.track, { height }]}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color, height }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.round,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: RADIUS.round,
  },
  label: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    marginBottom: 3,
    opacity: 0.7,
  },
});
