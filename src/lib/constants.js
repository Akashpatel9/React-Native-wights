/**
 * Application constants and configuration
 */
import { Dimensions } from 'react-native';

// Grid configuration - these remain constant
export const GRID_COLUMNS = 3;
export const GRID_ROWS = 6;
export const TILE_GAP = 4;

// Responsive padding as percentage of screen height for better scaling
export const TOP_PADDING_RATIO = 0.08; // 8% of screen height
export const BOTTOM_PADDING_RATIO = 0.04; // 4% of screen height
export const MIN_TOP_PADDING = 60; // Minimum padding for very small screens
export const MIN_BOTTOM_PADDING = 20; // Minimum padding for very small screens

// Function to get current screen dimensions
export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

// Safety constraints for grid dimensions
export const MIN_CELL_WIDTH = 60;  // Minimum cell width for usability
export const MIN_CELL_HEIGHT = 60; // Minimum cell height for usability
export const MAX_CELL_WIDTH = 200; // Maximum cell width to prevent oversized widgets
export const MAX_CELL_HEIGHT = 150; // Maximum cell height to prevent oversized widgets

// Function to calculate responsive grid dimensions
export const calculateGridDimensions = (screenWidth, screenHeight) => {
  // Calculate responsive padding
  const topPadding = Math.max(screenHeight * TOP_PADDING_RATIO, MIN_TOP_PADDING);
  const bottomPadding = Math.max(screenHeight * BOTTOM_PADDING_RATIO, MIN_BOTTOM_PADDING);
  
  // Calculate available space
  const availableHeight = screenHeight - topPadding - bottomPadding;
  const availableWidth = screenWidth - (GRID_COLUMNS + 1) * TILE_GAP;
  
  // Calculate cell dimensions to fit exactly within screen
  let cellWidth = availableWidth / GRID_COLUMNS;
  let cellHeight = (availableHeight - (GRID_ROWS + 1) * TILE_GAP) / GRID_ROWS;
  
  // Apply safety constraints to prevent unusable cell sizes
  cellWidth = Math.max(MIN_CELL_WIDTH, Math.min(MAX_CELL_WIDTH, cellWidth));
  cellHeight = Math.max(MIN_CELL_HEIGHT, Math.min(MAX_CELL_HEIGHT, cellHeight));
  
  // Recalculate available space based on constrained cell sizes
  const actualAvailableWidth = GRID_COLUMNS * cellWidth + (GRID_COLUMNS + 1) * TILE_GAP;
  const actualAvailableHeight = GRID_ROWS * cellHeight + (GRID_ROWS + 1) * TILE_GAP;
  
  return {
    screenWidth,
    screenHeight,
    topPadding,
    bottomPadding,
    availableHeight,
    availableWidth,
    actualAvailableWidth,
    actualAvailableHeight,
    cellWidth,
    cellHeight,
    actualCellWidth: cellWidth,
    actualCellHeight: cellHeight,
  };
};

// Get initial dimensions for backwards compatibility
const initialDimensions = getScreenDimensions();
const initialGridDims = calculateGridDimensions(initialDimensions.width, initialDimensions.height);

// Export initial values for backwards compatibility
export const SCREEN_WIDTH = initialDimensions.width;
export const SCREEN_HEIGHT = initialDimensions.height;
export const TOP_PADDING = initialGridDims.topPadding;
export const BOTTOM_PADDING = initialGridDims.bottomPadding;
export const AVAILABLE_HEIGHT = initialGridDims.availableHeight;
export const AVAILABLE_WIDTH = initialGridDims.availableWidth;
export const CELL_WIDTH = initialGridDims.cellWidth;
export const CELL_HEIGHT = initialGridDims.cellHeight;
export const ACTUAL_CELL_WIDTH = initialGridDims.actualCellWidth;
export const ACTUAL_CELL_HEIGHT = initialGridDims.actualCellHeight;

// Drag thresholds
export const DRAG_THRESHOLD = 3;

// Animation durations
export const ANIMATION_DURATION = 200;
export const FEEDBACK_DURATION = 1000;
export const FREED_CELLS_DURATION = 2000;

// Accessibility
export const ACCESSIBILITY = {
  WIDGET_ROLE: 'button',
  WIDGET_HINT: 'Double tap to configure, drag to move when in edit mode',
  EDIT_BUTTON_HINT: 'Toggle edit mode to rearrange widgets',
  ADD_BUTTON_HINT: 'Add a new widget to your profile',
  REMOVE_BUTTON_HINT: 'Remove this widget from your profile',
};

// Z-index layers
export const Z_INDEX = {
  BACKGROUND: 0,
  GRID: 0,
  HINT_BOX: 1,
  WIDGET: 2,
  DRAGGING_WIDGET: 1000,
  REMOVE_BUTTON: 1001,
  CLICK_OVERLAY: 50,
  HEADER: 100,
  DROPDOWN: 1000,
  MODAL: 1000,
};

// Widget scaling during drag
export const DRAG_SCALE = 0.9;
export const DRAG_OPACITY = 0.8;

// Colors
export const COLORS = {
  BACKGROUND: '#fff',
  WIDGET_BACKGROUND: '#F5F5F5',
  WIDGET_RETURNING: '#ffebee',
  GRID_BORDER: '#e0e0e0',
  GRID_LINE: '#e0e0e0',
  GRID_OCCUPIED: '#ffcdd2',
  GRID_FREE: '#c8e6c9',
  GRID_RECENTLY_FREED: '#4caf50',
  HINT_VALID: 'rgba(0,123,255,0.2)',
  HINT_INVALID: 'rgba(255,0,0,0.2)',
  HINT_BORDER_VALID: '#007bff',
  HINT_BORDER_INVALID: '#ff0000',
  DRAG_BORDER: '#007bff',
  RETURNING_BORDER: '#ff5722',
  REMOVE_BUTTON: '#FF6B6B',
  PRIMARY: '#007AFF',
  SUCCESS: '#34C759',
  DANGER: '#FF3B30',
  TEXT_PRIMARY: '#000',
  TEXT_SECONDARY: '#666',
  TEXT_MUTED: '#999',
  ACCENT_LIGHT: 'rgba(0,123,255,0.1)',
}; 