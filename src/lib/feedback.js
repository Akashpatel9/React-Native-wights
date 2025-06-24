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
     */
    noSpace: (widgetType, size) => {
      const formattedType = widgetType.replace('_', ' ').toUpperCase();
      feedback.warning(
        'No Space Available',
        `There's no free space for a ${formattedType} widget (${size}). Try removing some widgets first or choose a smaller size.`,
      );
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
    }
  }
}; 