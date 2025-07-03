import { Change } from './change';
/**
 * Configuration options for the confirmation dialog.
 *
 * This interface supports multiple dialog types and their customizable properties.
 *
 * @template T Optional data model used for 'summary' dialog changes.
 */
export interface ConfirmationOptions<T> {
  /**
   * The type of confirmation dialog to display.
   *
   * - `'basic'` (default): A simple confirmation dialog with a title and message.
   * - `'summary'`: Displays a summary of field-level changes (requires `changes`).
   * - `'writeUp'`: Requires the user to type a phrase.
   */
  type?: 'basic' | 'summary' | 'writeUp';

  /**
   * The title displayed at the top of the dialog.
   *
   * - In `basic` and `writeUp` types, it appears prominently.
   * - Ignored in `summary` dialogs, which have a built-in title.
   *
   * Default:
   * - `'Confirm Action'` for `basic`
   * - `''` (empty) for `writeUp`
   */
  title?: string;

  /**
   * The message or body content inside the dialog.
   *
   * - For `basic`, this is the confirmation prompt.
   * - For `writeUp`, this is the agreement statement or warning.
   * - Ignored in `summary` dialogs.
   *
   * Default:
   * - `'Are you sure?'` for `basic`
   * - `''` (empty) for `writeUp`
   */
  message?: string;

  /**
   * Required phrase the user must enter to confirm the action.
   *
   * Only applicable to dialogs of type `'writeUp'`.
   *
   * Default: `'I AGREE'`
   */
  requiredText?: string;

  /**
   * An array of changes to show in the summary table.
   *
   * Only applicable to dialogs of type `'summary'`.
   * Each change should include:
   * - `field`: The name of the field that was changed.
   * - `oldValue`: The previous value.
   * - `newValue`: The new value.
   *
   * Default: `[]`
   */
  changes?: Change<T>[];

  /**
   * Width of the dialog.
   *
   * Can be any valid CSS width string (e.g., `'400px'`, `'50vw'`).
   *
   * Default: `'400px'`
   */
  width?: string;

  /**
   * Maximum allowed width for the dialog.
   *
   * Useful for responsive design and preventing overflow on small screens.
   *
   * Default: `'80vw'`
   */
  maxWidth?: string;

  banner?: {
    text: string;
    severity: 'warning' | 'alert'; // Extendable in future
  };

  ticketIdEnabled?: boolean;
  reasonEnabled?: boolean;
}
