import React, { useState } from 'react';
import AlertModal from '../shared/AlertModal';

/**
 * AlertModal Component - Usage Examples
 * This file demonstrates how to use the AlertModal component
 */

const AlertModalExamples = () => {
  // Success Alert
  const [successAlert, setSuccessAlert] = useState({
    isOpen: false,
    title: 'Success',
    message: 'Operation completed successfully!',
    type: 'success',
    onConfirm: null,
  });

  // Error Alert
  const [errorAlert, setErrorAlert] = useState({
    isOpen: false,
    title: 'Error',
    message: 'Something went wrong. Please try again.',
    type: 'error',
    onConfirm: null,
  });

  // Warning Alert
  const [warningAlert, setWarningAlert] = useState({
    isOpen: false,
    title: 'Warning',
    message: 'Are you sure you want to continue?',
    type: 'warning',
    onConfirm: null,
  });

  // Info Alert
  const [infoAlert, setInfoAlert] = useState({
    isOpen: false,
    title: 'Information',
    message: 'Here is some important information for you.',
    type: 'info',
    onConfirm: null,
  });

  const showSuccessAlert = () => {
    setSuccessAlert({
      isOpen: true,
      title: 'Success',
      message: 'Your changes have been saved successfully!',
      type: 'success',
      onConfirm: () => {
        console.log('Success confirmed');
        // Add your logic here
      }
    });
  };

  const showErrorAlert = () => {
    setErrorAlert({
      isOpen: true,
      title: 'Error',
      message: 'Failed to save changes. Please check your input and try again.',
      type: 'error',
      onConfirm: null
    });
  };

  const showWarningAlert = () => {
    setWarningAlert({
      isOpen: true,
      title: 'Confirm Delete',
      message: 'This action cannot be undone. Are you sure you want to delete this item?',
      type: 'warning',
      onConfirm: () => {
        console.log('Item deleted');
        // Add your delete logic here
      }
    });
  };

  const showInfoAlert = () => {
    setInfoAlert({
      isOpen: true,
      title: 'Notice',
      message: 'The system will undergo maintenance on Sunday from 2 AM to 4 AM.',
      type: 'info',
      onConfirm: null
    });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Render all alerts */}
      <AlertModal
        isOpen={successAlert.isOpen}
        onClose={() => setSuccessAlert({ ...successAlert, isOpen: false })}
        title={successAlert.title}
        message={successAlert.message}
        type={successAlert.type}
        onConfirm={successAlert.onConfirm}
      />

      <AlertModal
        isOpen={errorAlert.isOpen}
        onClose={() => setErrorAlert({ ...errorAlert, isOpen: false })}
        title={errorAlert.title}
        message={errorAlert.message}
        type={errorAlert.type}
        onConfirm={errorAlert.onConfirm}
      />

      <AlertModal
        isOpen={warningAlert.isOpen}
        onClose={() => setWarningAlert({ ...warningAlert, isOpen: false })}
        title={warningAlert.title}
        message={warningAlert.message}
        type={warningAlert.type}
        onConfirm={warningAlert.onConfirm}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <AlertModal
        isOpen={infoAlert.isOpen}
        onClose={() => setInfoAlert({ ...infoAlert, isOpen: false })}
        title={infoAlert.title}
        message={infoAlert.message}
        type={infoAlert.type}
        onConfirm={infoAlert.onConfirm}
      />

      {/* Demo Buttons */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold mb-6">AlertModal Examples</h1>

        <button
          onClick={showSuccessAlert}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Show Success Alert
        </button>

        <button
          onClick={showErrorAlert}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Show Error Alert
        </button>

        <button
          onClick={showWarningAlert}
          className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Show Warning Alert
        </button>

        <button
          onClick={showInfoAlert}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Show Info Alert
        </button>
      </div>
    </div>
  );
};

export default AlertModalExamples;

/**
 * USAGE IN YOUR COMPONENTS:
 * 
 * 1. Import the AlertModal component
 * 2. Add state to manage the alert
 * 3. Call setAlertModal to show the alert
 * 4. Add the AlertModal component to your JSX
 * 
 * EXAMPLE:
 * 
 * import AlertModal from '../shared/AlertModal';
 * 
 * const MyComponent = () => {
 *   const [alertModal, setAlertModal] = useState({
 *     isOpen: false,
 *     title: '',
 *     message: '',
 *     type: 'success',
 *     onConfirm: null,
 *   });
 * 
 *   const handleSave = async () => {
 *     try {
 *       // Your save logic
 *       setAlertModal({
 *         isOpen: true,
 *         title: 'Success',
 *         message: 'Saved successfully!',
 *         type: 'success',
 *       });
 *     } catch (error) {
 *       setAlertModal({
 *         isOpen: true,
 *         title: 'Error',
 *         message: 'Failed to save. Please try again.',
 *         type: 'error',
 *       });
 *     }
 *   };
 * 
 *   return (
 *     <>
 *       <AlertModal
 *         isOpen={alertModal.isOpen}
 *         onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
 *         title={alertModal.title}
 *         message={alertModal.message}
 *         type={alertModal.type}
 *         onConfirm={alertModal.onConfirm}
 *       />
 *       <button onClick={handleSave}>Save</button>
 *     </>
 *   );
 * };
 */
