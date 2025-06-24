import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { COLORS, Z_INDEX } from '../lib/constants';

const HintBox = ({ hintBox, ACTUAL_CELL_WIDTH, ACTUAL_CELL_HEIGHT, TILE_GAP }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (hintBox) {
      // Animate appearance
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();

      // Start pulse animation for invalid positions
      if (!hintBox.isValid) {
        const pulse = () => {
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 400,
              useNativeDriver: false,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: false,
            }),
          ]).start(pulse);
        };
        pulse();
      }
    } else {
      // Animate disappearance
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          tension: 200,
          friction: 10,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [hintBox, scaleAnim, opacityAnim, pulseAnim]);

  if (!hintBox) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: hintBox.gridX * (ACTUAL_CELL_WIDTH + TILE_GAP) + TILE_GAP,
        top: hintBox.gridY * (ACTUAL_CELL_HEIGHT + TILE_GAP) + TILE_GAP,
        width: ACTUAL_CELL_WIDTH * hintBox.width + (hintBox.width - 1) * TILE_GAP,
        height: ACTUAL_CELL_HEIGHT * hintBox.height + (hintBox.height - 1) * TILE_GAP,
        backgroundColor: hintBox.isValid ? COLORS.HINT_VALID : COLORS.HINT_INVALID,
        borderColor: hintBox.isValid ? COLORS.HINT_BORDER_VALID : COLORS.HINT_BORDER_INVALID,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 10,
        zIndex: Z_INDEX.HINT_BOX,
        transform: [
          { scale: Animated.multiply(scaleAnim, pulseAnim) }
        ],
        opacity: opacityAnim,
      }}
    />
  );
};

export default HintBox; 