// frontend/src/components/Checkout.jsx

import React, { useState, useEffect, useContext } from 'react';
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
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    shippingMethod: 'standard',
    shippingCost: 5.99,
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    discountCode: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, exiting...');
          return;
        }
  
        const [profileRes, addressRes] = await Promise.all([
          api.get('/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get('/users/shipping-address', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
  
        const profile = profileRes.data;
        const address = addressRes.data;
  
        let firstName = '';
        let lastName = '';
        if (profile.name) {
          const parts = profile.name.split(' ');
          firstName = parts[0];
          lastName = parts.slice(1).join(' ');
        }
  
        setFormData(prev => ({
          ...prev,
          firstName,
          lastName,
          phone: profile.phone || '',
          address1: address.address || '',
          address2: '',
          city: address.city || '',
          postalCode: address.postalCode || '',
          state: address.country || ''
        }));
  
        console.log('Autofilled form data:', formData);
  
      } catch (error) {
        console.error('Failed fetching user data', error);
      }
    };
  
    fetchUserData();
  }, []);
  

  const steps = ['Shipping Address', 'Delivery Method', 'Payment', 'Review'];

  const handleNext = async () => {
    if (activeStep === 0) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.address1 ||
        !formData.city ||
        !formData.state ||
        !formData.postalCode ||
        !formData.phone
      ) {
        alert('Please fill in all required shipping address fields.');
        return;
      }
    }

    if (activeStep === 1) {
      if (!formData.shippingMethod) {
        alert('Please select a shipping method.');
        return;
      }
    }

    if (activeStep === 2) {
      if (formData.paymentMethod === 'card') {
        if (
          !formData.cardNumber ||
          !formData.cardExpiry ||
          !formData.cardCvv
        ) {
          alert('Please enter valid card details.');
          return;
        }
      }
    }

    if (activeStep < steps.length - 1) {
      return setActiveStep(prev => prev + 1);
    }

    // Final Step: Save shipping + Place Order
    const token = JSON.parse(localStorage.getItem('user'))?.token;

    const shippingAddress = {
      address: formData.address1 + (formData.address2 ? ` ${formData.address2}` : ''),
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.state
    };

    const items = cartItems.map(item => ({
      product: item.product._id,
      quantity: item.qty,
      price: item.product.price
    }));

    const itemsTotal = cartItems.reduce((sum, i) => sum + i.qty * i.product.price, 0);
    const totalPrice = itemsTotal + formData.shippingCost;

    try {
      await api.put('/users/shipping-address', {
        address: formData.address1,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.state
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { data } = await api.post('/orders', {
        items,
        shippingAddress,
        paymentMethod: formData.paymentMethod,
        totalPrice
      });

      clearCart();
      navigate(`/order-confirmation/${data._id}`);
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place the order. Please try again.');
    }
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddressForm formData={formData} setFormData={setFormData} />;
      case 1:
        return <ShippingForm formData={formData} setFormData={setFormData} />;
      case 2:
        return <PaymentForm formData={formData} setFormData={setFormData} />;
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
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
