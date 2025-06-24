import React from 'react';
import { View, Text } from 'react-native';

const WidgetContent = ({ widget }) => {
  switch (widget.type) {
    case 'profile':
      return (
        <View style={{ flex: 1, padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '#E0E0E0',
              marginRight: 12,
              overflow: 'hidden',
            }}>
              <View style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#C4A484',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 20, color: '#8B6F47' }}>👤</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 12,
                color: '#666',
                marginBottom: 2,
              }}>ENTER NAME HERE</Text>
              <Text style={{
                fontSize: 10,
                color: '#999',
                numberOfLines: 2,
              }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the...</Text>
            </View>
            <View style={{
              backgroundColor: '#E8E8E8',
              paddingHorizontal: 8,
              paddingVertical: 6,
              borderRadius: 6,
            }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#000' }}>CLASS</Text>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#000',
                textAlign: 'center',
              }}>8</Text>
            </View>
          </View>
        </View>
      );

    case 'school':
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 16 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'left',
            lineHeight: 22,
          }}>THE MOTHER'S{'\n'}INTERNATIONAL SCHOOL</Text>
        </View>
      );

    case 'goals':
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 32, color: '#000' }}>🎯</Text>
          <Text style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: '#000',
            marginTop: 8,
          }}>MY GOALS</Text>
        </View>
      );

    case 'exam_prep':
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 12 }}>
          <Text style={{
            fontSize: 12,
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'center',
            lineHeight: 16,
          }}>PREPARING FOR{'\n'}JEE MAINS</Text>
        </View>
      );

    case 'trophies':
      return (
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#000',
            marginBottom: 12,
          }}>MY TROPHIES</Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            {[1, 2, 3].map((_, i) => (
              <Text key={i} style={{ fontSize: 28, color: '#FFD700' }}>🏆</Text>
            ))}
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            {[1, 2, 3].map((_, i) => (
              <Text key={i} style={{ fontSize: 28, color: '#FFD700' }}>🏆</Text>
            ))}
          </View>
        </View>
      );

    case 'friends':
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 12 }}>
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            {[1, 2].map((_, i) => (
              <View key={i} style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#FFB6C1',
                marginHorizontal: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 10, color: '#FF69B4' }}>👤</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {[1, 2, 3].map((_, i) => (
              <View key={i} style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#FFB6C1',
                marginHorizontal: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 10, color: '#FF69B4' }}>👤</Text>
              </View>
            ))}
          </View>
          <Text style={{
            fontSize: 12,
            fontWeight: 'bold',
            color: '#000',
            marginTop: 8,
          }}>FRIENDS</Text>
        </View>
      );

    default:
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{widget.type.toUpperCase()}</Text>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 4 }}>Content for {widget.type}</Text>
        </View>
      );
  }
};

export default WidgetContent; 