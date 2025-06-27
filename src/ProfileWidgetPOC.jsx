import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

// Import components
import ProfileHeader from './components/ProfileHeader';
import Widget from './components/Widget';
import GridVisualization from './components/GridVisualization';
import HintBox from './components/HintBox';
import WidgetModal from './components/WidgetModal';

// Import utilities and constants
import {
  GRID_COLUMNS,
  GRID_ROWS,
  TILE_GAP,
  SCREEN_WIDTH as screenWidth,
  ACTUAL_CELL_WIDTH,
  ACTUAL_CELL_HEIGHT,
  DRAG_THRESHOLD,
  FREED_CELLS_DURATION,
  COLORS,
  Z_INDEX,
} from './lib/constants';

import {
  isCellFree,
  findFreeCell,
  calculateOccupancyPercentage,
  getWidgetCells,
  analyzeGridSpace,
} from './lib/gridUtils';

import {
  generateWidgetId,
  createWidget,
  findWidgetById,
  removeWidgetById,
  updateWidgetPosition,
  WIDGET_TYPES,
  WIDGET_SIZES,
} from './lib/widgetUtils';

import {
  calculateGridDelta,
  calculateNewGridPosition,
  createHintBox,
  shouldStartDrag,
} from './lib/dragUtils';

import { logger } from './lib/logger';
import { feedback } from './lib/feedback';
import { useMultipleTimeouts } from './lib/hooks';

// Empty State Component
const EmptyState = () => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();

    // Continuous floating animation
    const float = () => {
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]).start(float);
    };
    float();

    // Subtle pulse for the CTA button
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]).start(pulse);
    };
    pulse();

    // Shimmer effect
    const shimmer = () => {
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start(() => {
        shimmerAnim.setValue(0);
        shimmer();
      });
    };
    shimmer();
  }, [scaleAnim, opacityAnim, floatAnim, pulseAnim, shimmerAnim]);

  return (
    <Animated.View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 30,
      transform: [
        { scale: scaleAnim },
        { translateY: floatAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8]
        })}
      ],
      opacity: opacityAnim,
    }}>
      {/* Background gradient effect */}
      <View style={{
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: COLORS.ACCENT_LIGHT,
        opacity: 0.3,
      }} />
      
      {/* Main card */}
      <View style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,123,255,0.1)',
        maxWidth: 340,
        width: '100%',
      }}>
        {/* Animated icon */}
        <Animated.View style={{
          marginBottom: 20,
          transform: [{ scale: pulseAnim }]
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(0,123,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
            marginBottom: 10,
          }}>
            <Text style={{ fontSize: 36 }}>🎯</Text>
          </View>
        </Animated.View>

        <Text style={{
          fontSize: 28,
          fontWeight: '700',
          color: COLORS.TEXT_PRIMARY,
          marginBottom: 12,
          textAlign: 'center',
          letterSpacing: -0.5,
        }}>
          Welcome to Your Profile!
        </Text>
        
        <Text style={{
          fontSize: 16,
          color: COLORS.TEXT_SECONDARY,
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 30,
          fontWeight: '400',
        }}>
          Transform your profile into a personalized dashboard with interactive widgets
        </Text>
        
        {/* CTA Button with shimmer */}
        <Animated.View style={{
          backgroundColor: COLORS.PRIMARY,
          paddingHorizontal: 24,
          paddingVertical: 16,
          borderRadius: 16,
          marginBottom: 25,
          transform: [{ scale: pulseAnim }],
          shadowColor: COLORS.PRIMARY,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
          overflow: 'hidden',
        }}>
          {/* Shimmer overlay */}
          <Animated.View style={{
          position: 'absolute',
            top: 0,
            left: shimmerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, 300]
            }),
            width: 100,
            height: '100%',
            backgroundColor: 'rgba(255,255,255,0.3)',
            transform: [{ skewX: '-20deg' }],
          }} />
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>✨</Text>
            <Text style={{
              fontSize: 16,
              color: '#FFFFFF',
              textAlign: 'center',
              fontWeight: '600',
            }}>
              Tap the + button to get started
            </Text>
          </View>
        </Animated.View>
        
        {/* Widget preview cards */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: 20,
        }}>
          {[
            { emoji: '👤', name: 'Profile', color: '#FF6B6B' },
            { emoji: '📊', name: 'Stats', color: '#4ECDC4' },
            { emoji: '📱', name: 'Activity', color: '#45B7D1' },
          ].map((widget, index) => (
            <Animated.View
              key={widget.name}
        style={{
                backgroundColor: widget.color + '15',
                borderRadius: 12,
                padding: 12,
          alignItems: 'center',
                flex: 1,
                marginHorizontal: 4,
                borderWidth: 1,
                borderColor: widget.color + '30',
                transform: [{
                  translateY: floatAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, index % 2 === 0 ? -4 : 4]
                  })
                }]
              }}
            >
              <Text style={{ fontSize: 20, marginBottom: 4 }}>{widget.emoji}</Text>
              <Text style={{
                fontSize: 11,
                color: widget.color,
                fontWeight: '600',
                textAlign: 'center',
              }}>
                {widget.name}
              </Text>
            </Animated.View>
          ))}
        </View>
        
        <Text style={{
          fontSize: 13,
          color: COLORS.TEXT_MUTED,
          textAlign: 'center',
          lineHeight: 18,
          fontStyle: 'italic',
        }}>
          Drag, drop, and customize to make it yours
        </Text>
      </View>
    </Animated.View>
  );
};

export default function ProfileWidgetResizable() {
  const [widgets, setWidgets] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWidgetType, setSelectedWidgetType] = useState(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [draggingId, setDraggingId] = useState(null);
  const [hintBox, setHintBox] = useState(null);
  const [returningId, setReturningId] = useState(null);
  const [recentlyFreed, setRecentlyFreed] = useState([]);
  
  // Refs for pan responders and animation values
  const panRefs = useRef({});

  // Refs to avoid stale closures
  const editModeRef = useRef(editMode);
  const draggingIdRef = useRef(draggingId);
  
  // Custom hooks for better timeout management
  const timeouts = useMultipleTimeouts();

  // Update refs whenever state changes
  useEffect(() => {
    editModeRef.current = editMode;
  }, [editMode]);

  useEffect(() => {
    draggingIdRef.current = draggingId;
  }, [draggingId]);

  // Calculate total occupied cells for better empty state logic
  const occupancyPercentage = calculateOccupancyPercentage(widgets, GRID_COLUMNS, GRID_ROWS);

  const addWidget = useCallback((type, w, h) => {
    logger.widget.add(type, { width: w, height: h }, { x: '?', y: '?' });
    const freeCell = findFreeCell(w, h, widgets, null, GRID_COLUMNS, GRID_ROWS);
    
    if (!freeCell) {
      logger.warn(`No free space found for ${type} ${w}x${h}`);
      
      // Analyze grid space for detailed feedback
      const spaceInfo = analyzeGridSpace(widgets, WIDGET_SIZES, GRID_COLUMNS, GRID_ROWS);
      feedback.widget.noSpace(type, `${w}×${h}`, spaceInfo);
      return;
    }
    
    logger.widget.add(type, { width: w, height: h }, freeCell);
    const newWidget = createWidget(type, w, h, freeCell.x, freeCell.y);
    setWidgets(prev => {
      const newWidgets = [...prev, newWidget];
      logger.debug(`New widgets array:`, newWidgets);
      return newWidgets;
    });
    logger.debug('Closing modal and resetting selection');
    setModalVisible(false);
    setSelectedWidgetType(null);
  }, [widgets]);

  const handleWidgetTypeSelection = useCallback((type) => {
    logger.debug(`Selected widget type: ${type}`);
    setSelectedWidgetType(type);
  }, []);

  const handleSizeSelection = useCallback((width, height) => {
    logger.debug(`Selected size: ${width}x${height}, selectedWidgetType: ${selectedWidgetType}`);
    if (selectedWidgetType) {
      addWidget(selectedWidgetType, width, height);
    } else {
      logger.warn('No widget type selected!');
    }
  }, [selectedWidgetType, addWidget]);

  const removeWidget = useCallback((id) => {
    const widgetToRemove = findWidgetById(widgets, id);
    if (!widgetToRemove) {
      logger.warn(`Widget ${id} not found for removal`);
      return;
    }

    logger.widget.remove(id, widgetToRemove.type);
    
    const animations = animationRefs.current[id];
    
    // Animate widget removal
    if (animations) {
      Animated.parallel([
        Animated.spring(animations.scale, {
          toValue: 0,
          tension: 200,
          friction: 10,
          useNativeDriver: false,
        }),
        Animated.timing(animations.opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(animations.rotation, {
          toValue: 180, // Spin while disappearing
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start(() => {
        // After animation completes, remove the widget
        setWidgets(prev => removeWidgetById(prev, id));
        
      // Mark the freed cells
        const freedCells = getWidgetCells(widgetToRemove);
      setRecentlyFreed(freedCells);
        timeouts.setTimeout('clearFreedCells', () => setRecentlyFreed([]), FREED_CELLS_DURATION);
        
        // Clear any active states for this widget
        if (draggingIdRef.current === id) {
          setDraggingId(null);
          draggingIdRef.current = null;
        }
        if (returningId === id) {
          setReturningId(null);
        }
        setHintBox(null);
        
        // Clean up animation refs
        delete animationRefs.current[id];
      delete panRefs.current[id];
        delete panResponders.current[id];
      });
    } else {
      // Fallback if no animations
      setWidgets(prev => removeWidgetById(prev, id));
      const freedCells = getWidgetCells(widgetToRemove);
      setRecentlyFreed(freedCells);
      timeouts.setTimeout('clearFreedCells', () => setRecentlyFreed([]), FREED_CELLS_DURATION);
      
    if (draggingId === id) {
      setDraggingId(null);
    }
    if (returningId === id) {
      setReturningId(null);
    }
    setHintBox(null);
    }
  }, [widgets, draggingId, returningId, timeouts]);

  const resetAllWidgets = useCallback(() => {
    const widgetCount = widgets.length;
    
    feedback.widget.confirmReset(widgetCount, () => {
      logger.debug(`Resetting all ${widgetCount} widgets`);
      
      if (widgetCount === 0) {
        return; // Nothing to reset
      }

      // Animate all widgets out simultaneously
      const animationPromises = widgets.map(widget => {
        const animations = animationRefs.current[widget.id];
        
        if (animations) {
          return new Promise(resolve => {
            Animated.parallel([
              Animated.spring(animations.scale, {
                toValue: 0,
                tension: 200,
                friction: 10,
                useNativeDriver: false,
              }),
              Animated.timing(animations.opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }),
              Animated.timing(animations.rotation, {
                toValue: 360, // Full spin
                duration: 300,
                useNativeDriver: false,
              }),
            ]).start(() => resolve());
          });
        } else {
          return Promise.resolve();
        }
      });

      // Wait for all animations to complete, then clear everything
      Promise.all(animationPromises).then(() => {
        // Clear all widgets
        setWidgets([]);
        
        // Clear all states
        setDraggingId(null);
        draggingIdRef.current = null;
        setReturningId(null);
        setHintBox(null);
        setRecentlyFreed([]);
        
        // Clear all animation refs and pan responders
        animationRefs.current = {};
        panRefs.current = {};
        panResponders.current = {};
        
        // Clear any pending timeouts
        timeouts.clearAll();
        
        logger.debug('All widgets reset successfully');
      });
    });
  }, [widgets, timeouts]);

  // Create pan responder for each widget - using refs to avoid stale closures
  const createPanResponder = useCallback((widgetId) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => {
        const currentEditMode = editModeRef.current;
        const currentDraggingId = draggingIdRef.current;
        const shouldStart = currentEditMode && currentDraggingId === null;
        logger.widget.drag(widgetId, 'START_SHOULD_SET', { editMode: currentEditMode, draggingId: currentDraggingId, shouldStart });
        return shouldStart;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const currentEditMode = editModeRef.current;
        const currentDraggingId = draggingIdRef.current;
        const shouldMove = currentEditMode && 
                          currentDraggingId === widgetId && 
                          (Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2);
        logger.widget.drag(widgetId, 'MOVE_SHOULD_SET', { editMode: currentEditMode, draggingId: currentDraggingId, shouldMove, dx: gestureState.dx, dy: gestureState.dy });
        return shouldMove;
      },
      onPanResponderGrant: () => {
        logger.widget.drag(widgetId, 'GRANT', {});
        setDraggingId(widgetId);
        draggingIdRef.current = widgetId;
        
        const pan = panRefs.current[widgetId];
        const animations = animationRefs.current[widgetId];
        
        if (pan) {
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value,
          });
          pan.setValue({x: 0, y: 0});
        }
        
        // Animate drag start - scale up and increase elevation
        if (animations) {
          Animated.parallel([
            Animated.spring(animations.scale, {
              toValue: 1.1,
              tension: 150,
              friction: 7,
              useNativeDriver: false,
            }),
            Animated.timing(animations.elevation, {
              toValue: 10,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(animations.rotation, {
              toValue: 2, // Slight rotation for dynamic feel
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start();
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const pan = panRefs.current[widgetId];
        if (!pan) return;

        // Update animated value
        pan.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });

        // Update hint box occasionally to avoid performance issues
        if (Math.abs(gestureState.dx) % 8 === 0 || Math.abs(gestureState.dy) % 8 === 0) {
          setWidgets(currentWidgets => {
            const currentWidget = findWidgetById(currentWidgets, widgetId);
            if (!currentWidget) return currentWidgets;

            const {deltaX, deltaY} = calculateGridDelta(
              gestureState.dx, 
              gestureState.dy, 
              ACTUAL_CELL_WIDTH, 
              ACTUAL_CELL_HEIGHT, 
              TILE_GAP
            );
            
            const {newGridX, newGridY} = calculateNewGridPosition(
              currentWidget.gridX,
              currentWidget.gridY,
              deltaX,
              deltaY,
              currentWidget.width,
              currentWidget.height,
              GRID_COLUMNS,
              GRID_ROWS
            );

            if (newGridX !== currentWidget.gridX || newGridY !== currentWidget.gridY) {
              const isValid = isCellFree(newGridX, newGridY, currentWidget.width, currentWidget.height, currentWidgets, currentWidget.id, GRID_COLUMNS, GRID_ROWS);
              setHintBox(createHintBox(newGridX, newGridY, currentWidget.width, currentWidget.height, isValid));
    } else {
              setHintBox(null);
            }

            return currentWidgets; // Don't modify widgets during move
          });
        }
      },
            onPanResponderRelease: (evt, gestureState) => {
        logger.widget.drag(widgetId, 'RELEASE', {});
        const pan = panRefs.current[widgetId];
        const animations = animationRefs.current[widgetId];
        
        // Handle drop logic with fresh widget data
        setWidgets(currentWidgets => {
          const currentWidget = findWidgetById(currentWidgets, widgetId);
          if (!currentWidget) {
            logger.error(`Widget ${widgetId} not found during release`);
            return currentWidgets;
          }

          const {deltaX, deltaY} = calculateGridDelta(
            gestureState.dx, 
            gestureState.dy, 
            ACTUAL_CELL_WIDTH, 
            ACTUAL_CELL_HEIGHT, 
            TILE_GAP
          );
          
          const {newGridX, newGridY} = calculateNewGridPosition(
            currentWidget.gridX,
            currentWidget.gridY,
            deltaX,
            deltaY,
            currentWidget.width,
            currentWidget.height,
            GRID_COLUMNS,
            GRID_ROWS
          );

          if (newGridX !== currentWidget.gridX || newGridY !== currentWidget.gridY) {
            const isValidPosition = isCellFree(newGridX, newGridY, currentWidget.width, currentWidget.height, currentWidgets, currentWidget.id, GRID_COLUMNS, GRID_ROWS);
            
            if (isValidPosition) {
              // Valid drop - immediate update with smooth scale back animation
              logger.widget.move(currentWidget.id, { x: currentWidget.gridX, y: currentWidget.gridY }, { x: newGridX, y: newGridY });
              const freedCells = getWidgetCells(currentWidget);
              setRecentlyFreed(freedCells);
              timeouts.setTimeout('clearFreedCells', () => setRecentlyFreed([]), FREED_CELLS_DURATION);
              
              // Reset pan immediately and animate scale/elevation back to normal
              if (pan) {
                pan.flattenOffset();
                pan.setValue({x: 0, y: 0});
              }
              
              if (animations) {
                Animated.parallel([
                  Animated.spring(animations.scale, {
                    toValue: 1,
                    tension: 150,
                    friction: 7,
                    useNativeDriver: false,
                  }),
                  Animated.timing(animations.elevation, {
                    toValue: 2,
                    duration: 200,
                    useNativeDriver: false,
                  }),
                  Animated.timing(animations.rotation, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                  }),
                ]).start();
              }
              
              return updateWidgetPosition(currentWidgets, currentWidget.id, newGridX, newGridY);
      } else {
              // Invalid drop - animate return to original position
              logger.widget.drag(currentWidget.id, 'INVALID_MOVE', { from: { x: currentWidget.gridX, y: currentWidget.gridY }, to: { x: newGridX, y: newGridY } });
              setReturningId(currentWidget.id);
              timeouts.setTimeout(`clearReturning_${currentWidget.id}`, () => setReturningId(null), FEEDBACK_DURATION);
              
              // Animate return to original position with bounce
              if (pan) {
                Animated.parallel([
                  Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    tension: 100,
                    friction: 6,
                    useNativeDriver: false,
                  }),
                  animations && Animated.sequence([
                    Animated.timing(animations.scale, {
                      toValue: 0.95,
                      duration: 100,
                      useNativeDriver: false,
                    }),
                    Animated.spring(animations.scale, {
                      toValue: 1,
                      tension: 200,
                      friction: 8,
                      useNativeDriver: false,
                    }),
                  ]),
                  animations && Animated.timing(animations.elevation, {
                    toValue: 2,
                    duration: 300,
                    useNativeDriver: false,
                  }),
                  animations && Animated.timing(animations.rotation, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                  }),
                ]).start(() => {
                  pan.flattenOffset();
                  pan.setValue({x: 0, y: 0});
                });
              }
              
              return currentWidgets; // Don't modify widgets for invalid move
      }
    } else {
            // Same position - reset immediately and animate scale/elevation back to normal
            if (pan) {
              pan.flattenOffset();
              pan.setValue({x: 0, y: 0});
            }
            
            if (animations) {
              Animated.parallel([
                Animated.spring(animations.scale, {
                  toValue: 1,
                  tension: 150,
                  friction: 7,
            useNativeDriver: false,
                }),
                Animated.timing(animations.elevation, {
                  toValue: 2,
                  duration: 200,
                  useNativeDriver: false,
                }),
                Animated.timing(animations.rotation, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: false,
                }),
              ]).start();
            }
          }

          return currentWidgets;
        });

        // Reset states
        setDraggingId(null);
        draggingIdRef.current = null;
      setHintBox(null);
          },
          onPanResponderTerminate: () => {
        logger.widget.drag(widgetId, 'TERMINATE', {});
        const pan = panRefs.current[widgetId];
        const animations = animationRefs.current[widgetId];
        
        // Animate back to normal state
        if (pan) {
          Animated.parallel([
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              tension: 150,
              friction: 8,
              useNativeDriver: false,
            }),
            animations && Animated.spring(animations.scale, {
              toValue: 1,
              tension: 150,
              friction: 7,
              useNativeDriver: false,
            }),
            animations && Animated.timing(animations.elevation, {
              toValue: 2,
              duration: 200,
              useNativeDriver: false,
            }),
            animations && Animated.timing(animations.rotation, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start(() => {
            pan.flattenOffset();
            pan.setValue({x: 0, y: 0});
          });
        }
        
            setDraggingId(null);
        draggingIdRef.current = null;
            setHintBox(null);
          },
        });
  }, [timeouts]); // Only timeouts as dependency to avoid stale closures

  // Add panResponders ref back
  const panResponders = useRef({});

  // Animation values for widgets
  const animationRefs = useRef({});

  // Setup pan references and responders when widgets change
  useEffect(() => {
    logger.debug(`Setting up drag for ${widgets.length} widgets, editMode: ${editModeRef.current}`);
    
    // Keep existing animation values
    const oldPanRefs = panRefs.current;
    const oldAnimationRefs = animationRefs.current;
    const newPanRefs = {};
    const newAnimationRefs = {};
    const newPanResponders = {};

    widgets.forEach((widget, index) => {
      logger.debug(`Setting up widget ${widget.id} at index ${index}`);
      // Reuse existing animated value or create new one
      newPanRefs[widget.id] = oldPanRefs[widget.id] || new Animated.ValueXY();
      
      // Setup animation values for each widget
      if (oldAnimationRefs[widget.id]) {
        // Reuse existing animation values
        newAnimationRefs[widget.id] = oldAnimationRefs[widget.id];
      } else {
        // Create new animation values for new widgets
        newAnimationRefs[widget.id] = {
          scale: new Animated.Value(0), // Start at 0 for entry animation
          opacity: new Animated.Value(0), // Start transparent
          rotation: new Animated.Value(0),
          elevation: new Animated.Value(2),
        };
        
        // Animate new widget entry
        Animated.parallel([
          Animated.spring(newAnimationRefs[widget.id].scale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: false,
          }),
          Animated.timing(newAnimationRefs[widget.id].opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start();
      }
      
      // Create pan responder for each widget
      newPanResponders[widget.id] = createPanResponder(widget.id);
    });

    panRefs.current = newPanRefs;
    animationRefs.current = newAnimationRefs;
    panResponders.current = newPanResponders;
    logger.debug(`Pan references and responders created for widgets: ${Object.keys(newPanRefs).join(', ')}`);
  }, [widgets, createPanResponder]);

  // isCellOccupied function is now inside the GridVisualization component

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.BACKGROUND}}>
      {/* Click outside overlay to close options menu - only when not in edit mode */}
      {showOptionsMenu && !editMode && (
      <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
            zIndex: Z_INDEX.CLICK_OVERLAY,
          }}
          onPress={() => setShowOptionsMenu(false)}
          activeOpacity={1}
        />
      )}

      {/* Profile Header */}
            <ProfileHeader 
        onEditPress={useCallback(() => {
          if (editMode) {
            logger.debug('Exiting edit mode');
            setEditMode(false);
            setDraggingId(null);
            draggingIdRef.current = null;
            setHintBox(null);
            setReturningId(null);
            timeouts.clearAll(); // Clear all timeouts when exiting edit mode
                    } else {
            logger.debug('Entering edit mode');
            setEditMode(true);
            setShowOptionsMenu(false); // Close options menu when entering edit mode
          }
        }, [editMode, timeouts])}
        onAddWidget={useCallback(() => {
          // Check if there's any space available before opening modal
          const spaceInfo = analyzeGridSpace(widgets, WIDGET_SIZES, GRID_COLUMNS, GRID_ROWS);
          
          if (!spaceInfo.hasAnySpace) {
            // No space at all - show warning instead of opening modal
            feedback.widget.noSpace('any', 'any size', spaceInfo);
            return;
          }
          
          setModalVisible(true);
        }, [widgets])}
        editMode={editMode}
        showOptionsMenu={showOptionsMenu}
        onToggleMenu={useCallback(() => setShowOptionsMenu(!showOptionsMenu), [showOptionsMenu])}
        onResetWidgets={resetAllWidgets}
      />

      <View style={{flex: 1, marginTop: 40, paddingHorizontal:10}}>
        <View style={{ flex: 1 }}>
          <View style={{
            flex: 1,
            position: 'relative',
            width: screenWidth,
          }}>
            {/* Empty state when no widgets */}
            {widgets.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {/* Grid visualization in edit mode */}
                <GridVisualization 
                  editMode={editMode}
                  widgets={widgets}
                  recentlyFreed={recentlyFreed}
                  GRID_ROWS={GRID_ROWS}
                  GRID_COLUMNS={GRID_COLUMNS}
                  ACTUAL_CELL_WIDTH={ACTUAL_CELL_WIDTH}
                  ACTUAL_CELL_HEIGHT={ACTUAL_CELL_HEIGHT}
                  TILE_GAP={TILE_GAP}
                />
              </>
            )}

            {/* Hint box for drag preview */}
            <HintBox 
              hintBox={hintBox}
              ACTUAL_CELL_WIDTH={ACTUAL_CELL_WIDTH}
              ACTUAL_CELL_HEIGHT={ACTUAL_CELL_HEIGHT}
              TILE_GAP={TILE_GAP}
            />

            {/* Render widgets with individual pan responders */}
            {widgets.map((widget, index) => {
              // Ensure pan and responder exist, create if missing
              if (!panRefs.current[widget.id]) {
                panRefs.current[widget.id] = new Animated.ValueXY();
              }
              if (!panResponders.current[widget.id]) {
                panResponders.current[widget.id] = createPanResponder(widget.id);
              }
              if (!animationRefs.current[widget.id]) {
                animationRefs.current[widget.id] = {
                  scale: new Animated.Value(1),
                  opacity: new Animated.Value(1),
                  rotation: new Animated.Value(0),
                  elevation: new Animated.Value(2),
                };
              }

              const pan = panRefs.current[widget.id];
              const panResponder = panResponders.current[widget.id];
              const animations = animationRefs.current[widget.id];
              
              if (!pan || !panResponder || !animations) {
                logger.error(`Missing pan/responder/animations for ${widget.id} at index ${index}`);
                return null;
              }

              logger.debug(`Rendering widget ${widget.id} at index ${index}`);

              const staticLeft = widget.gridX * (ACTUAL_CELL_WIDTH + TILE_GAP) + TILE_GAP;
              const staticTop = widget.gridY * (ACTUAL_CELL_HEIGHT + TILE_GAP) + TILE_GAP;

              return (
                <Animated.View 
                  key={widget.id}
                  {...panResponder.panHandlers}
                  style={{
                    position: 'absolute',
                    left: staticLeft,
                    top: staticTop,
                    width: ACTUAL_CELL_WIDTH * widget.width + (widget.width - 1) * TILE_GAP,
                    height: ACTUAL_CELL_HEIGHT * widget.height + (widget.height - 1) * TILE_GAP,
                    zIndex: draggingId === widget.id ? Z_INDEX.DRAGGING_WIDGET : Z_INDEX.WIDGET,
                    transform: [
                      { translateX: pan.x },
                      { translateY: pan.y },
                      { scale: animations.scale },
                      { rotate: animations.rotation.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg']
                      })},
                    ],
                    opacity: animations.opacity,
                    elevation: animations.elevation,
                    shadowOpacity: animations.elevation.interpolate({
                      inputRange: [2, 10],
                      outputRange: [0.1, 0.3],
                      extrapolate: 'clamp',
                    }),
                    shadowRadius: animations.elevation.interpolate({
                      inputRange: [2, 10],
                      outputRange: [4, 8],
                      extrapolate: 'clamp',
                    }),
                  }}
                >
                  <Widget
                  widget={widget}
                    editMode={editMode}
                  onRemove={removeWidget}
                  isDragging={draggingId === widget.id}
                  isReturning={returningId === widget.id}
                    pan={pan}
                    animations={animations}
                    ACTUAL_CELL_WIDTH={ACTUAL_CELL_WIDTH}
                    ACTUAL_CELL_HEIGHT={ACTUAL_CELL_HEIGHT}
                    TILE_GAP={TILE_GAP}
                />
                </Animated.View>
              );
            })}
          </View>

            {/* Widget selection modal */}
          <WidgetModal 
            visible={modalVisible}
            selectedWidgetType={selectedWidgetType}
            onSelectType={handleWidgetTypeSelection}
            onSelectSize={handleSizeSelection}
            onClose={useCallback(() => {
              setModalVisible(false);
              setSelectedWidgetType(null);
            }, [])}
            onBack={useCallback(() => setSelectedWidgetType(null), [])}
          />
                </View>
              </View>
    </SafeAreaView>
  );
}
