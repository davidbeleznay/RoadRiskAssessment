# Road Risk Assessment - Changelog

## v2.7.0 (2026-01-04)

### Added
- ✅ **EGBC/FPBC 3.7.2 Inspection Report Compliance**
  - Priority Actions (maintenance & repair recommendations)
  - Specialist requirements checkbox and notes
  - Next inspection schedule with auto-date calculation
  - Inspector certification (professional designation)
  
- ✅ **Smart Auto-Date Calculation**
  - Semi-Annual → +6 months from assessment date
  - Annual → +12 months
  - Bi-Annual → +24 months
  - Tri-Annual → +36 months
  - After Storm Events → No fixed date
  - Custom → Manual date entry

- ✅ **Section 11 Compliance (WSA)**
  - Auto-detects culvert replacement/installation work
  - Smart detection in Priority Actions and QuickCapture points
  - Orange warning box with LRM notification requirements
  - Appears in both UI and PDF export

- ✅ **Edit Mode for Saved Assessments**
  - Edit button in Assessment History
  - Load and pre-populate all existing data
  - Update existing records instead of duplicating
  - Visual "Editing" indicator
  - Works for both LMH and Scorecard methods

- ✅ **Enhanced PDF Export**
  - Inspection Report section with all compliance fields
  - Section 11 notice (if culvert work detected)
  - "QuickCapture Reference Lines/Points" section title
  - "EGBC/FPBC Compliant" in footer
  - v2.7.0 version in footer

### Changed
- Updated PDF section headers for clarity
- Improved inspection schedule workflow
- Enhanced database functions to support updates

### Technical
- Added `getAssessmentDB(id)` function
- Updated `saveAssessmentDB()` to handle create/update
- Added navigation state handling for edit mode
- Improved error handling for assessment loading

---

## v2.6.0 (2026-01-03)

### Added
- Multi-segment LMH assessment capability
- Toggle buttons for Entire Road vs Risk Segments
- Segment-level observations and QuickCapture
- Point descriptions in summary display
- Field notes integration

### Changed
- Improved summary display with conditional content
- Removed photos from line features (QuickCapture constraint)
- Enhanced segment detail cards

---

## v2.5.0 (2025-12-15)

### Added
- QuickCapture integration for GPS and field photos
- Offline capability with IndexedDB
- Service worker for PWA functionality
- Professional PDF generation with jsPDF

### Changed
- Migrated from localStorage to IndexedDB
- Improved mobile responsiveness

---

## Earlier Versions
See Git history for detailed changelog of v2.0.0 and earlier.
