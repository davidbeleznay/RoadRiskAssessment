# Photos & PDF Integration Instructions

## What's Been Created:

1. PhotoCapture component - src/components/PhotoCapture.jsx
2. PDF export utility - src/utils/pdfExport.js
3. Updated assessmentStorage to save photos
4. Updated dataExport for complete CSV

## To Activate:

### Add to RoadRiskForm.js:

Line 8 - Import:
import { PhotoCapture } from '../components/PhotoCapture';

Line ~895 - In Field Notes section:
<PhotoCapture onPhotoSaved={(photos) => console.log('Photos:', photos.length)} />

### Add to HistoryPage.js:

Line 2 - Import:
import { exportToPDF } from '../utils/pdfExport';

Line ~180 - Add PDF button before View Details

## Testing Branch:

This is on feature/photos-and-pdf branch for safe testing.
Merge to main when working!
