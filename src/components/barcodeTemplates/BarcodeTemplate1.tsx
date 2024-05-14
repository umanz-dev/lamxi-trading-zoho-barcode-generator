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
        width: 1.5,
        height: 7 * 3.77953,
        margin: 2.5
      });
    }
  }, [value]);

  return (
    <Box width="52mm" height="25mm" sx={{ textAlign: 'center', fontFamily: 'Arial' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '1.75rem' }}>
        <Typography sx={{ wordWrap: "break-word", lineHeight: "1", fontSize: "0.8rem" }}><strong>{itemName.toUpperCase()}</strong></Typography>
      </Box>
      <Box sx={{ height: "7.5mm" }} >
        <svg ref={barcodeRef} />
      </Box>
      {
        mrp ? (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: "0.1rem 0.5rem", alignItems: "center" }}>
            <Typography variant='subtitle2' sx={{ textDecoration: "line-through" }} fontSize="0.85rem">MRP: {mrp}</Typography>
            <Box height="2.25rem">
              <svg fill="#000000" version="1.1" xmlns="http://www.w3.org/2000/svg"
                width="100%" height="100%" viewBox="0 0 467.656 467.656" xmlSpace="preserve">
                <g>
                  <polygon points="233.828,0 301.053,117.393 436.328,116.914 368.275,233.828 436.328,350.742 301.053,350.264 233.828,467.656 
                166.605,350.264 31.328,350.742 99.381,233.828 31.328,116.914 166.605,117.393" />
                  {/* Text element for displaying Discount Percentage */}
                  <text x="50%" y="50%" textAnchor="middle" alignmentBaseline="middle" fontSize="7.5em" fill="white"
                    fontWeight="bold">{Math.round(((mrp - rate) / mrp) * 100)}%</text>
                </g>
              </svg>
            </Box>
            <Typography variant='subtitle2' fontSize="0.85rem">Rate: {rate}</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'space-around', margin: "0.1rem 0.5rem", alignItems: "center" }}>
            <Typography variant='subtitle2' fontSize="0.85rem">Rate: {rate}</Typography>
          </Box>
        )
      }
    </Box>
  );
};

export default BarcodeTemplate1;
