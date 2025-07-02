/**
 * Jest Testing Setup Configuration
 * 
 * This file configures the testing environment for the Signal School Frontend application.
 * It imports and sets up testing-library/jest-dom which provides additional custom Jest matchers
 * specifically designed for asserting on DOM nodes in React component tests.
 * 
 * Custom Jest Matchers Added:
 * - toBeDisabled() - checks if form elements are disabled
 * - toBeEnabled() - checks if form elements are enabled
 * - toBeInTheDocument() - checks if an element is present in the DOM
 * - toHaveTextContent() - checks element's text content
 * - toHaveValue() - checks form element values
 * - toBeVisible() - checks if element is visible to users
 * - And many more DOM-specific matchers
 * 
 * These matchers make tests more readable and provide better error messages
 * when assertions fail, improving the developer experience when writing
 * and debugging component tests.
 * 
 * Learn more: https://github.com/testing-library/jest-dom
 */

// Import jest-dom to extend Jest with custom DOM matchers
import '@testing-library/jest-dom';
