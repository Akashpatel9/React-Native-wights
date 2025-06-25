/**
 * User feedback utilities for better UX than alerts
 */
import { Alert } from 'react-native';

/**
 * Show user feedback for different scenarios
 */
export const feedback = {
  /**
   * Show error message to user
   * @param {string} title - Error title
   * @param {string} message - Error message
   * @param {Function} onOk - Callback when user acknowledges
   */
  error: (title, message, onOk) => {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: onOk }],
      { cancelable: false }
    );
  },

  /**
   * Show warning message to user
   * @param {string} title - Warning title
   * @param {string} message - Warning message
   * @param {Function} onOk - Callback when user acknowledges
   */
  warning: (title, message, onOk) => {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: onOk }],
      { cancelable: true }
    );
  },

  /**
   * Show confirmation dialog
   * @param {string} title - Dialog title
   * @param {string} message - Dialog message
   * @param {Function} onConfirm - Callback when user confirms
   * @param {Function} onCancel - Callback when user cancels
   */
  confirm: (title, message, onConfirm, onCancel) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', onPress: onCancel, style: 'cancel' },
        { text: 'OK', onPress: onConfirm },
      ],
      { cancelable: true }
    );
  },

  /**
   * Show info message to user
   * @param {string} title - Info title
   * @param {string} message - Info message
   * @param {Function} onOk - Callback when user acknowledges
   */
  info: (title, message, onOk) => {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: onOk }],
      { cancelable: true }
    );
  },

  // Widget-specific feedback
  widget: {
    /**
     * Show feedback when no space is available for widget
     * @param {string} widgetType - Type of widget
     * @param {string} size - Size of widget (e.g., "2×1")
     * @param {Object} spaceInfo - Information about available space
     */
    noSpace: (widgetType, size, spaceInfo = {}) => {
      const formattedType = widgetType.replace('_', ' ').toUpperCase();
      const { occupancyPercentage = 0, hasAnySpace = false, availableSizes = [] } = spaceInfo;
      
      let title = '⚠️ No Space Available';
      let message = '';
      
      if (occupancyPercentage >= 95) {
        // Grid is almost completely full
        title = '🔴 Grid is Full!';
        message = `Your widget grid is ${Math.round(occupancyPercentage)}% full!\n\n` +
                 `Cannot add ${formattedType} widget (${size}).\n\n` +
                 `💡 Try removing some existing widgets first to make space.`;
      } else if (!hasAnySpace) {
        // No space for any widget
        title = '📱 Grid is Packed!';
        message = `No free space remaining for new widgets.\n\n` +
                 `Cannot add ${formattedType} widget (${size}).\n\n` +
                 `💡 Remove some widgets to free up space, then try again.`;
      } else if (availableSizes.length > 0) {
        // Space available but not for this specific size
        const sizeOptions = availableSizes.map(s => s.label).join(', ');
        message = `Not enough space for ${formattedType} widget (${size}).\n\n` +
                 `✅ Available sizes that will fit:\n${sizeOptions}\n\n` +
                 `💡 Try selecting a smaller size or rearranging existing widgets.`;
      } else {
        // Generic no space message
        message = `Cannot fit ${formattedType} widget (${size}) in the available space.\n\n` +
                 `💡 Try:\n` +
                 `• Choose a smaller widget size\n` +
                 `• Remove some existing widgets\n` +
                 `• Rearrange widgets to create space`;
      }

      feedback.warning(title, message);
    },

    /**
     * Show feedback when widget is successfully added
     * @param {string} widgetType - Type of widget
     */
    added: (widgetType) => {
      const formattedType = widgetType.replace('_', ' ').toUpperCase();
      // Could be replaced with a toast notification in the future
      // For now, we don't show anything as it's obvious from the UI
    },

    /**
     * Confirm widget removal
     * @param {string} widgetType - Type of widget
     * @param {Function} onConfirm - Callback when confirmed
     */
    confirmRemoval: (widgetType, onConfirm) => {
      const formattedType = widgetType.replace('_', ' ').toUpperCase();
      feedback.confirm(
        'Remove Widget',
        `Are you sure you want to remove this ${formattedType} widget?`,
        onConfirm
      );
    },

    /**
     * Confirm resetting all widgets
     * @param {number} widgetCount - Number of widgets to be removed
     * @param {Function} onConfirm - Callback when confirmed
     */
    confirmReset: (widgetCount, onConfirm) => {
      if (widgetCount === 0) {
        feedback.info(
          'Nothing to Reset',
          'Your profile is already empty. Add some widgets first!'
        );
        return;
      }

      feedback.confirm(
        '🗑️ Remove All Widgets',
        `Are you sure you want to remove all ${widgetCount} widget${widgetCount > 1 ? 's' : ''}?\n\n` +
        `⚠️ This action cannot be undone.\n\n` +
        `Your profile will be completely cleared and you'll start fresh.`,
        onConfirm
      );
    }
  }
}; 