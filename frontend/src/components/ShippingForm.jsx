import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography
} from '@mui/material';

export default function ShippingForm({ formData, setFormData }) {
  const handleChange = e => {
    const method = e.target.value;
    let cost = 0;
    if (method === 'standard') cost = 5.99;
    if (method === 'express') cost = 12.99;
    setFormData(prev => ({ ...prev, shippingMethod: method, shippingCost: cost }));
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Delivery Method</FormLabel>
      <RadioGroup value={formData.shippingMethod} onChange={handleChange}>
        <FormControlLabel
          value="standard"
          control={<Radio />}
          label={`Standard - $5.99`}
        />
        <FormControlLabel
          value="express"
          control={<Radio />}
          label={`Express - $12.99`}
        />
      </RadioGroup>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Selected cost: ${formData.shippingCost.toFixed(2)}
      </Typography>
    </FormControl>
  );
}
