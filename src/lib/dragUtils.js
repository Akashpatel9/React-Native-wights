/**
 * Drag and drop utility functions
 */

/**
 * Calculate grid position from gesture delta
 * @param {number} gestureX - Gesture X delta
 * @param {number} gestureY - Gesture Y delta
 * @param {number} cellWidth - Cell width in pixels
 * @param {number} cellHeight - Cell height in pixels
 * @param {number} tileGap - Gap between tiles
 * @returns {Object} - {deltaX, deltaY} in grid units
 */
export const calculateGridDelta = (gestureX, gestureY, cellWidth, cellHeight, tileGap) => {
  const cellStepX = cellWidth + tileGap;
  const cellStepY = cellHeight + tileGap;
  const deltaX = Math.round(gestureX / cellStepX);
  const deltaY = Math.round(gestureY / cellStepY);
  return {deltaX, deltaY};
};

/**
 * Calculate new grid position with bounds checking
 * @param {number} currentX - Current X position
 * @param {number} currentY - Current Y position
 * @param {number} deltaX - X delta from gesture
 * @param {number} deltaY - Y delta from gesture
 * @param {number} widgetWidth - Widget width in grid cells
 * @param {number} widgetHeight - Widget height in grid cells
 * @param {number} GRID_COLUMNS - Total grid columns
 * @param {number} GRID_ROWS - Total grid rows
 * @returns {Object} - {newGridX, newGridY} bounded positions
 */
export const calculateNewGridPosition = (
  currentX, 
  currentY, 
  deltaX, 
  deltaY, 
  widgetWidth, 
  widgetHeight, 
  GRID_COLUMNS, 
  GRID_ROWS
) => {
  const newGridX = Math.max(0, Math.min(GRID_COLUMNS - widgetWidth, currentX + deltaX));
  const newGridY = Math.max(0, Math.min(GRID_ROWS - widgetHeight, currentY + deltaY));
  return {newGridX, newGridY};
};

/**
 * Create hint box data for drag preview
 * @param {number} gridX - Grid X position
 * @param {number} gridY - Grid Y position
 * @param {number} width - Widget width
 * @param {number} height - Widget height
 * @param {boolean} isValid - Whether position is valid
 * @returns {Object} - Hint box data
 */
export const createHintBox = (gridX, gridY, width, height, isValid) => {
  return {
    gridX,
    gridY,
    width,
    height,
    isValid,
  };
};

/**
 * Check if gesture should trigger drag movement
 * @param {number} dx - X delta
 * @param {number} dy - Y delta
 * @param {number} threshold - Minimum movement threshold (default: 3)
 * @returns {boolean} - True if should move
 */
export const shouldStartDrag = (dx, dy, threshold = 3) => {
  return Math.abs(dx) > threshold || Math.abs(dy) > threshold;
};

/**
 * Calculate static position in pixels from grid coordinates
 * @param {number} gridX - Grid X position
 * @param {number} gridY - Grid Y position
 * @param {number} cellWidth - Cell width in pixels
 * @param {number} cellHeight - Cell height in pixels
 * @param {number} tileGap - Gap between tiles
 * @returns {Object} - {left, top} pixel positions
 */
export const calculateStaticPosition = (gridX, gridY, cellWidth, cellHeight, tileGap) => {
  const left = gridX * (cellWidth + tileGap) + tileGap;
  const top = gridY * (cellHeight + tileGap) + tileGap;
  return {left, top};
};

/**
 * Calculate widget dimensions in pixels
 * @param {number} width - Widget width in grid cells
 * @param {number} height - Widget height in grid cells
 * @param {number} cellWidth - Cell width in pixels
 * @param {number} cellHeight - Cell height in pixels
 * @param {number} tileGap - Gap between tiles
 * @param {number} scale - Scale factor (default: 1)
 * @returns {Object} - {width, height} in pixels
 */
export const calculateWidgetDimensions = (width, height, cellWidth, cellHeight, tileGap, scale = 1) => {
  const pixelWidth = (cellWidth * width + (width - 1) * tileGap) * scale;
  const pixelHeight = (cellHeight * height + (height - 1) * tileGap) * scale;
  return {width: pixelWidth, height: pixelHeight};
};

/**
 * Drag operation types
 */
export const DRAG_OPERATIONS = {
  START: 'START',
  MOVE: 'MOVE',
  END: 'END',
  CANCEL: 'CANCEL',
}; 