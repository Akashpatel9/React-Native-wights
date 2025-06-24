import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';

import { WIDGET_TYPES, WIDGET_SIZES } from '../lib/widgetUtils';

const WidgetTypeSelection = ({ onSelectType }) => {
  return (
    <>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
      }}>
        Choose Widget Type
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {WIDGET_TYPES.map((item) => (
          <TouchableOpacity
            key={item.type}
            onPress={() => onSelectType(item.type)}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 16,
              backgroundColor: '#f8f9fa',
              marginVertical: 4,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#E0E0E0',
            }}>
            <Text style={{fontSize: 16, fontWeight: '600', color: '#333'}}>
              {item.type.replace('_', ' ').toUpperCase()}
            </Text>
            <Text style={{fontSize: 12, color: '#666', marginTop: 2}}>
              Tap to select and choose size
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
};

const SizeSelection = ({ selectedWidgetType, onSelectSize, onBack }) => {

  return (
    <>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
      }}>
        Choose Size
      </Text>
      <Text style={{
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
      }}>
        for {selectedWidgetType.replace('_', ' ').toUpperCase()} widget
      </Text>
      
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
        {WIDGET_SIZES.map((size) => (
          <TouchableOpacity
            key={`${size.width}x${size.height}`}
            onPress={() => onSelectSize(size.width, size.height)}
            style={{
              width: '48%',
              paddingVertical: 20,
              paddingHorizontal: 16,
              backgroundColor: '#007AFF',
              marginVertical: 6,
              borderRadius: 12,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16, fontWeight: '600', color: 'white'}}>
              {size.label}
            </Text>
            <View style={{
              flexDirection: 'row',
              marginTop: 8,
            }}>
              {Array.from({length: size.width * size.height}).map((_, i) => (
                <View key={i} style={{
                  width: 12,
                  height: 12,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  margin: 1,
                  borderRadius: 2,
                }} />
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity
        onPress={onBack}
        style={{marginTop: 20, alignSelf: 'center'}}>
        <Text style={{color: '#007AFF', fontSize: 16, fontWeight: '600'}}>← Back to Widget Types</Text>
      </TouchableOpacity>
    </>
  );
};

const WidgetModal = ({ 
  visible, 
  selectedWidgetType, 
  onSelectType, 
  onSelectSize, 
  onClose, 
  onBack 
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
      }}>
        <View style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 20,
          paddingBottom: 40,
          paddingHorizontal: 20,
          maxHeight: '70%',
        }}>
          
          {/* Handle bar */}
          <View style={{
            width: 40,
            height: 4,
            backgroundColor: '#E0E0E0',
            borderRadius: 2,
            alignSelf: 'center',
            marginBottom: 20,
          }} />

          {!selectedWidgetType ? (
            <WidgetTypeSelection onSelectType={onSelectType} />
          ) : (
            <SizeSelection 
              selectedWidgetType={selectedWidgetType}
              onSelectSize={onSelectSize}
              onBack={onBack}
            />
          )}
          
          <TouchableOpacity
            onPress={onClose}
            style={{marginTop: 20, alignSelf: 'center'}}>
            <Text style={{color: '#FF3B30', fontSize: 16, fontWeight: '600'}}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default WidgetModal; 