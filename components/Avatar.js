import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, roleColor } from '../theme/theme';
import { getInitial } from '../lib/format';

// Circular avatar. Shows the profile photo when `uri` is set (profile photos
// arrive in a later phase); otherwise an initial on the role's accent color.
export default function Avatar({ name, role = 'driver', uri, size = 44, ring = false }) {
  const circle = { width: size, height: size, borderRadius: size / 2 };
  const inner = uri ? (
    <Image source={{ uri }} style={[circle, styles.image]} accessibilityIgnoresInvertColors />
  ) : (
    <View style={[circle, styles.fallback, { backgroundColor: roleColor(role) }]}>
      <Text style={[styles.initial, { fontSize: Math.round(size * 0.4) }]}>{getInitial(name)}</Text>
    </View>
  );

  if (!ring) {
    return inner;
  }
  const ringSize = size + 6;
  return (
    <View
      style={[
        styles.ring,
        { width: ringSize, height: ringSize, borderRadius: ringSize / 2, borderColor: roleColor(role) },
      ]}
    >
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceRaised,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: colors.textOnAccent,
    fontWeight: '700',
  },
  ring: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
