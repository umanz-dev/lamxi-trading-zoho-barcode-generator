import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const BarcodeTemplate1 = ({ itemName, value, rate, mrp }: any) => {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, {
        format: 'CODE128',
        displayValue: false,
        width: 2,
        height: 8.5 * 3.77953,
        margin: 0,
      });
    }
  }, [value]);

  return (
    <Box width="52mm" height="25mm" style={{ textAlign: 'center', fontFamily: 'Arial' }}>
      <Typography variant='subtitle1'><strong>{itemName.toUpperCase()}</strong></Typography>
      <svg width="30mm" height="8.5mm" ref={barcodeRef} />
      <Box style={{ display: 'flex', justifyContent: 'space-between', padding: "0 0.5rem" }}>
        <Typography variant='subtitle2'>MRP: {mrp}</Typography>
        <Typography variant='subtitle2'>Rate: {rate}</Typography>
      </Box>
    </Box>
  );
};

export default BarcodeTemplate1;
