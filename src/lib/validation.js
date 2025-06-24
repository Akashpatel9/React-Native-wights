/**
 * Validation utilities for input validation and error handling
 */

/**
 * Validate widget data
 * @param {Object} widget - Widget object to validate
 * @returns {Object} - {isValid, errors}
 */
export const validateWidget = (widget) => {
  const errors = [];
  
  if (!widget) {
    errors.push('Widget data is required');
    return { isValid: false, errors };
  }
  
  if (!widget.id || typeof widget.id !== 'string') {
    errors.push('Widget must have a valid ID');
  }
  
  if (!widget.type || typeof widget.type !== 'string') {
    errors.push('Widget must have a valid type');
  }
  
  if (typeof widget.gridX !== 'number' || widget.gridX < 0) {
    errors.push('Widget gridX must be a non-negative number');
  }
  
  if (typeof widget.gridY !== 'number' || widget.gridY < 0) {
    errors.push('Widget gridY must be a non-negative number');
  }
  
  if (typeof widget.width !== 'number' || widget.width < 1) {
    errors.push('Widget width must be a positive number');
  }
  
  if (typeof widget.height !== 'number' || widget.height < 1) {
    errors.push('Widget height must be a positive number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate grid position
 * @param {number} gridX - X position
 * @param {number} gridY - Y position
 * @param {number} width - Widget width
 * @param {number} height - Widget height
 * @param {number} GRID_COLUMNS - Total columns
 * @param {number} GRID_ROWS - Total rows
 * @returns {Object} - {isValid, errors}
 */
export const validateGridPosition = (gridX, gridY, width, height, GRID_COLUMNS, GRID_ROWS) => {
  const errors = [];
  
  if (typeof gridX !== 'number' || gridX < 0) {
    errors.push('Grid X position must be a non-negative number');
  }
  
  if (typeof gridY !== 'number' || gridY < 0) {
    errors.push('Grid Y position must be a non-negative number');
  }
  
  if (typeof width !== 'number' || width < 1) {
    errors.push('Width must be a positive number');
  }
  
  if (typeof height !== 'number' || height < 1) {
    errors.push('Height must be a positive number');
  }
  
  if (gridX + width > GRID_COLUMNS) {
    errors.push(`Widget extends beyond grid width (${GRID_COLUMNS} columns)`);
  }
  
  if (gridY + height > GRID_ROWS) {
    errors.push(`Widget extends beyond grid height (${GRID_ROWS} rows)`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate widget type
 * @param {string} type - Widget type
 * @param {Array} validTypes - Array of valid widget types
 * @returns {Object} - {isValid, errors}
 */
export const validateWidgetType = (type, validTypes) => {
  const errors = [];
  
  if (!type || typeof type !== 'string') {
    errors.push('Widget type must be a non-empty string');
  } else if (!validTypes.some(validType => validType.type === type)) {
    errors.push(`Invalid widget type: ${type}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate widget size
 * @param {number} width - Widget width
 * @param {number} height - Widget height
 * @param {Array} validSizes - Array of valid widget sizes
 * @returns {Object} - {isValid, errors}
 */
export const validateWidgetSize = (width, height, validSizes) => {
  const errors = [];
  
  if (typeof width !== 'number' || width < 1) {
    errors.push('Width must be a positive number');
  }
  
  if (typeof height !== 'number' || height < 1) {
    errors.push('Height must be a positive number');
  }
  
  const isValidSize = validSizes.some(size => size.width === width && size.height === height);
  if (!isValidSize) {
    errors.push(`Invalid widget size: ${width}×${height}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 