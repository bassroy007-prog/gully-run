import React from 'react';
import { Modal as RNModal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<Props> = ({ visible, onClose, title, children }) => (
  <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
      <TouchableOpacity activeOpacity={1} onPress={() => {}}>
        <View style={styles.container}>
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          {children}
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  </RNModal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: COLORS.darkCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.saffron,
    padding: SPACING.xl,
    minWidth: 300,
    maxWidth: 360,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
  },
  close: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xl,
    opacity: 0.6,
  },
});
