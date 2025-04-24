// frontend/src/components/Checkout.jsx
import React, { useState, useContext } from 'react';
import {
  Container, Paper, Typography,
  Stepper, Step, StepLabel,
  Box, Button, Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddressForm from './AddressForm';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import OrderSummary from './OrderSummary';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '',
    address1: '', address2: '',
    city: '', state: '',
    postalCode: '', phone: '',
    shippingMethod: 'standard',
    shippingCost: 5.99,
    paymentMethod: 'card',
    cardNumber: '', cardExpiry: '', cardCvv: '',
    discountCode: ''
  });

  const steps = ['Shipping Address', 'Delivery Method', 'Payment', 'Review'];

  const handleNext = async () => {
    if (activeStep < steps.length - 1) {
      return setActiveStep(s => s + 1);
    }
    // --- on final step, PLACE ORDER ---
    const items = cartItems.map(i => ({
      product: i.product._id,
      quantity: i.qty,
      price: i.product.price
    }));
    const shippingAddress = {
      address: formData.address1 + (formData.address2 ? ' ' + formData.address2 : ''),
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.state
    };
    const itemsTotal = cartItems.reduce((sum, i) => sum + i.qty * i.product.price, 0);
    const totalPrice = itemsTotal + formData.shippingCost;

    try {
      const { data } = await api.post('/orders', {
        items,
        shippingAddress,
        paymentMethod: formData.paymentMethod,
        totalPrice
      });
      clearCart();
      navigate(`/order-confirmation/${data._id}`);
    } catch (err) {
      console.error('Order placement failed:', err);
    }
  };

  const handleBack = () => setActiveStep(s => s - 1);

  const getStepContent = step => {
    switch (step) {
      case 0: return <AddressForm formData={formData} setFormData={setFormData} />;
      case 1: return <ShippingForm formData={formData} setFormData={setFormData} />;
      case 2: return <PaymentForm formData={formData} setFormData={setFormData} />;
      case 3:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Review Your Order
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography>
                  {formData.firstName} {formData.lastName}<br />
                  {formData.address1}{formData.address2 && <> <br />{formData.address2}</>}<br />
                  {formData.city}, {formData.state} {formData.postalCode}<br />
                  Phone: {formData.phone}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <OrderSummary cartItems={cartItems} formData={formData} />
              </Grid>
            </Grid>
          </>
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt:4, mb:4 }}>
      <Paper sx={{ p:4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb:4 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        <Box sx={{ display:'flex', justifyContent:'flex-end', mt:3 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ mr:1 }}>
              Back
            </Button>
          )}
          <Button variant="contained" onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
