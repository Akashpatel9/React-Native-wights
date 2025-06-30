import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import WidgetContent from './WidgetContent';
import { COLORS, DRAG_SCALE, DRAG_OPACITY, Z_INDEX, ACCESSIBILITY } from '../lib/constants';
import { formatWidgetType } from '../lib/widgetUtils';

const Widget = ({ 
  widget, 
  editMode, 
  onRemove, 
  isDragging, 
  isReturning, 
  pan, 
  animations, 
  ACTUAL_CELL_WIDTH, 
  ACTUAL_CELL_HEIGHT, 
  TILE_GAP,
  onLongPress,
  widgetPosition,
  widgetSize 
}) => {
  const longPressTimeoutRef = useRef(null);
  const previewFeedbackTimeoutRef = useRef(null);

  const handleRemove = () => {
    if (onRemove && widget.id) {
      onRemove(widget.id);
    }
  };

  const handlePressIn = () => {
    // Only trigger 3D touch in normal mode (not edit mode, not dragging, not returning)
    if (!editMode && !isDragging && !isReturning && onLongPress) {
      // Add a small vibration/haptic feedback when long press is about to trigger
      previewFeedbackTimeoutRef.current = setTimeout(() => {
        // Add subtle scale animation to indicate long press is recognized
        if (animations && animations.scale) {
          animations.scale.setValue(0.98);
        }
      }, 300);

      longPressTimeoutRef.current = setTimeout(() => {
        onLongPress(widget, widgetPosition, widgetSize);
      }, 500); // 500ms long press delay
    }
  };

  const handlePressOut = () => {
    // Clear all timeouts if user releases before long press triggers
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    if (previewFeedbackTimeoutRef.current) {
      clearTimeout(previewFeedbackTimeoutRef.current);
      previewFeedbackTimeoutRef.current = null;
    }
    
    // Reset scale animation if it was triggered
    if (animations && animations.scale && !isDragging) {
      animations.scale.setValue(1);
    }
  };

  // Cleanup timeouts when component unmounts or when dragging/edit mode starts
  useEffect(() => {
    if (editMode || isDragging) {
      // Clear timeouts if edit mode is enabled or dragging starts
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }
      if (previewFeedbackTimeoutRef.current) {
        clearTimeout(previewFeedbackTimeoutRef.current);
        previewFeedbackTimeoutRef.current = null;
      }
      // Reset scale
      if (animations && animations.scale) {
        animations.scale.setValue(1);
      }
    }
  }, [editMode, isDragging, animations]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
      if (previewFeedbackTimeoutRef.current) {
        clearTimeout(previewFeedbackTimeoutRef.current);
      }
    };
  }, []);

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={editMode || isDragging || isReturning} // Disable 3D touch in edit/drag/returning modes
      delayLongPress={500}
    >
      <View
        accessible={true}
        accessibilityRole={ACCESSIBILITY.WIDGET_ROLE}
        accessibilityLabel={`${formatWidgetType(widget.type)} widget`}
        accessibilityHint={editMode ? ACCESSIBILITY.WIDGET_HINT : `${ACCESSIBILITY.WIDGET_HINT}. Long press for preview.`}
        accessibilityState={{
          selected: isDragging,
          busy: isReturning,
        }}
        style={{
          flex: 1,
          backgroundColor: isReturning ? COLORS.WIDGET_RETURNING : COLORS.WIDGET_BACKGROUND,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: isDragging ? 2 : isReturning ? 2 : 0,
          borderColor: isDragging ? COLORS.DRAG_BORDER : isReturning ? COLORS.RETURNING_BORDER : 'transparent',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
        
        <WidgetContent widget={widget} />

        {isReturning && (
          <Text style={{fontSize: 10, color: COLORS.RETURNING_BORDER, marginTop: 2}}>
            Space occupied!
          </Text>
        )}

        {editMode && onRemove && !isDragging && (
          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${formatWidgetType(widget.type)} widget`}
            accessibilityHint={ACCESSIBILITY.REMOVE_BUTTON_HINT}
            onPress={handleRemove}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              backgroundColor: COLORS.REMOVE_BUTTON,
              borderRadius: 10,
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: Z_INDEX.REMOVE_BUTTON,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Widget; 