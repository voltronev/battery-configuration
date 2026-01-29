# Battery Pack Configuration Dashboard

## 🔋 Overview
A professional, interactive dashboard for designing custom battery pack configurations with real-time connection diagrams and specifications.

## ✨ Features

### 🎯 Step-by-Step Configuration Wizard
- **Step 1: Cell Configuration** - Select cell type, voltage, capacity, and quantity
- **Step 2: Pack Configuration** - Define series/parallel arrangement (e.g., 2S2P)
- **Step 3: Protection & Output** - Configure BMS, discharge limits, and connectors

### 📊 Real-Time Calculations
- **Pack Voltage** - Automatically calculated based on series configuration
- **Pack Capacity** - Calculated from parallel configuration
- **Total Energy** - Displayed in Watt-hours (Wh)
- **Max Power** - Based on discharge current rating

### 🎨 Visual Connection Diagrams
- **Dynamic SVG Generation** - Creates professional wiring diagrams
- **Series-First or Parallel-First** - Choose your connection strategy
- **BMS Integration** - Visual representation of protection circuitry
- **Zoom Controls** - Zoom in/out and reset view

### 💾 Save & Export
- **Save Configuration** - Export as JSON for later use
- **Export Diagram** - Download connection diagram as SVG

## 🚀 How to Use

### Access the Dashboard
The dashboard is currently running on a local server:
**Open your browser and navigate to:** `http://localhost:8080`

### Configuration Steps

#### Step 1: Cell Configuration
1. Select your **cell type** (18650, 21700, 26650, etc.)
2. Enter the **nominal voltage** (e.g., 3.7V for Li-ion, 3.2V for LiFePO4)
3. Enter the **cell capacity** in mAh
4. Specify the **total number of cells** you have

#### Step 2: Pack Configuration
1. Enter **cells in series (S)** - This determines your pack voltage
   - Example: 2S = 7.4V (2 × 3.7V)
2. Enter **cells in parallel (P)** - This determines your pack capacity
   - Example: 2P = 6000mAh (2 × 3000mAh)
3. Choose **connection type**:
   - **Series First**: Connect cells in series, then parallel groups
   - **Parallel First**: Connect cells in parallel, then series strings

#### Step 3: Protection & Output
1. Enable **BMS Protection** (recommended for safety)
2. Set **max discharge current** in Amperes
3. Select **output connector** type (XT60, XT90, Anderson, etc.)
4. Select **balance connector** for charging (JST-XH, JST-PH, etc.)

### Generate Diagram
Click the **"Generate Diagram"** button to create a visual connection diagram showing:
- Individual cell positions
- Positive (+) and negative (-) terminals
- Wire connections (series and parallel)
- BMS protection module
- Output terminals

### Save Your Work
- **Save Icon** (💾): Download configuration as JSON
- **Export Icon** (⬇️): Download diagram as SVG image

## 📐 Understanding Configurations

### Common Configurations

| Config | Voltage | Capacity | Use Case |
|--------|---------|----------|----------|
| 1S1P | 3.7V | 3000mAh | Small devices, USB power |
| 2S2P | 7.4V | 6000mAh | RC cars, drones |
| 3S1P | 11.1V | 3000mAh | FPV drones |
| 4S2P | 14.8V | 6000mAh | E-bikes, power tools |
| 6S3P | 22.2V | 9000mAh | E-scooters, large drones |
| 13S4P | 48V | 12000mAh | E-bikes, solar storage |

### Voltage Calculations
- **Nominal Voltage** = Cell Voltage × Series Count
- **Max Voltage** = 4.2V × Series Count (for Li-ion)
- **Min Voltage** = 3.0V × Series Count (for Li-ion)

### Capacity Calculations
- **Pack Capacity** = Cell Capacity × Parallel Count
- **Total Energy** = Voltage × Capacity (in Wh)

### Power Calculations
- **Max Power** = Voltage × Max Discharge Current

## 🎨 Design Features

### Modern UI/UX
- **Glassmorphism** - Frosted glass effect with backdrop blur
- **Gradient Orbs** - Animated floating background elements
- **Smooth Animations** - Micro-interactions on hover and click
- **Dark Theme** - Easy on the eyes with vibrant accent colors

### Color Coding
- **🔵 Blue (Primary)** - Voltage-related stats
- **🟣 Purple (Secondary)** - Capacity-related stats
- **🟢 Green (Success)** - Energy and BMS protection
- **🟡 Yellow (Warning)** - Power and discharge ratings

## 🔧 Technical Specifications

### Supported Cell Types
- **18650** - 3.7V Li-ion (most common)
- **21700** - 3.7V Li-ion (higher capacity)
- **26650** - 3.2V LiFePO4 (safer chemistry)
- **32650** - 3.2V LiFePO4 (high capacity)
- **Pouch Cells** - Custom configurations

### Connector Types
- **XT60** - 60A continuous (most popular for RC)
- **XT90** - 90A continuous (high power)
- **Anderson PowerPole** - Modular, professional
- **Deans/T-Plug** - Compact, high current
- **JST** - Low current applications
- **Custom** - Your own connector

### Balance Connectors
- **JST-XH** - Standard for most chargers
- **JST-PH** - Compact alternative
- **Molex** - Industrial applications

## ⚠️ Safety Warnings

### Always Use BMS Protection
A Battery Management System (BMS) protects against:
- **Overcharge** - Prevents cell damage from excessive voltage
- **Over-discharge** - Prevents deep discharge damage
- **Overcurrent** - Limits discharge to safe levels
- **Short circuit** - Emergency protection
- **Cell balancing** - Keeps cells at equal voltage

### Important Safety Tips
1. ✅ **Never** bypass BMS protection
2. ✅ **Always** use proper fuses
3. ✅ **Match** cell capacities and ages
4. ✅ **Balance charge** regularly
5. ✅ **Monitor** cell voltages
6. ✅ **Use** proper wire gauge for current
7. ✅ **Insulate** all connections properly
8. ✅ **Test** before final assembly

## 📱 Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 🛠️ Files Included
- `index.html` - Main dashboard structure
- `styles.css` - Modern styling and animations
- `script.js` - Interactive functionality and calculations
- `README.md` - This documentation

## 🎯 Example Use Cases

### 1. E-Bike Battery (48V 12Ah)
- Configuration: **13S4P**
- Cell Type: 18650 (3000mAh)
- Total Cells: 52
- Voltage: 48V nominal
- Capacity: 12000mAh (12Ah)
- Energy: 576Wh

### 2. Drone Battery (11.1V 5Ah)
- Configuration: **3S2P**
- Cell Type: 21700 (5000mAh)
- Total Cells: 6
- Voltage: 11.1V nominal
- Capacity: 10000mAh (10Ah)
- Energy: 111Wh

### 3. Portable Power Bank (7.4V 10Ah)
- Configuration: **2S5P**
- Cell Type: 18650 (2000mAh)
- Total Cells: 10
- Voltage: 7.4V nominal
- Capacity: 10000mAh (10Ah)
- Energy: 74Wh

## 📞 Tips & Tricks

### Optimizing Your Design
1. **Higher voltage** = More efficient power delivery
2. **Higher capacity** = Longer runtime
3. **Match cell ages** = Better performance and safety
4. **Use quality cells** = Longer lifespan
5. **Proper BMS sizing** = Match to max discharge current

### Common Mistakes to Avoid
- ❌ Mixing different cell capacities
- ❌ Using cells with different ages
- ❌ Undersized BMS
- ❌ Insufficient wire gauge
- ❌ No fuse protection
- ❌ Poor insulation

## 🔄 Updates & Features
This dashboard provides:
- ✅ Real-time calculations
- ✅ Visual connection diagrams
- ✅ Multiple configuration options
- ✅ Export capabilities
- ✅ Professional design

---

**Made with ⚡ by Antigravity AI**

*Always follow proper battery safety guidelines and local regulations when building battery packs.*
