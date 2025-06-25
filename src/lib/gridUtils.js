/**
 * Grid utility functions for widget layout management
 */

/**
 * Check if a cell position is free (not occupied by other widgets)
 * @param {number} gridX - X position in grid
 * @param {number} gridY - Y position in grid  
 * @param {number} width - Widget width in grid cells
 * @param {number} height - Widget height in grid cells
 * @param {Array} widgets - Array of existing widgets
 * @param {string} ignoreId - Widget ID to ignore (for current widget being moved)
 * @param {number} GRID_COLUMNS - Total grid columns
 * @param {number} GRID_ROWS - Total grid rows
 * @returns {boolean} - True if position is free
 */
export const isCellFree = (gridX, gridY, width, height, widgets, ignoreId = null, GRID_COLUMNS, GRID_ROWS) => {
  // Check bounds first
  if (gridX < 0 || gridY < 0 || gridX + width > GRID_COLUMNS || gridY + height > GRID_ROWS) {
    return false;
  }

  // Check overlap with other widgets
  return !widgets.some(widget => {
    if (widget.id === ignoreId) return false;
    
    const overlapX = gridX < widget.gridX + widget.width && gridX + width > widget.gridX;
    const overlapY = gridY < widget.gridY + widget.height && gridY + height > widget.gridY;
    
    return overlapX && overlapY;
  });
};

/**
 * Find the first free cell that can accommodate a widget of given size
 * @param {number} width - Widget width in grid cells
 * @param {number} height - Widget height in grid cells
 * @param {Array} widgets - Array of existing widgets
 * @param {string} excludeId - Widget ID to exclude from collision check
 * @param {number} GRID_COLUMNS - Total grid columns
 * @param {number} GRID_ROWS - Total grid rows
 * @returns {Object|null} - {x, y} position or null if no space found
 */
export const findFreeCell = (width, height, widgets, excludeId = null, GRID_COLUMNS, GRID_ROWS) => {
  // Try to find free space starting from top-left
  for (let y = 0; y <= GRID_ROWS - height; y++) {
    for (let x = 0; x <= GRID_COLUMNS - width; x++) {
      if (isCellFree(x, y, width, height, widgets, excludeId, GRID_COLUMNS, GRID_ROWS)) {
        return {x, y};
      }
    }
  }
  return null;
};

/**
 * Calculate total occupied cells in the grid
 * @param {Array} widgets - Array of widgets
 * @returns {number} - Total occupied cells
 */
export const calculateOccupiedCells = (widgets) => {
  return widgets.reduce((total, widget) => {
    return total + (widget.width * widget.height);
  }, 0);
};

/**
 * Calculate grid occupancy percentage
 * @param {Array} widgets - Array of widgets
 * @param {number} GRID_COLUMNS - Total grid columns
 * @param {number} GRID_ROWS - Total grid rows
 * @returns {number} - Occupancy percentage (0-100)
 */
export const calculateOccupancyPercentage = (widgets, GRID_COLUMNS, GRID_ROWS) => {
  const totalOccupiedCells = calculateOccupiedCells(widgets);
  const totalGridCells = GRID_COLUMNS * GRID_ROWS;
  return (totalOccupiedCells / totalGridCells) * 100;
};

/**
 * Get all cells occupied by a widget
 * @param {Object} widget - Widget object with gridX, gridY, width, height
 * @returns {Array} - Array of {x, y} cell positions
 */
export const getWidgetCells = (widget) => {
  const cells = [];
  for (let x = widget.gridX; x < widget.gridX + widget.width; x++) {
    for (let y = widget.gridY; y < widget.gridY + widget.height; y++) {
      cells.push({x, y});
    }
  }
  return cells;
};

/**
 * Check if a cell is occupied by any widget
 * @param {number} gridX - X position in grid
 * @param {number} gridY - Y position in grid
 * @param {Array} widgets - Array of widgets
 * @returns {boolean} - True if cell is occupied
 */
export const isCellOccupied = (gridX, gridY, widgets) => {
  return widgets.some(widget =>
    gridX >= widget.gridX &&
    gridX < widget.gridX + widget.width &&
    gridY >= widget.gridY &&
    gridY < widget.gridY + widget.height,
  );
};

/**
 * Check if there's any free space in the grid for any widget size
 * @param {Array} widgets - Array of existing widgets
 * @param {number} GRID_COLUMNS - Total grid columns
 * @param {number} GRID_ROWS - Total grid rows
 * @returns {boolean} - True if there's any free space
 */
export const hasAnyFreeSpace = (widgets, GRID_COLUMNS, GRID_ROWS) => {
  // Check if there's at least one free 1x1 cell
  return findFreeCell(1, 1, widgets, null, GRID_COLUMNS, GRID_ROWS) !== null;
};

/**
 * Get all available widget sizes that can fit in the current grid
 * @param {Array} widgets - Array of existing widgets
 * @param {Array} allSizes - Array of all possible widget sizes (from WIDGET_SIZES)
 * @param {number} GRID_COLUMNS - Total grid columns
 * @param {number} GRID_ROWS - Total grid rows
 * @returns {Array} - Array of sizes that can fit
 */
export const getAvailableWidgetSizes = (widgets, allSizes, GRID_COLUMNS, GRID_ROWS) => {
  return allSizes.filter(size => {
    return findFreeCell(size.width, size.height, widgets, null, GRID_COLUMNS, GRID_ROWS) !== null;
  });
};

/**
 * Analyze grid space and return detailed information
 * @param {Array} widgets - Array of existing widgets
 * @param {Array} allSizes - Array of all possible widget sizes
 * @param {number} GRID_COLUMNS - Total grid columns
 * @param {number} GRID_ROWS - Total grid rows
 * @returns {Object} - Space analysis information
 */
export const analyzeGridSpace = (widgets, allSizes, GRID_COLUMNS, GRID_ROWS) => {
  const occupancyPercentage = calculateOccupancyPercentage(widgets, GRID_COLUMNS, GRID_ROWS);
  const hasAnySpace = hasAnyFreeSpace(widgets, GRID_COLUMNS, GRID_ROWS);
  const availableSizes = getAvailableWidgetSizes(widgets, allSizes, GRID_COLUMNS, GRID_ROWS);
  
  return {
    occupancyPercentage,
    hasAnySpace,
    availableSizes,
    totalCells: GRID_COLUMNS * GRID_ROWS,
    occupiedCells: calculateOccupiedCells(widgets),
    freeCells: (GRID_COLUMNS * GRID_ROWS) - calculateOccupiedCells(widgets)
  };
};
