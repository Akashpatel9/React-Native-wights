import React, { useEffect, useRef } from 'react';
import { View, Modal, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import WidgetContent from './WidgetContent';
import { COLORS, Z_INDEX } from '../lib/constants';

const Widget3DPreview = ({ 
  visible, 
  widget, 
  originalPosition, 
  originalSize,
  ACTUAL_CELL_WIDTH,
  ACTUAL_CELL_HEIGHT,
  TILE_GAP,
  onClose 
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const backgroundOpacityAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  useEffect(() => {
    if (visible) {
      // Reset rotation for entrance
      rotationAnim.setValue(-2);
      
      // Show animation with 3D Touch-like effect
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 120,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(rotationAnim, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          tension: 150,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundOpacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotationAnim, {
          toValue: 2,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim, backgroundOpacityAnim, rotationAnim]);

  if (!widget || !originalPosition || !originalSize) return null;

  // Calculate the preview size (larger than original)
  const previewScale = 1.5;
  const maxPreviewWidth = Math.min(originalSize.width * previewScale, screenWidth * 0.8);
  const maxPreviewHeight = Math.min(originalSize.height * previewScale, screenHeight * 0.8);
  const previewWidth = maxPreviewWidth;
  const previewHeight = maxPreviewHeight;

  // Calculate center position with safe margins
  const safeMargin = 20;
  let centerX = screenWidth / 2 - previewWidth / 2;
  let centerY = screenHeight / 2 - previewHeight / 2;

  // Ensure preview doesn't go off-screen
  centerX = Math.max(safeMargin, Math.min(centerX, screenWidth - previewWidth - safeMargin));
  centerY = Math.max(safeMargin, Math.min(centerY, screenHeight - previewHeight - safeMargin));

  // Calculate initial position (from original widget position)
  const initialX = originalPosition.x + originalSize.width / 2 - previewWidth / 2;
  const initialY = originalPosition.y + originalSize.height / 2 - previewHeight / 2;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Blurred background overlay */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              opacity: backgroundOpacityAnim,
            }}
          />

          {/* 3D Touch Preview Widget */}
          <Animated.View
            style={{
              position: 'absolute',
              left: centerX,
              top: centerY,
              width: previewWidth,
              height: previewHeight,
              backgroundColor: COLORS.WIDGET_BACKGROUND,
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 15,
              transform: [
                {
                  scale: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  })
                },
                // Animate from original position to center
                {
                  translateX: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [initialX - centerX, 0],
                  })
                },
                {
                  translateY: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [initialY - centerY, 0],
                  })
                },
                {
                  rotateZ: rotationAnim.interpolate({
                    inputRange: [-2, 0, 2],
                    outputRange: ['-2deg', '0deg', '2deg'],
                  })
                }
              ],
              opacity: opacityAnim,
            }}
          >
            {/* Enlarged widget content */}
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{ scale: previewScale }],
            }}>
              <WidgetContent widget={widget} />
            </View>

            {/* Subtle glow effect */}
            <View style={{
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              borderRadius: 18,
              borderWidth: 2,
              borderColor: 'rgba(0, 123, 255, 0.3)',
            }} />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Widget3DPreview; 