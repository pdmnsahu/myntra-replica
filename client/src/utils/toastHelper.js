import toast from 'react-hot-toast';

export const showSuccess = (msg) => toast.success(msg);
export const showError = (msg) => toast.error(msg || 'Something went wrong');
export const showLoading = (msg) => toast.loading(msg);
export const dismissToast = (id) => toast.dismiss(id);

export const withToast = async (fn, { loading, success, error } = {}) => {
  const id = loading ? toast.loading(loading) : null;
  try {
    const result = await fn();
    toast.dismiss(id);
    if (success) toast.success(success);
    return result;
  } catch (err) {
    toast.dismiss(id);
    const msg = err?.response?.data?.error || error || 'Something went wrong';
    toast.error(msg);
    throw err;
  }
};
