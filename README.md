# Blood Donation Management System

A comprehensive web-based blood donation management system built with HTML, CSS, and JavaScript. This system provides a clean, professional interface for managing donors, blood inventory, appointments, and generating reports.

## Features

### 🏥 Dashboard
- Real-time statistics overview
- Recent activity tracking
- Quick access to key metrics
- Visual indicators for low stock alerts

### 👥 Donor Management
- **Registration Form**: Complete donor information capture
- **Search & Filter**: Find donors by name, email, or blood type
- **Validation**: Age (18-65), weight (50kg+), email uniqueness
- **Edit/Delete**: Manage donor records
- **Blood Type Tracking**: Support for all blood types (A+, A-, B+, B-, AB+, AB-, O+, O-)

### 🩸 Blood Inventory
- **Unit Management**: Add, track, and manage blood units
- **Status Tracking**: Available, Reserved, Used, Expired
- **Storage Location**: Track physical storage locations
- **Expiry Monitoring**: Automatic expiry date tracking
- **Blood Type Statistics**: Visual overview of inventory levels
- **Low Stock Alerts**: Automatic identification of critical levels

### 📅 Appointment Scheduling
- **Calendar View**: Visual monthly calendar with appointment indicators
- **Scheduling**: Book appointments for donations, screenings, follow-ups
- **Conflict Detection**: Prevent double-booking
- **Status Management**: Track scheduled, completed, cancelled appointments
- **Donor Integration**: Link appointments to registered donors

### 🏥 Recipient Management
- **Registration Form**: Complete recipient information capture with medical details
- **Priority System**: Critical, High, Medium, Low priority levels
- **Location Assignment**: Link recipients to service locations
- **Search & Filter**: Find recipients by name, email, blood type, priority, or location
- **Medical Information**: Track medical record ID, attending doctor, and medical notes
- **Edit/Delete**: Manage recipient records with validation

### 📍 Location Management
- **Service Locations**: Manage hospitals, clinics, blood banks, emergency centers, mobile units
- **Location Details**: Address, contact information, storage capacity
- **Location Types**: Categorized by facility type with color-coded badges
- **Capacity Tracking**: Monitor blood storage capacity at each location
- **Recipient Assignment**: Link recipients to specific service locations

### 📊 Reports & Analytics
- **Donation Trends**: 6-month donation history chart
- **Blood Type Distribution**: Pie chart of donor blood types
- **Data Export**: CSV export for donors, inventory, appointments, and recipients
- **Visual Charts**: Interactive charts using Chart.js

## Technical Features

### 🎨 User Interface
- **Clean Design**: Professional white background with red accent colors
- **Responsive Layout**: Mobile-friendly design
- **Modern UI**: Card-based layout with smooth animations
- **Accessibility**: Proper form labels and keyboard navigation
- **Icons**: Font Awesome icons for better visual communication

### 💾 Data Management
- **Local Storage**: All data persisted in browser localStorage
- **Form Validation**: Client-side validation with user feedback
- **Real-time Updates**: Instant UI updates when data changes
- **Data Integrity**: Validation rules prevent invalid data entry

### 🔧 Development Features
- **Modular Code**: Well-organized JavaScript classes
- **Event Handling**: Comprehensive event listeners
- **Error Handling**: User-friendly error messages
- **Performance**: Efficient DOM manipulation and data rendering

## File Structure

```
blood-donation/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality
└── README.md          # Documentation
```

## Getting Started

1. **Clone or Download**: Get the project files
2. **Open in Browser**: Simply open `index.html` in any modern web browser
3. **Start Using**: No installation or setup required!

## Usage Guide

### Adding a New Donor
1. Navigate to the "Donors" section
2. Click "Add New Donor"
3. Fill in the required information:
   - Full Name, Email, Phone (required)
   - Age (18-65), Weight (50kg+), Blood Type (required)
   - Address (optional)
4. Click "Register Donor"

### Adding a New Recipient
1. Navigate to the "Recipients" section
2. Click "Add New Recipient"
3. Fill in the required information:
   - Full Name, Email, Phone, Age, Blood Type, Gender (required)
   - Service Location, Priority Level (required)
   - Medical Record ID, Attending Doctor (optional)
   - Address, Medical Notes (optional)
4. Click "Register Recipient"

### Managing Service Locations
1. Go to the "Recipients" section
2. Scroll to "Service Locations" area
3. Click "Add Location"
4. Enter location details:
   - Location Name, Type, Address, City, State (required)
   - ZIP Code, Phone, Storage Capacity (optional)
5. Save the location

### Managing Blood Inventory
1. Go to the "Inventory" section
2. Click "Add Blood Unit"
3. Enter blood type, collection date, expiry date
4. Set storage location and status
5. Save the unit

### Scheduling Appointments
1. Visit the "Appointments" section
2. Click "Schedule Appointment"
3. Select donor, date, time, and type
4. Add any notes
5. Confirm the appointment

### Viewing Reports
1. Navigate to the "Reports" section
2. View donation trends and blood type distribution
3. Export data as CSV files for external analysis

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Data Persistence

All data is stored locally in your browser's localStorage. This means:
- ✅ No server required
- ✅ Data persists between sessions
- ✅ Fast performance
- ⚠️ Data is browser-specific (not shared between devices)

## Customization

The system is designed for easy customization:

### Styling
- Modify `styles.css` to change colors, fonts, or layout
- Update the color scheme by changing CSS custom properties
- Adjust responsive breakpoints for different screen sizes

### Functionality
- Extend `script.js` to add new features
- Add new form fields by updating HTML and JavaScript
- Integrate with backend APIs by modifying data persistence methods

### Forms
- Add new validation rules in the JavaScript validation functions
- Create additional form sections by copying existing form patterns
- Customize form layouts using the existing CSS grid system

## Future Enhancements

Potential improvements for production use:

1. **Backend Integration**: Connect to a database server
2. **User Authentication**: Add login and role-based access
3. **Email Notifications**: Send appointment reminders
4. **Advanced Reporting**: More detailed analytics and charts
5. **Mobile App**: Native mobile application
6. **API Integration**: Connect with hospital management systems
7. **Data Backup**: Cloud storage integration
8. **Multi-language Support**: Internationalization

## Support

This is a front-end prototype designed for fast development and testing. For production use, consider:

- Adding server-side validation
- Implementing proper security measures
- Setting up regular data backups
- Adding user authentication
- Integrating with existing hospital systems

## License

This project is open source and available under the MIT License.
