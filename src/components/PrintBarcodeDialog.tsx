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
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import BarcodeTemplate1 from './barcodeTemplates/BarcodeTemplate1';
import { Barcode, BarcodeMetadata, LogConstants } from '../common/constants';

// Generate unique product code based on current date
// Format: [3 random chars][Y][YY][M][MM]
// Example: PTUY25M09 (Generated in September 2025)
// This makes it easy to identify when the product was created, even years later
const generateUniqueProductCode = (): string => {
  const now = new Date();

  // Generate 3 random uppercase letters
  const randomChars = Array.from({ length: 3 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');

  // Get year (last 2 digits)
  const year = now.getFullYear().toString().slice(-2);

  // Get month (zero-padded)
  const month = (now.getMonth() + 1).toString().padStart(2, '0');

  // Format: [Random3]Y[YY]M[MM]
  return `${randomChars}Y${year}M${month}`;
};

// Size mapping constant: [code, age/description]
const SIZE_MAPPING: Record<string, [string, string]> = {
  // KIDS T-SHIRT
  "Kids · 0": ["0", "0 months"],
  "Kids · S": ["S", "0-3 months"],
  "Kids · M": ["M", "3-6 months"],
  "Kids · 12 (L)": ["12 (L)", "6–9 months"],
  "Kids · 14 (XL)": ["14 (XL)", "1-1.5 years"],
  "Kids · 40cm (16in)": ["40cm (16in)", "1.5-2 years"],
  "Kids · 45cm (18in)": ["45cm (18in)", "2-3 years"],
  "Kids · 50cm (20in)": ["50cm (20in)", "3–4 years"],
  "Kids · 55cm (22in)": ["55cm (22in)", "4-5 years"],
  "Kids · 60cm (24in)": ["60cm (24in)", "5–6 years"],
  "Kids · 65cm (26in)": ["65cm (26in)", "6-7 years"],
  "Kids · 70cm (28in)": ["70cm (28in)", "7-8 years"],
  "Kids · 75cm (30in)": ["75cm (30in)", "8-10 years"],
  "Kids · 80cm (32in)": ["80cm (32in)", "10–11 years"],
  "Kids · 85cm (34in)": ["85cm (34in)", "11–12 years"],
  "Kids · 90cm (36in)": ["90cm (36in)", "12-13 years"],

  // KIDS BOTTOM
  "Kids · 20W": ["20W", "2-3 years"],
  "Kids · 22W": ["22W", "3-4 years"],
  "Kids · 24W": ["24W", "4-5 years"],
  "Kids · 26W": ["26W", "5-6 years"],
  "Kids · 28W": ["28W", "6-7 years"],
  "Kids · 30W": ["30W", "8-9 years"],
  "Kids · 32W": ["32W", "9-10 years"],
  "Kids · 34W": ["34W", "10-11 years"],
  "Kids · 36W": ["36W", "11-12 years"],
  "Kids · 38W": ["38W", "12-13 years"],
  "Kids · 40W": ["40W", "13-14 years"],

  // KIDS SHIRT
  "Kids · 2": ["2", "2-3 years"],
  "Kids · 3": ["3", "3-4 years"],
  "Kids · 4": ["4", "4-5 years"],
  "Kids · 5": ["5", "5- 6 years"],
  "Kids · 6": ["6", "6-7 years"],
  "Kids · 8": ["8", "7-8 years"],
  "Kids · 10": ["10", "9-10 years"],
  "Kids · 12": ["12", "10-11 years"],
  "Kids · 14": ["14", "11-12 years"],
  "Kids · 16": ["16", "12-13 years"],
  "Kids · 18": ["18", "13-14 years"],

  // ADULTS TOP
  "Adult · XS": ["XS", "Adult"],
  "Adult · S": ["S", "Adult"],
  "Adult · M": ["M", "Adult"],
  "Adult · L": ["L", "Adult"],
  "Adult · XL": ["XL", "Adult"],
  "Adult · XXL": ["XXL", "Adult"],
  "Adult · 3XL": ["3XL", "Adult"],

  // ADULTS BOTTOM
  "Adult · 26W": ["26W", "Adult"],
  "Adult · 28W": ["28W", "Adult"],
  "Adult · 30W": ["30W", "Adult"],
  "Adult · 32W": ["32W", "Adult"],
  "Adult · 34W": ["34W", "Adult"],
  "Adult · 36W": ["36W", "Adult"],
  "Adult · 38W": ["38W", "Adult"],
  "Adult · 40W": ["40W", "Adult"],
  "Adult · 42W": ["42W", "Adult"]
};

export default function PrintBarcodeDialog({ openPrintBarcodeDialog, setOpenPrintBarcodeDialog, barcodeMetadata, setBarcodeMetadata, setAlert }: any) {

  const [settingsTab, setSettingsTab] = React.useState<boolean>(true)
  const [barcodes, setBarcodes] = React.useState<Barcode[]>([])
  const [printLoading, setPrintLoading] = React.useState<boolean>(false)

  // Get all unique ages from SIZE_MAPPING
  const allAges = React.useMemo(() => {
    return Array.from(new Set(Object.values(SIZE_MAPPING).map(item => item[1])));
  }, []);

  // Handle per-item size selection
  const handleItemSizeChange = (itemId: string, sizeLabel: string) => {
    const newBarcodeMetadata = barcodeMetadata.map((item: BarcodeMetadata) => {
      if (item.id === itemId) {
        const selectedAge = SIZE_MAPPING[sizeLabel] ? SIZE_MAPPING[sizeLabel][1] : '';
        return { ...item, selectedSize: sizeLabel, selectedAge };
      }
      return item;
    });
    setBarcodeMetadata(newBarcodeMetadata);
  };

  // Handle per-item age selection
  const handleItemAgeChange = (itemId: string, age: string) => {
    const newBarcodeMetadata = barcodeMetadata.map((item: BarcodeMetadata) => {
      if (item.id === itemId) {
        return { ...item, selectedAge: age };
      }
      return item;
    });
    setBarcodeMetadata(newBarcodeMetadata);
  };

  React.useEffect(() => {
    const newBarcodes = [].concat(...barcodeMetadata.map((item: BarcodeMetadata) => {
      const temp = []
      for (let i = 0; i < item.quantity; i++) {
        temp.push({
          itemName: item.itemName,
          value: item.value,
          rate: item.rate,
          mrp: item.mrp,
          sizeLabel: item.selectedSize || '',
          sizeCode: item.selectedSize && SIZE_MAPPING[item.selectedSize] ? SIZE_MAPPING[item.selectedSize][0] : '',
          age: item.selectedAge || '',
          uniqueCode: generateUniqueProductCode(),// Generate unique code for each barcode
          sku: item.sku
        })
      }
      return temp
    }))
    setBarcodes(newBarcodes)
  }, [barcodeMetadata])

  const createPDF = async () => {
    setPrintLoading(true);

    try {

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [75, 50]
      });

      for (let i = 0; i < barcodes.length; i++) {
        const barcode = document.querySelector("#barcode-" + i) as HTMLElement;
        if (!barcode) continue;

        const canvas = await html2canvas(barcode, {
          scale: 2,
          useCORS: true,
          width: barcode.scrollWidth,
          height: barcode.scrollHeight
        });

        const img = canvas.toDataURL("image/png");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // stretch to page, no crop
        pdf.addImage(img, "PNG", 0, 0, pageWidth, pageHeight);

        if (i + 1 < barcodes.length) pdf.addPage();
      }

      pdf.autoPrint();
      window.open(pdf.output("bloburl"), "_blank");
    } catch (e) {
      console.error(e);
    } finally {
      setPrintLoading(false);
    }
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

  // Generate payload for per-item selections
  const generatePayload = () => {
    return barcodeMetadata.map((item: BarcodeMetadata) => ({
      sku: item.sku || item.value,
      id: item.id,
      selectedSize: item.selectedSize || '',
      selectedAge: item.selectedAge || '',
      copies: item.quantity,
      itemName: item.itemName,
      associatedField: item.associatedField,
      value: item.value,
      rate: item.rate,
      mrp: item.mrp
    }));
  };

  // Handle Next button click - validate and proceed to preview
  const handleNext = () => {
    // Check if all items have size and age selected
    const incompleteItems = barcodeMetadata.filter((item: BarcodeMetadata) =>
      !item.selectedSize || !item.selectedAge
    );

    if (incompleteItems.length > 0) {
      setAlert({
        severity: 'warning',
        message: `Please select size and age for all items before proceeding.`
      });
      return;
    }

    // Generate payload and log it (you can send this to your API)
    const payload = generatePayload();
    console.log('Barcode generation payload:', payload);

    setSettingsTab(false);
  };

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
            <Box pt={3} pb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Configure size and age for each item individually below.
              </Typography>
            </Box>
            <Box pt={2}>
              <Box sx={{ display: "flex", gap: "1rem", justifyContent: "space-between" }} pb={2}>
                <Typography variant="overline">Item Details</Typography>
                <Typography variant='overline'>Size & Age</Typography>
                <Typography variant='overline'>Copies</Typography>
              </Box>
              {barcodeMetadata
                .map((item: BarcodeMetadata) => (
                  <Box key={item.id} sx={{ display: "flex", gap: "1rem", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                      <Typography variant='subtitle2'><strong>{item.itemName}</strong></Typography>
                      <Typography variant="subtitle2" gutterBottom>{item.associatedField}: {item.value}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1, minWidth: "300px" }}>
                      <FormControl size="small" sx={{ width: "150px" }}>
                        <InputLabel id={`size-label-${item.id}`}>Size</InputLabel>
                        <Select
                          labelId={`size-label-${item.id}`}
                          value={item.selectedSize || ''}
                          label="Size"
                          onChange={(e) => handleItemSizeChange(item.id, e.target.value)}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 300,
                              },
                            },
                          }}
                        >
                          {Object.keys(SIZE_MAPPING).map((label) => (
                            <MenuItem key={label} value={label}>
                              {label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl size="small" sx={{ width: "150px" }}>
                        <InputLabel id={`age-${item.id}`}>Age</InputLabel>
                        <Select
                          labelId={`age-${item.id}`}
                          value={item.selectedAge || ''}
                          label="Age"
                          onChange={(e) => handleItemAgeChange(item.id, e.target.value)}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 300,
                              },
                            },
                          }}
                        >
                          {allAges.map((age) => (
                            <MenuItem key={age} value={age}>
                              {age}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <TextField
                      id={`copies-${item.id}`}
                      sx={{ width: "80px" }}
                      size='small'
                      type="number"
                      inputProps={{ min: 1, max: 99 }}
                      onChange={(e) => { handleChangeBarcodeQuantity(item.id, e.target.value) }}
                      value={item.quantity}
                      variant="outlined"
                    />
                  </Box>
                ))}
            </Box>
          </DialogContent>
        ) : (
          <DialogContent sx={{
            margin: "0 auto",
            width: 'auto',
            height: 'auto',
            overflowY: barcodes.length > 1 ? 'auto' : 'hidden',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 2,
            p: 2
          }}>
            {
              barcodes.map((item: any, index: number) => (
                <React.Fragment key={index}>
                  <Box
                    id={"barcode-" + index}
                    width="600px"
                    height="580px"
                    // maxWidth="600px"
                    sx={{
                      transform: 'rotate(270deg)',
                      transformOrigin: '(center, center)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <BarcodeTemplate1
                      itemName={barcodes[index].itemName}
                      value={barcodes[index].value}
                      rate={barcodes[index].rate}
                      mrp={barcodes[index].mrp}
                      sizeLabel={barcodes[index].sizeLabel}
                      sizeCode={barcodes[index].sizeCode}
                      age={barcodes[index].age}
                      uniqueCode={barcodes[index].uniqueCode}
                      sku={barcodes[index].sku}
                    />
                  </Box>
                  {barcodes.length > 1 && index < barcodes.length - 1 && (
                    <Box sx={{
                      width: '100%',
                      height: '2px',
                      backgroundColor: '#e0e0e0',
                      margin: '10px 0'
                    }} />
                  )}
                </React.Fragment>
              ))
            }
          </DialogContent>
        )
      }
      {
        settingsTab ? (
          <DialogActions>
            <Button onClick={() => setOpenPrintBarcodeDialog(false)}>Cancel</Button>
            <Button variant='contained' onClick={handleNext}>Next</Button>
          </DialogActions>
        ) : (
          <DialogActions>
            <Button onClick={() => setSettingsTab(true)}>Back</Button>
            <LoadingButton variant='contained' onClick={createPDF} loading={printLoading}>Print</LoadingButton>
          </DialogActions>
        )
      }

    </Dialog>
  );
}