/**
 * Logger utility for debugging and development
 */

const IS_DEV = __DEV__ || process.env.NODE_ENV === 'development';

export const logger = {
  debug: (message, ...args) => {
    if (IS_DEV) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  
  info: (message, ...args) => {
    if (IS_DEV) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  
  warn: (message, ...args) => {
    if (IS_DEV) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  
  error: (message, ...args) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  
  // Widget-specific loggers
  widget: {
    add: (type, size, position) => {
      if (IS_DEV) {
        console.log(`[WIDGET] Adding ${type} widget (${size.width}×${size.height}) at (${position.x}, ${position.y})`);
      }
    },
    
    remove: (id, type) => {
      if (IS_DEV) {
        console.log(`[WIDGET] Removing ${type} widget ${id}`);
      }
    },
    
    move: (id, from, to) => {
      if (IS_DEV) {
        console.log(`[WIDGET] Moving widget ${id} from (${from.x}, ${from.y}) to (${to.x}, ${to.y})`);
      }
    },
    
    drag: (id, action, data) => {
      if (IS_DEV) {
        console.log(`[DRAG] ${action} for widget ${id}`, data);
      }
    }
  }
}; 