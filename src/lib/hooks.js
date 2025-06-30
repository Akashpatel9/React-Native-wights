/**
 * Custom hooks for better state management and cleanup
 */
import { useEffect, useRef, useCallback, useState } from 'react';
import { Dimensions } from 'react-native';
import { calculateGridDimensions, GRID_COLUMNS, GRID_ROWS, TILE_GAP } from './constants';

/**
 * Hook to safely use setTimeout with automatic cleanup
 * @param {Function} callback - Function to call after delay
 * @param {number} delay - Delay in milliseconds
 * @returns {Object} - {start, clear} functions to control the timeout
 */
export const useSafeTimeout = () => {
  const timeoutRef = useRef(null);

  const start = useCallback((callback, delay) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      callback();
      timeoutRef.current = null;
    }, delay);
  }, []);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { start, clear };
};

/**
 * Hook to manage multiple timeouts with automatic cleanup
 * @returns {Object} - {setTimeout, clearTimeout, clearAll} functions
 */
export const useMultipleTimeouts = () => {
  const timeoutsRef = useRef(new Map());

  const setTimeoutSafe = useCallback((key, callback, delay) => {
    // Clear existing timeout with same key
    const existingTimeout = timeoutsRef.current.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeoutId = setTimeout(() => {
      callback();
      timeoutsRef.current.delete(key);
    }, delay);

    timeoutsRef.current.set(key, timeoutId);
  }, []);

  const clearTimeoutSafe = useCallback((key) => {
    const timeoutId = timeoutsRef.current.get(key);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(key);
    }
  }, []);

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    timeoutsRef.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      timeoutsRef.current.clear();
    };
  }, []);

  return { 
    setTimeout: setTimeoutSafe, 
    clearTimeout: clearTimeoutSafe, 
    clearAll 
  };
};

/**
 * Hook for previous value tracking (useful for debugging)
 * @param {any} value - Value to track
 * @returns {any} - Previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

/**
 * Custom hook for responsive grid dimensions
 * Provides better handling of dimension changes and ensures grid stays responsive
 */
export const useResponsiveGrid = () => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return calculateGridDimensions(width, height);
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(calculateGridDimensions(window.width, window.height));
    });

    return () => subscription?.remove();
  }, []);

  // Memoized calculation to avoid unnecessary re-renders
  const gridMetrics = useCallback(() => {
    const {
      actualCellWidth,
      actualCellHeight,
      screenWidth,
      screenHeight,
    } = dimensions;

    // Calculate total grid size for centering
    const totalGridWidth = GRID_COLUMNS * actualCellWidth + (GRID_COLUMNS + 1) * TILE_GAP;
    const totalGridHeight = GRID_ROWS * actualCellHeight + (GRID_ROWS + 1) * TILE_GAP;

    // Calculate centering offsets if grid is smaller than screen
    const horizontalOffset = Math.max(0, (screenWidth - totalGridWidth) / 2);
    const verticalOffset = Math.max(0, (screenHeight - totalGridHeight) / 4); // Less vertical centering

    return {
      ...dimensions,
      totalGridWidth,
      totalGridHeight,
      horizontalOffset,
      verticalOffset,
      isLandscape: screenWidth > screenHeight,
      aspectRatio: screenWidth / screenHeight,
    };
  }, [dimensions]);

  return gridMetrics();
}; 