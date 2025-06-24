/**
 * Widget utility functions for widget management
 */

/**
 * Generate a unique widget ID
 * @returns {string} - Unique widget ID
 */
export const generateWidgetId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Create a new widget object
 * @param {string} type - Widget type
 * @param {number} width - Widget width in grid cells
 * @param {number} height - Widget height in grid cells
 * @param {number} gridX - X position in grid
 * @param {number} gridY - Y position in grid
 * @returns {Object} - New widget object
 */
export const createWidget = (type, width, height, gridX, gridY) => {
  return {
    id: generateWidgetId(),
    type,
    width,
    height,
    gridX,
    gridY,
  };
};

/**
 * Find a widget by ID
 * @param {Array} widgets - Array of widgets
 * @param {string} id - Widget ID to find
 * @returns {Object|undefined} - Widget object or undefined if not found
 */
export const findWidgetById = (widgets, id) => {
  return widgets.find(widget => widget.id === id);
};

/**
 * Remove a widget by ID
 * @param {Array} widgets - Array of widgets
 * @param {string} id - Widget ID to remove
 * @returns {Array} - New array without the removed widget
 */
export const removeWidgetById = (widgets, id) => {
  return widgets.filter(widget => widget.id !== id);
};

/**
 * Update a widget's position
 * @param {Array} widgets - Array of widgets
 * @param {string} id - Widget ID to update
 * @param {number} gridX - New X position
 * @param {number} gridY - New Y position
 * @returns {Array} - New array with updated widget
 */
export const updateWidgetPosition = (widgets, id, gridX, gridY) => {
  return widgets.map(widget => 
    widget.id === id ? {...widget, gridX, gridY} : widget
  );
};

/**
 * Format widget type for display
 * @param {string} type - Widget type (e.g., 'exam_prep')
 * @returns {string} - Formatted type (e.g., 'EXAM PREP')
 */
export const formatWidgetType = (type) => {
  return type.replace('_', ' ').toUpperCase();
};

/**
 * Get widget size label
 * @param {number} width - Widget width
 * @param {number} height - Widget height
 * @returns {string} - Size label (e.g., 'Small (1×1)')
 */
export const getWidgetSizeLabel = (width, height) => {
  const sizeMap = {
    '1,1': 'Small (1×1)',
    '2,1': 'Wide (2×1)',
    '1,2': 'Tall (1×2)',
    '2,2': 'Large (2×2)',
  };
  return sizeMap[`${width},${height}`] || `${width}×${height}`;
};

/**
 * Available widget sizes
 */
export const WIDGET_SIZES = [
  {width: 1, height: 1, label: 'Small (1×1)'},
  {width: 2, height: 1, label: 'Wide (2×1)'},
  {width: 1, height: 2, label: 'Tall (1×2)'},
  {width: 2, height: 2, label: 'Large (2×2)'},
];

/**
 * Available widget types with default sizes
 */
export const WIDGET_TYPES = [
  {type: 'profile', width: 2, height: 1},
  {type: 'school', width: 2, height: 1},
  {type: 'goals', width: 1, height: 1},
  {type: 'exam_prep', width: 1, height: 1},
  {type: 'trophies', width: 2, height: 2},
  {type: 'friends', width: 1, height: 1},
  {type: 'class', width: 1, height: 1},
]; 