import * as React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { TextField, Typography } from '@mui/material';
import { Barcode, BarcodeMetadata } from '../common/constants';
import BarcodeTemplate1 from './barcodeTemplates/BarcodeTemplate1';

export default function PrintBarcodeDialog({ openPrintBarcodeDialog, setOpenPrintBarcodeDialog, barcodeMetadata, setBarcodeMetadata }: any) {

  const [settingsTab, setSettingsTab] = React.useState<boolean>(true)
  const [barcodes, setBarcodes] = React.useState<Barcode[]>([])

  React.useEffect(() => {
    const newBarcodes = [].concat(...barcodeMetadata.map((item: BarcodeMetadata) => {
      const temp = []
      for (let i = 0; i < item.quantity; i++) {
        temp.push({
          itemName: item.itemName,
          value: item.value,
          rate: "10",
          mrp: "25"
        })
      }
      return temp
    }))
    setBarcodes(newBarcodes)
  }, [barcodeMetadata])

  const createPDF = async () => {
    const pdf = new jsPDF('l', 'mm', [104, 25]);
    for (let i = 0; i < barcodes.length; i += 2) {
      const barcode: any = document.querySelector("#barcode-" + i)

      const data = await html2canvas(barcode);
      const img = data.toDataURL("image/png");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
      if (i + 2 < barcodes.length)
        pdf.addPage()
    }
    pdf.save("barcodes.pdf");
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (openPrintBarcodeDialog) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openPrintBarcodeDialog]);

  const handleChangeBarcodeQuantity = (id: any, newQuantity: any) => {
    const newBarcodeMetadata = barcodeMetadata.map((item: BarcodeMetadata) => {
      if (item.id === id) return { ...item, quantity: Number(newQuantity) }
      return item
    })
    setBarcodeMetadata(newBarcodeMetadata)
  }

  return (
    <Dialog
      open={openPrintBarcodeDialog}
      onClose={() => setOpenPrintBarcodeDialog(false)}
      scroll='paper'
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="scroll-dialog-title">Print Barcode</DialogTitle>
      {
        settingsTab ? (
          <DialogContent dividers>
            <Box sx={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="subtitle2" gutterBottom>Associated Template</Typography>
                <Typography variant='subtitle2'><strong>Barcode Template</strong></Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="subtitle2" gutterBottom>Associated Field</Typography>
                <Typography variant='subtitle2'><strong>SKU</strong></Typography>
              </Box>
              <Button startIcon={<EditRoundedIcon fontSize='small' />}>Edit</Button>
            </Box>
            <Box pt={2}>
              <Box sx={{ display: "flex", gap: "1rem", justifyContent: "space-between" }} pb={2}>
                <Typography variant="overline">Item Details</Typography>
                <Typography variant='overline'>Number of Barcode Copies</Typography>
              </Box>
              {barcodeMetadata
                .map(({ id, associatedField, value, itemName, quantity }: BarcodeMetadata) => (
                  <Box key={id} sx={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant='subtitle2'><strong>{itemName}</strong></Typography>
                      <Typography variant="subtitle2" gutterBottom>{associatedField}: {value}</Typography>
                    </Box>
                    <TextField id="outlined-basic" sx={{ width: "25%" }} size='small' type="number" inputProps={{ min: 1, max: 99 }} onChange={(e) => { handleChangeBarcodeQuantity(id, e.target.value) }} value={quantity} variant="outlined" />
                  </Box>
                ))}
            </Box>
          </DialogContent>
        ) : (
          <DialogContent dividers>
            {
              barcodes.map((item: any, index: number) => {
                if (index % 2 === 0) {
                  if (index === barcodes.length - 1) {
                    return (
                      <Box key={index} id={"barcode-" + index} width="104mm">
                        <BarcodeTemplate1 itemName={barcodes[index].itemName} value={barcodes[index].value} rate={barcodes[index].rate} mrp={barcodes[index].mrp} />
                      </Box>
                    )
                  }
                  return (
                    <Box id={"barcode-" + index} key={index} sx={{ display: "flex" }} width="104mm">
                      <BarcodeTemplate1 itemName={barcodes[index].itemName} value={barcodes[index].value} rate={barcodes[index].rate} mrp={barcodes[index].mrp} />
                      <BarcodeTemplate1 itemName={barcodes[index + 1].itemName} value={barcodes[index + 1].value} rate={barcodes[index + 1].rate} mrp={barcodes[index + 1].mrp} />
                    </Box>
                  )
                }
                return null
              })
            }
          </DialogContent>
        )
      }
      {
        settingsTab ? (
          <DialogActions>
            <Button onClick={() => setOpenPrintBarcodeDialog(false)}>Cancel</Button>
            <Button variant='contained' onClick={() => setSettingsTab(false)}>Next</Button>
          </DialogActions>
        ) : (
          <DialogActions>
            <Button onClick={() => setSettingsTab(true)}>Back</Button>
            <Button variant='contained' onClick={createPDF}>Print</Button>
          </DialogActions>
        )
      }

    </Dialog>
  );
}