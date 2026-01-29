# 🚀 Quick Start Guide

## Your Battery Pack Dashboard is Ready!

### 📍 Access the Dashboard

**The server is running!** Open your web browser and go to:

```
http://localhost:8080
```

Or click this link: [Open Dashboard](http://localhost:8080)

---

## 🎯 Quick Configuration Example

Based on your sketches, here's how to configure a **2S2P battery pack**:

### Step 1: Cell Configuration
1. **Cell Type**: Select "18650 Li-ion" (or your preferred type)
2. **Cell Voltage**: Enter `3.7` (for standard Li-ion)
3. **Cell Capacity**: Enter `3000` (or your cell's mAh rating)
4. **Number of Cells**: Enter `4` (for 2S2P configuration)
5. Click **"Next"** →

### Step 2: Pack Configuration
1. **Cells in Series (S)**: Enter `2`
   - This gives you: 2 × 3.7V = **7.4V pack voltage**
2. **Cells in Parallel (P)**: Enter `2`
   - This gives you: 2 × 3000mAh = **6000mAh capacity**
3. **Connection Type**: Choose your preferred method
   - ✅ **Series First**: Recommended for most applications
   - ⚪ **Parallel First**: Alternative method
4. Click **"Next"** →

### Step 3: Protection & Output
1. ✅ **Enable BMS Protection** (highly recommended!)
2. **Max Discharge**: Enter `30` (Amperes)
3. **Output Connector**: Select "XT60" (or your preference)
4. **Balance Connector**: Select "JST-XH" (standard)
5. Click **"Generate Diagram"** 🎨

---

## 📊 What You'll See

### Real-Time Stats (Top Right)
- ⚡ **Pack Voltage**: 7.4V
- 🔋 **Pack Capacity**: 6000mAh
- ⏱️ **Total Energy**: 44.4Wh
- 🔌 **Max Power**: 222W

### Connection Diagram (Center)
- Visual representation of your 2S2P configuration
- Shows all 4 cells with proper connections
- Displays positive (+) and negative (-) terminals
- Shows wire routing (series and parallel)
- Includes BMS protection module
- Output terminals clearly marked

### Specifications (Bottom)
- Configuration: 2S2P
- Nominal Voltage: 7.4V
- Max Voltage: 8.4V (fully charged)
- Min Voltage: 6.0V (discharged)
- Total Capacity: 6000mAh
- Max Discharge: 30A

---

## 💾 Save Your Work

### Save Configuration
Click the **💾 Save icon** (top right) to download your configuration as JSON.

### Export Diagram
Click the **⬇️ Export icon** (top right) to download the wiring diagram as SVG.

---

## 🎨 Interactive Features

### Zoom Controls
- **🔍+** Zoom In
- **🔍-** Zoom Out
- **🔄** Reset View

### Step Navigation
- **← Previous**: Go back to previous step
- **Next →**: Advance to next step
- **✓ Generate**: Create the connection diagram

---

## 🔧 Try Different Configurations

### Common Examples:

#### Small Power Bank (1S2P)
- Series: 1, Parallel: 2
- Result: 3.7V, 6000mAh

#### RC Car Battery (2S3P)
- Series: 2, Parallel: 3
- Result: 7.4V, 9000mAh

#### Drone Battery (3S2P)
- Series: 3, Parallel: 2
- Result: 11.1V, 6000mAh

#### E-Bike Battery (13S4P)
- Series: 13, Parallel: 4
- Result: 48V, 12000mAh

---

## ⚠️ Important Safety Notes

### Before Building Your Pack:
1. ✅ Always use cells with **matching capacity**
2. ✅ Use cells from the **same batch/age**
3. ✅ Install a **BMS** for protection
4. ✅ Use proper **wire gauge** for your current
5. ✅ Add **fuse protection**
6. ✅ Insulate all connections properly
7. ✅ Test voltage before final assembly

### Never:
- ❌ Mix different cell types
- ❌ Mix old and new cells
- ❌ Bypass BMS protection
- ❌ Use damaged cells
- ❌ Short circuit terminals

---

## 🎯 Understanding Your Configuration

### What is 2S2P?
- **2S** = 2 cells in **Series** (voltage adds up)
  - Cell 1: 3.7V + Cell 2: 3.7V = **7.4V total**
  
- **2P** = 2 cells in **Parallel** (capacity adds up)
  - Cell 1: 3000mAh + Cell 2: 3000mAh = **6000mAh total**

### Total Cells Needed
- 2S × 2P = **4 cells total**

### Wiring Pattern
The dashboard shows you exactly how to connect:
1. Connect 2 cells in parallel (Group 1)
2. Connect 2 cells in parallel (Group 2)
3. Connect Group 1 and Group 2 in series
4. Add BMS protection
5. Connect output terminals

---

## 🌟 Pro Tips

### For Best Results:
1. **Match Internal Resistance**: Use cells with similar IR
2. **Balance Charge**: Always use balance charging
3. **Monitor Temperatures**: During first charge/discharge
4. **Label Everything**: Mark positive/negative clearly
5. **Document Your Build**: Save the configuration JSON

### Optimization:
- **Higher Voltage** (more S) = More efficient power delivery
- **Higher Capacity** (more P) = Longer runtime
- **Quality Cells** = Better performance and safety

---

## 📞 Need Help?

### Check the Full Documentation
See `README.md` for complete details, examples, and technical specifications.

### Common Issues:
- **Cells don't match?** Verify series/parallel counts
- **Wrong voltage?** Check cell nominal voltage setting
- **Diagram not showing?** Click "Generate Diagram" button

---

## 🎉 You're All Set!

Your professional battery pack configuration dashboard is ready to use!

**Open your browser now:** http://localhost:8080

Happy building! ⚡🔋

---

*Made with ⚡ by Antigravity AI*
