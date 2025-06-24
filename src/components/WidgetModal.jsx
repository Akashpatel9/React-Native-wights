import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Animated,
  Dimensions
} from 'react-native';

import { WIDGET_TYPES, WIDGET_SIZES } from '../lib/widgetUtils';
import { COLORS, Z_INDEX } from '../lib/constants';

const { width: screenWidth } = Dimensions.get('window');

// Widget type icons and descriptions
const WIDGET_CONFIG = {
  profile: { 
    icon: '👤', 
    title: 'Profile', 
    description: 'Display your profile information and avatar',
    color: '#007AFF',
    lightColor: 'rgba(0, 122, 255, 0.1)'
  },
  school: { 
    icon: '🏫', 
    title: 'School', 
    description: 'Show your current school and academic info',
    color: '#34C759',
    lightColor: 'rgba(52, 199, 89, 0.1)'
  },
  goals: { 
    icon: '🎯', 
    title: 'Goals', 
    description: 'Track your learning goals and progress',
    color: '#FF9500',
    lightColor: 'rgba(255, 149, 0, 0.1)'
  },
  exam_prep: { 
    icon: '📚', 
    title: 'Exam Prep', 
    description: 'Monitor your exam preparation status',
    color: '#FF3B30',
    lightColor: 'rgba(255, 59, 48, 0.1)'
  },
  trophies: { 
    icon: '🏆', 
    title: 'Trophies', 
    description: 'Showcase your achievements and awards',
    color: '#FFD60A',
    lightColor: 'rgba(255, 214, 10, 0.1)'
  },
  friends: { 
    icon: '👥', 
    title: 'Friends', 
    description: 'Connect with friends and classmates',
    color: '#AF52DE',
    lightColor: 'rgba(175, 82, 222, 0.1)'
  },
  class: { 
    icon: '📖', 
    title: 'Class', 
    description: 'View your current classes and schedule',
    color: '#5AC8FA',
    lightColor: 'rgba(90, 200, 250, 0.1)'
  }
};

const WidgetTypeCard = ({ item, onPress, animatedValue }) => {
  const config = WIDGET_CONFIG[item.type];
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [
          { scale: Animated.multiply(animatedValue, scaleAnim) }
        ],
        opacity: animatedValue,
      }}
    >
      <TouchableOpacity
        onPress={() => onPress(item.type)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        style={{
          backgroundColor: 'white',
          marginVertical: 8,
          marginHorizontal: 4,
          borderRadius: 16,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.05)',
        }}
        accessibilityRole="button"
        accessibilityLabel={`${config.title} widget`}
        accessibilityHint={config.description}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: config.lightColor,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}>
            <Text style={{ fontSize: 24 }}>{config.icon}</Text>
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: COLORS.TEXT_PRIMARY,
              marginBottom: 4,
            }}>
              {config.title}
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.TEXT_SECONDARY,
              lineHeight: 20,
            }}>
              {config.description}
            </Text>
          </View>
          
          <View style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: config.color,
            marginLeft: 12,
          }} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const WidgetTypeSelection = ({ onSelectType }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <Text style={{
          fontSize: 28,
          fontWeight: '800',
          color: COLORS.TEXT_PRIMARY,
          marginBottom: 8,
          textAlign: 'center',
        }}>
          Choose Widget Type
        </Text>
        <Text style={{
          fontSize: 16,
          color: COLORS.TEXT_SECONDARY,
          textAlign: 'center',
          lineHeight: 22,
        }}>
          Select a widget to add to your profile
        </Text>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 400 }}
      >
        {WIDGET_TYPES.map((item, index) => {
          const animatedValue = useRef(new Animated.Value(0)).current;
          
          useEffect(() => {
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: 300,
              delay: index * 100,
              useNativeDriver: true,
            }).start();
          }, []);

          return (
            <WidgetTypeCard
              key={item.type}
              item={item}
              onPress={onSelectType}
              animatedValue={animatedValue}
            />
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

const SizeCard = ({ size, onPress, animatedValue, selectedType }) => {
  const config = WIDGET_CONFIG[selectedType];
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  return (
    <Animated.View
      style={{
        width: '48%',
        transform: [
          { scale: Animated.multiply(animatedValue, scaleAnim) }
        ],
        opacity: animatedValue,
      }}
    >
      <TouchableOpacity
        onPress={() => onPress(size.width, size.height)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        style={{
          backgroundColor: 'white',
          marginVertical: 6,
          borderRadius: 16,
          padding: 20,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 2,
          borderColor: config.color,
        }}
        accessibilityRole="button"
        accessibilityLabel={`${size.label} size`}
        accessibilityHint={`Select ${size.label} size for ${config.title} widget`}
      >
        <Text style={{
          fontSize: 18,
          fontWeight: '700',
          color: config.color,
          marginBottom: 12,
        }}>
          {size.label}
        </Text>
        
        {/* Visual grid representation */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: size.width * 16 + (size.width - 1) * 4,
          height: size.height * 16 + (size.height - 1) * 4,
          marginBottom: 8,
        }}>
          {Array.from({length: size.width * size.height}).map((_, i) => {
            const row = Math.floor(i / size.width);
            const col = i % size.width;
            
            return (
              <View 
                key={i} 
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: config.color,
                  marginLeft: col > 0 ? 4 : 0,
                  marginTop: row > 0 ? 4 : 0,
                  borderRadius: 3,
                  opacity: 0.8,
                }} 
              />
            );
          })}
        </View>
        
        <Text style={{
          fontSize: 12,
          color: COLORS.TEXT_SECONDARY,
          textAlign: 'center',
        }}>
          Grid cells: {size.width} × {size.height}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const SizeSelection = ({ selectedWidgetType, onSelectSize, onBack }) => {
  const config = WIDGET_CONFIG[selectedWidgetType];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <View style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: config.lightColor,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 28 }}>{config.icon}</Text>
        </View>
        
        <Text style={{
          fontSize: 28,
          fontWeight: '800',
          color: COLORS.TEXT_PRIMARY,
          marginBottom: 4,
          textAlign: 'center',
        }}>
          Choose Size
        </Text>
        <Text style={{
          fontSize: 16,
          color: config.color,
          fontWeight: '600',
          marginBottom: 8,
          textAlign: 'center',
        }}>
          {config.title} Widget
        </Text>
        <Text style={{
          fontSize: 14,
          color: COLORS.TEXT_SECONDARY,
          textAlign: 'center',
          lineHeight: 20,
        }}>
          Select the perfect size for your widget
        </Text>
      </View>
      
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
        {WIDGET_SIZES.map((size, index) => {
          const animatedValue = useRef(new Animated.Value(0)).current;
          
          useEffect(() => {
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: 300,
              delay: index * 100,
              useNativeDriver: true,
            }).start();
          }, []);

          return (
            <SizeCard
              key={`${size.width}x${size.height}`}
              size={size}
              onPress={onSelectSize}
              animatedValue={animatedValue}
              selectedType={selectedWidgetType}
            />
          );
        })}
      </View>
      
      <TouchableOpacity
        onPress={onBack}
        style={{
          marginTop: 24,
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 25,
          backgroundColor: 'rgba(0,0,0,0.05)',
        }}
        accessibilityRole="button"
        accessibilityLabel="Go back to widget types"
      >
        <Text style={{ fontSize: 16, marginRight: 4 }}>←</Text>
        <Text style={{
          color: COLORS.TEXT_PRIMARY,
          fontSize: 16,
          fontWeight: '600',
        }}>
          Back to Widget Types
        </Text>
      </TouchableOpacity>
    </Animated.View>
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
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backgroundOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backgroundOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenWidth,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="none" transparent>
      <View style={{
        flex: 1,
        justifyContent: 'flex-end',
      }}>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            opacity: backgroundOpacity,
          }}
        />
        
        <Animated.View style={{
          backgroundColor: '#f8f9fa',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 8,
          paddingBottom: 40,
          paddingHorizontal: 20,
          maxHeight: '85%',
          minHeight: '60%',
          transform: [{ translateX: slideAnim }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 20,
        }}>
          
          {/* Enhanced handle bar */}
          <View style={{
            width: 50,
            height: 5,
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 3,
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
            style={{
              marginTop: 24,
              alignSelf: 'center',
              paddingVertical: 14,
              paddingHorizontal: 28,
              borderRadius: 25,
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: COLORS.DANGER,
              shadowColor: COLORS.DANGER,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
            accessibilityRole="button"
            accessibilityLabel="Cancel and close modal"
          >
            <Text style={{
              color: COLORS.DANGER,
              fontSize: 16,
              fontWeight: '700',
            }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default WidgetModal; 