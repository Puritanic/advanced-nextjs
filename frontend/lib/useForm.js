import { useState } from 'react';

export default function useForm(initialState) {
  const [values, setValues] = useState(initialState);

  function handleInputChange(event) {
    const { name, type } = event.target;
    let { value } = event.target;

    if (type === 'number' && !Number.isNaN(value)) value = parseInt(value, 10);
    if (type === 'file') [value] = event.target.files;

    setValues({ ...values, [name]: value });
  }

  function resetForm() {
    setValues(initialState);
  }

  function clearForm() {
    const blankValues = Object.keys(initialState).reduce((acc, key) => ({ ...acc, [key]: '' }), {});
    setValues(blankValues);
  }

  return { values, setValues, handleInputChange, resetForm, clearForm };
}
