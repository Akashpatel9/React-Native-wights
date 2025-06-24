/**
 * Application constants and configuration
 */
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Grid configuration
export const GRID_COLUMNS = 3;
export const GRID_ROWS = 6;
export const TILE_GAP = 4;
export const TOP_PADDING = 90;
export const BOTTOM_PADDING = 30;

// Screen dimensions
export const SCREEN_WIDTH = screenWidth;
export const SCREEN_HEIGHT = screenHeight;

// Calculate available space to fit exactly to screen
export const AVAILABLE_HEIGHT = screenHeight - TOP_PADDING - BOTTOM_PADDING;
export const AVAILABLE_WIDTH = screenWidth - (GRID_COLUMNS + 1) * TILE_GAP;

// Calculate cell dimensions to fit exactly within screen
export const CELL_WIDTH = AVAILABLE_WIDTH / GRID_COLUMNS;
export const CELL_HEIGHT = (AVAILABLE_HEIGHT - (GRID_ROWS + 1) * TILE_GAP) / GRID_ROWS;

// Use calculated dimensions directly for perfect fit
export const ACTUAL_CELL_WIDTH = CELL_WIDTH;
export const ACTUAL_CELL_HEIGHT = CELL_HEIGHT;

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
}; 