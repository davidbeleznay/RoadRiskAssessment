# AI-Forester-App

A web application for forestry professionals to perform field calculations and collect data.

## 🌐 **Live Demo - Test with Your Roads!**

**Try it now:** https://davidbeleznay.github.io/DigitalForesterApp

- ✅ **No installation required** - works on any device with a web browser
- ✅ **Mobile-friendly** - designed for field use on phones and tablets  
- ✅ **GPS integration** - captures coordinates for assessment locations
- ✅ **Auto-save** - your work is saved automatically in your browser
- ✅ **Professional tools** - official methodology with climate projections

**Perfect for testing:** Any forest roads you know well (takes 10-15 minutes per assessment)

## 📋 **What You Can Test**

### Road Risk Assessment Tool ✅
- **Official scoring methodology** with 4-point scale (2, 4, 6, 10)
- **5 hazard factors:** Terrain stability, slope grade, geology, drainage, failure history
- **4 consequence factors:** Water proximity, structure capacity, usage, environmental values
- **Risk levels:** Low (80-250), Moderate (251-750), High (751-1400), Very High (1401-2000)
- **Professional recommendations** based on final risk classification

### Culvert Sizing Tool ✅  
- **Climate-aware sizing** with BC coastal projections (PCIC/EGBC recommendations)
- **Multiple methods:** California Method (default), Hydraulic calculations, Method comparison
- **Climate factor presets:** 2030 (+10%), 2050 (+20%), 2080 (+30%), 2100 (+30%)
- **Debris assessment:** 5-factor evaluation with hazard classification
- **Fish passage requirements** with automatic embedment calculations

## 🚀 **Share with Others - Three Easy Ways**

### Option 1: Send the Link (Easiest)
Just share: https://davidbeleznay.github.io/DigitalForesterApp
- Works on any device with internet
- No setup required for users
- Updates automatically

### Option 2: Use Email Templates
Use the provided email templates for professional outreach:
- **Colleagues:** Professional testing invitation
- **Field crews:** Simple mobile testing guide  
- **Management:** Business case and demo
- **Technical users:** Open source collaboration

### Option 3: Social Media Sharing
Ready-to-use posts for LinkedIn, Twitter, and professional networks included.

## 💻 **Local Development Setup**

```bash
# Clone the repository
git clone https://github.com/davidbeleznay/DigitalForesterApp.git
cd DigitalForesterApp

# Install dependencies
npm install

# Start the development server
npm start

# Open your browser to http://localhost:3000
```

## 🔧 **Deploy Your Own Version**

### GitHub Pages (Free)
```bash
# Install deployment dependency
npm install --save-dev gh-pages

# Deploy to GitHub Pages
npm run deploy

# Your app will be available at:
# https://yourusername.github.io/DigitalForesterApp
```

### Automated Deployment
The repository includes GitHub Actions for automatic deployment on every push to main branch.

## 📊 **Current Status**

The application features a fully implemented Road Risk Assessment tool with official scoring methodology and comprehensive form sections, plus a **COMPLETE** Culvert Sizing Tool with climate change projections for coastal British Columbia. Both tools provide structured data collection with local storage persistence and support for editing existing assessments.

## 🔥 **Key Features**

### Road Risk Assessment Tool - FULLY IMPLEMENTED ✅
- **Official Scoring Methodology**: Uses proper 4-point scale (2, 4, 6, 10) matching forest road risk assessment standards
- **Complete 5-Section Form**: Basic Information, Hazard Factors, Consequence Factors, Optional Assessments, and Results
- **Matrix Risk Assessment**: Professional hazard × consequence risk calculation with official score ranges
- **Official Hazard Factors**: Terrain Stability, Slope Grade, Geology/Soil Type, Drainage Conditions, and Failure History
- **Official Consequence Factors**: Proximity to Water, Drainage Structure Capacity, Public/Industrial Use, and Environmental/Cultural Values
- **Interactive Scoring**: Beautiful button-style rating options with color-coded indicators and detailed explanations
- **Professional Override**: Direct risk level override with required justification and audit trail
- **Management Recommendations**: Official recommendations based on final risk level classification
- **Real-time Calculations**: Live hazard and consequence score totals with instant risk matrix results
- **Comprehensive Results**: Risk matrix visualization, score breakdown, and professional recommendations
- **Local Storage Persistence**: All form data automatically saved and restored between sessions
- **Enhanced Navigation**: Sticky section navigation with beautiful tab design and progress indicators
- **COMPLETE Optional Assessments**: Full geotechnical and infrastructure evaluation modules

### Culvert Sizing Tool - FULLY RESTORED WITH ALL FEATURES ✅
- **COMPLETE 4-Section Workflow**: Site Information, Stream Measurements, Sizing Method & Options, and Results
- **BC Coastal Climate Projections**: Integrated PCIC & EGBC climate change factors for coastal British Columbia
- **Climate Factor Presets**: Professional preset options for 2030, 2050, 2080, and 2100 planning horizons
- **With/Without Climate Comparison**: Side-by-side display showing culvert sizing with and without climate factors
- **Professional Method Selection**: Choose between California Method (Default), Hydraulic Calculation, or Method Comparison
- **Interactive Method Display**: Clear visualization of selected vs. reference methods in results
- **Comprehensive Debris Assessment**: 5-factor debris transport evaluation with hazard classification (LOW/MODERATE/HIGH)
- **Debris Multiplier Application**: Automatic area multipliers (1.00/1.20/1.40) based on hazard assessment
- **Multiple Stream Measurements**: Add/remove measurements for top width, optional bottom width, and depth
- **Real-time Averaging**: Dynamic calculation and display of measurement averages and stream area
- **GPS Location Capture**: Browser geolocation integration for precise site coordinates
- **Fish Passage Requirements**: Toggle for fish-bearing streams with automatic embedment calculations
- **Hydraulic Parameters**: Conditional display of slope, roughness, and HW/D ratio inputs when needed
- **Professional Validation**: Comprehensive form validation with method-specific requirements
- **Assessment Persistence**: Full save/restore functionality for editing existing culvert assessments
- **Enhanced Results Display**: Method-aware results with climate comparison and debris factor analysis

### Enhanced Climate Change Features ✅
- **Coastal BC Specific**: Climate factors based on PCIC (Pacific Climate Impacts Consortium) and EGBC (Engineers and Geoscientists BC) recommendations
- **Professional Presets**: 
  - **Present–2030**: F_CC = 1.10 (+10% - PCIC & EGBC suggest for short-term upgrades)
  - **Mid-century (2050)**: F_CC = 1.20 (+20% - Rule-of-thumb used by EGBC when local data are sparse)
  - **Late-century (2080+)**: F_CC = 1.30 (+30% coast / +25% interior - Consistent with hydrologic projections)
- **Comparison Display**: Shows both current climate sizing and climate-adjusted sizing side-by-side
- **Professional Rationale**: Detailed explanations of climate factor selections with scientific backing
- **Method Integration**: Climate factors work with all sizing methods (California, Hydraulic, Comparison)

### General Features ✅
- **Consistent Design Language**: Both tools share the same professional ribbon navigation interface
- **History Tracking**: Save assessment records with details and timestamps
- **GPS Integration**: Capture coordinates for assessment locations
- **Photo Documentation**: Placeholder for field photo integration
- **Responsive Design**: Works on desktop and mobile devices with optimized layouts
- **Modern UI**: Professional design with gradients, shadows, and smooth animations
- **Edit Support**: Load and modify existing assessments from history
- **Professional Validation**: Form validation ensures data quality and completeness

## 📱 **Testing Scenarios**

### Road Risk Testing
```yaml
Scenario 1 - Low Risk Forest Access Road:
  - Terrain: Gentle slopes, stable geology
  - Drainage: Good systems, no flooding history  
  - Traffic: Minimal, forest service only
  - Expected: Low Risk (80-250 points)

Scenario 2 - High Risk Main Haul Road:
  - Terrain: Steep grades, unstable slopes
  - Drainage: Undersized culverts, flooding
  - Traffic: Heavy trucks, public access
  - Expected: High/Very High Risk (751-2000 points)
```

### Culvert Sizing Testing
```yaml
Scenario 1 - Small Forest Creek:
  - Stream: 0.5-1.0m wide, 0.2-0.4m deep
  - Fish: No, Climate: Present conditions
  - Expected: ~600-900mm diameter

Scenario 2 - Fish-Bearing Stream:
  - Stream: 1.5-2.0m wide, 0.4-0.6m deep  
  - Fish: Yes, Climate: 2050 (+20%)
  - Expected: ~1200-1800mm, embedded design
```

## 🐛 **Feedback & Support**

**Found an issue or have suggestions?**
- **GitHub Issues**: https://github.com/davidbeleznay/DigitalForesterApp/issues
- **Email**: dbeleznay09@gmail.com
- **Test with real roads** and let us know how accurate the results are!

**What we'd love feedback on:**
- Accuracy compared to your professional judgment
- Mobile usability in field conditions  
- Missing features for your workflow
- Technical issues or bugs

## 🔄 **Latest Updates**

### 2025-06-02 - DEPLOYMENT READY ✅
- **NEW**: GitHub Pages deployment configuration for easy sharing
- **NEW**: Automated deployment with GitHub Actions
- **NEW**: Comprehensive testing guide for users
- **NEW**: Email templates for professional sharing
- **NEW**: Live demo available at: https://davidbeleznay.github.io/DigitalForesterApp
- **ENHANCED**: Ready for widespread testing and feedback collection

### 2025-05-30 - MAJOR RESTORATION: Complete Culvert Sizing Tool Implementation ✅
- **FEATURE COMPLETE**: Fully restored CulvertSizingForm with complete 4-section workflow after previous simplification
- **NEW**: Complete Site Information section with culvert ID, road name, and GPS coordinate capture with browser geolocation
- **NEW**: Complete Stream Measurements section with multi-measurement inputs and real-time averaging display
- **NEW**: Complete Settings section with method selection, hydraulic parameters, climate factors, and debris assessment
- **NEW**: Complete Results section with comprehensive calculation display and climate/debris comparison
- **NEW**: Professional ribbon navigation matching Road Risk Assessment design language
- **NEW**: Comprehensive form validation with real-time error feedback and method-specific validation
- **NEW**: Assessment save/restore functionality for editing existing culvert assessments with full state management
- **NEW**: Dynamic measurement input system - add/remove measurements with automatic averaging display
- **NEW**: Conditional parameter display - hydraulic parameters only shown when required by selected method
- **NEW**: Professional climate factor preset selection with detailed descriptions and scientific rationale
- **NEW**: Enhanced GPS integration with browser geolocation, coordinate validation, and error handling
- **NEW**: Fish passage toggle with automatic embedment depth calculation and 1.2× width requirements
- **NEW**: Navigation system with section progression, validation checkpoints, and progress tracking
- **NEW**: Complete Debris Transport Assessment - 5-factor evaluation with hazard classification and area multipliers
- **NEW**: Professional method selection interface with three options and clear recommendations
- **NEW**: Bottom width measurements toggle for incised channels with proper trapezoidal geometry
- **ENHANCED**: Method selection interface with clear recommendations, status indicators, and conditional parameters
- **ENHANCED**: Climate change integration with BC coastal projections and side-by-side comparison display
- **ENHANCED**: Professional styling with consistent color coding, visual hierarchy, and responsive design
- **ENHANCED**: Mobile-responsive design with optimized form layouts and touch-friendly controls
- **TECHNICAL**: Complete state management for all form sections with localStorage persistence and edit support
- **TECHNICAL**: Comprehensive error handling and validation for all input types with real-time feedback
- **TECHNICAL**: Integration with CulvertCalculator utility and CulvertResults component with proper prop handling
- **TECHNICAL**: Enhanced navigation logic with section validation, progress tracking, and conditional advancement
- **UI**: Professional measurement input interface with add/remove functionality and unit labels
- **UI**: Real-time calculation display showing measurement averages, stream area, and geometry
- **UI**: Climate factor preset cards with professional descriptions, F_CC values, and selection indicators
- **UI**: Method selection cards with recommendations, conditional parameter display, and status badges
- **UI**: Comprehensive debris assessment interface with 5-factor checklist and mitigation strategy selection
- **UI**: Enhanced GPS capture interface with coordinate validation, accuracy indicators, and error messages
- **UI**: Professional form styling with enhanced colors, spacing, animations, and visual feedback

## 🏗️ **Technical Architecture**

### Unified Design System - Ribbon Navigation Interface ✅

Both the Road Risk Assessment and Culvert Sizing tools now share a consistent design language:

**Shared Navigation Pattern:**
- **Ribbon Navigation**: Sticky navigation bar with color-coded sections
- **Section Icons**: Meaningful icons for each section (📋 📏 ⚙️ 📊)
- **Progress Indicators**: Visual progress tracking across form sections
- **Color Coding**: Consistent color scheme across both tools
- **Interactive Elements**: Hover effects and smooth transitions

**Consistent Styling:**
- **Professional Headers**: Section headers with gradient accent bars
- **Form Elements**: Unified form input styling and validation
- **Button Design**: Consistent button styling with gradients and hover effects
- **Responsive Layout**: Mobile-optimized design across both tools
- **Visual Hierarchy**: Consistent typography and spacing

### Road Risk Assessment System - Complete Implementation

The application implements the official professional risk assessment system methodology:

**Official Scoring System:**
- **4-Point Scale**: 2 (Low), 4 (Moderate), 6 (High), 10 (Very High)
- **Hazard Factors**: 5 factors (Terrain Stability, Slope Grade, Geology/Soil, Drainage Conditions, Failure History)
- **Consequence Factors**: 4 factors (Proximity to Water, Drainage Structure Capacity, Public/Industrial Use, Environmental/Cultural Values)
- **Score Ranges**: Hazard 10-50, Consequence 8-40, Final Risk 80-2000
- **Risk Categories**: Low (80-250), Moderate (251-750), High (751-1400), Very High (1401-2000)

### Culvert Sizing System - Complete Implementation with Climate Projections

**Comprehensive Sizing Method Options:**
1. **California Method (Default/Recommended)**: Industry standard using bankfull area × 3 with table lookup
2. **Hydraulic Calculation**: Advanced Manning's equation approach with slope and roughness parameters
3. **Method Comparison**: Conservative approach using the larger of both California and Hydraulic methods

**Enhanced Climate Change Integration:**
- **BC Coastal Projections**: Based on PCIC & EGBC recommendations for coastal British Columbia
- **Professional Presets**: Four planning horizons (2030, 2050, 2080, 2100) with scientifically-backed climate factors
- **Comparison Analysis**: Side-by-side display of current vs. climate-adjusted sizing
- **Method Integration**: Climate factors work seamlessly with all three sizing methods

## 📁 **Project Structure**

```
AI-Forester-App/
├── .github/workflows/    # Automated deployment
│   └── deploy.yml        # GitHub Actions workflow
├── src/
│   ├── components/       # Reusable UI components
│   │   └── culvert/      # Culvert-specific components
│   │       ├── CulvertResults.jsx    # FIXED results display ✅
│   │       └── CulvertResults.css    # Enhanced styling ✅
│   ├── navigation/       # Router configuration
│   │   └── AppRouter.js  # COMPLETE router with edit routes ✅
│   ├── pages/            # Main form pages
│   │   ├── RoadRiskForm.js      # COMPLETE Road Risk assessment ✅
│   │   ├── CulvertSizingForm.js # FULLY RESTORED with all features ✅
│   │   └── HistoryPage.js       # Assessment history
│   ├── screens/          # Screen components
│   │   └── HomeScreen.js        # Landing page with tool selection
│   ├── styles/           # CSS files for styling
│   │   ├── index.css                 # Enhanced main styles
│   │   ├── enhanced-form.css         # SHARED ribbon navigation ✅
│   │   ├── form-elements.css         # Base form styling
│   │   ├── optional-assessments.css  # Optional assessment styling ✅
│   │   ├── culvert-form.css          # COMPLETE culvert styling ✅
│   │   └── RoadRiskForm.css          # Results section styling
│   └── utils/            # Utility functions
│       ├── MatrixRiskAssessment.js   # Official risk calculator ✅
│       ├── CulvertCalculator.js      # FIXED culvert sizing ✅
│       └── storageUtils.js           # Local storage functions
└── package.json          # Dependencies with deployment config ✅
```

## 🎯 **Next Steps**

1. **Test with real roads** - Use the live demo with forest roads you know
2. **Share with colleagues** - Use the email templates to get feedback
3. **Report issues** - Help improve the tool by reporting bugs
4. **Contribute** - The project is open source and welcomes contributions
5. **Deploy your own** - Set up your own version if needed

## 📄 **Dependencies**

- React (web application framework)
- React Router (client-side routing with edit support)
- CSS3 (modern styling with gradients, animations, and responsive design)
- HTML5 Geolocation API (GPS coordinates)
- localStorage (client-side data persistence)
- GitHub Pages (free deployment and hosting)

## ⚖️ **Professional Use Notes**

This application is designed for use by qualified forestry professionals, engineers, and technicians. Both tools provide complete workflows for systematic evaluation using professional methodologies with a unified, intuitive interface that reduces user error and improves data quality while maintaining professional standards and regulatory compliance requirements.

The Culvert Sizing Tool now includes professional climate change projections specifically calibrated for coastal British Columbia, based on recommendations from PCIC (Pacific Climate Impacts Consortium) and EGBC (Engineers and Geoscientists BC). The climate factor presets provide scientifically-backed multipliers for different planning horizons, helping professionals design resilient infrastructure for future climate conditions.

The complete debris transport assessment evaluates 5 key hazard indicators and automatically classifies debris risk as LOW, MODERATE, or HIGH, applying appropriate area multipliers (1.00/1.20/1.40) to ensure adequate culvert capacity for debris transport. HIGH hazard classifications trigger recommendations for Professional Engineer review.

**IMPORTANT**: The application now provides a complete, professional-grade workflow that:
- ✅ **Functions end-to-end** from site information through measurements, settings, and professional results
- ✅ **Properly calculates results** that scale with stream dimensions (450mm to 3600mm range)
- ✅ **Displays comprehensive results** with climate comparisons, debris assessments, and method analysis
- ✅ **Provides realistic sizing** with proper California Method table lookup and hydraulic calculations
- ✅ **Supports full workflow** including GPS capture, multiple measurements, validation, and assessment persistence
- ✅ **Includes professional features** like climate projections, debris assessment, and method comparison
- ✅ **Ready for widespread testing** with live demo and deployment infrastructure

## 🤝 **Contributing**

1. Create feature branches for new development
2. Follow consistent code style with JSDoc comments  
3. Test on multiple device sizes before submitting changes
4. Update the changelog with your changes
5. Ensure compliance with professional standards and climate science recommendations
6. Maintain modern UI design principles and accessibility standards

---

**Ready to test?** Click here: https://davidbeleznay.github.io/DigitalForesterApp