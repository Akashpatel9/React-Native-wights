import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import WidgetContent from './WidgetContent';
import { COLORS, DRAG_SCALE, DRAG_OPACITY, Z_INDEX, ACCESSIBILITY } from '../lib/constants';
import { formatWidgetType } from '../lib/widgetUtils';

const Widget = ({ widget, editMode, onRemove, isDragging, isReturning, pan, animations, ACTUAL_CELL_WIDTH, ACTUAL_CELL_HEIGHT, TILE_GAP }) => {
  const handleRemove = () => {
    if (onRemove && widget.id) {
      onRemove(widget.id);
    }
  };

  return (
    <View
      accessible={true}
      accessibilityRole={ACCESSIBILITY.WIDGET_ROLE}
      accessibilityLabel={`${formatWidgetType(widget.type)} widget`}
      accessibilityHint={ACCESSIBILITY.WIDGET_HINT}
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
  );
};

export default Widget; 