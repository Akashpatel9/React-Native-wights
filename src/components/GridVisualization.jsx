import React from 'react';
import { View } from 'react-native';
import { COLORS, Z_INDEX } from '../lib/constants';
import { isCellOccupied } from '../lib/gridUtils';

const GridVisualization = ({ 
  editMode, 
  widgets, 
  recentlyFreed, 
  GRID_ROWS, 
  GRID_COLUMNS, 
  ACTUAL_CELL_WIDTH, 
  ACTUAL_CELL_HEIGHT, 
  TILE_GAP 
}) => {
  // isCellOccupied function is now imported from gridUtils

  if (!editMode) return null;

    return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: GRID_COLUMNS * (ACTUAL_CELL_WIDTH + TILE_GAP) + TILE_GAP,
      height: GRID_ROWS * (ACTUAL_CELL_HEIGHT + TILE_GAP) + TILE_GAP,
      zIndex: Z_INDEX.GRID,
    }}>
      {Array.from({length: GRID_ROWS}, (_, row) =>
        Array.from({length: GRID_COLUMNS}, (_, col) => {
          const isOccupied = isCellOccupied(col, row, widgets);
          const isRecentlyFreed = recentlyFreed.some(
            cell => cell.x === col && cell.y === row,
          );

          let borderColor = COLORS.GRID_BORDER;
          let backgroundColor = 'transparent';

          if (isRecentlyFreed) {
            borderColor = COLORS.GRID_RECENTLY_FREED;
            backgroundColor = 'rgba(76,175,80,0.3)';
          } else if (isOccupied) {
            borderColor = COLORS.GRID_OCCUPIED;
            backgroundColor = 'rgba(255,205,210,0.1)';
          } else {
            borderColor = COLORS.GRID_FREE;
            backgroundColor = 'rgba(200,230,201,0.1)';
          }

          return (
            <View
              key={`${row}-${col}`}
              style={{
                position: 'absolute',
                left: col * (ACTUAL_CELL_WIDTH + TILE_GAP) + TILE_GAP,
                top: row * (ACTUAL_CELL_HEIGHT + TILE_GAP) + TILE_GAP,
                width: ACTUAL_CELL_WIDTH,
                height: ACTUAL_CELL_HEIGHT,
                borderWidth: isRecentlyFreed ? 2 : 1,
                borderColor: borderColor,
                borderStyle: 'dashed',
                backgroundColor: backgroundColor,
              }}
            />
          );
        }),
      )}
    </View>
  );
};

export default GridVisualization; 