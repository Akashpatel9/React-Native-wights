import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const OptionsDropdown = ({ onAddWidget, onEditPress, onToggleMenu, onResetWidgets }) => {
  return (
    <View style={{
      position: 'absolute',
      top: 40,
      right: 0,
      backgroundColor: '#fff',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      minWidth: 120,
      zIndex: 1000,
    }}>
      <TouchableOpacity 
        onPress={() => {
          onAddWidget();
          onToggleMenu();
        }}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#007AFF' }}>Add Widget</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => {
          onEditPress();
          onToggleMenu();
        }}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#007AFF' }}>Edit Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => {
          onResetWidgets();
          onToggleMenu();
        }}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#FF3B30' }}>Remove All</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProfileHeader = ({ onEditPress, onAddWidget, editMode, showOptionsMenu, onToggleMenu, onResetWidgets }) => {
  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 80,
      backgroundColor: '#fff',
      zIndex: 100,
      paddingHorizontal: 10,
      paddingTop: 50,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <TouchableOpacity style={{
          backgroundColor: 'rgba(0,0,0,0.1)', 
          borderRadius: 50, 
          height: 30, 
          width: 30, 
          justifyContent: 'center', 
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 18, color: '#000' }}>{"<"}</Text>
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: '#000',
          marginRight: -62
        }}>Profile</Text>
        
        <View style={{ position: 'relative' }}>
          {editMode ? (
            <TouchableOpacity 
              onPress={onEditPress}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 12,
                backgroundColor: '#34C759',
                borderRadius: 6,
              }}>
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Done ✓</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity 
                onPress={onToggleMenu}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  borderRadius: 6,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{ color: 'black', fontSize: 14, fontWeight: '600', marginRight: 4 }}>Options</Text>
                <Text style={{ color: 'black', fontSize: 12 }}>{showOptionsMenu ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              
              {showOptionsMenu && (
                <OptionsDropdown 
                  onAddWidget={onAddWidget}
                  onEditPress={onEditPress}
                  onToggleMenu={onToggleMenu}
                  onResetWidgets={onResetWidgets}
                />
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader; 