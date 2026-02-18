// Blood Donation Management System - JavaScript

class BloodDonationSystem {
    constructor() {
        this.donors = JSON.parse(localStorage.getItem('donors')) || [];
        this.inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        this.appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        this.recipients = JSON.parse(localStorage.getItem('recipients')) || [];
        this.locations = JSON.parse(localStorage.getItem('locations')) || [];
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDashboard();
        this.renderDonors();
        this.renderInventory();
        this.renderAppointments();
        this.renderRecipients();
        this.renderLocations();
        this.updateCalendar();
        this.updateCharts();
        this.populateDonorSelect();
        this.populateLocationSelects();
        this.updateAlerts();
        this.renderDashboardTable();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchSection(e.target.dataset.section);
            });
        });

        // Donor form
        document.getElementById('add-donor-btn').addEventListener('click', () => {
            this.toggleForm('donor-form-container');
        });

        document.getElementById('donor-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addDonor();
        });

        document.getElementById('cancel-donor').addEventListener('click', () => {
            this.toggleForm('donor-form-container');
            document.getElementById('donor-form').reset();
        });

        // Inventory form
        document.getElementById('add-inventory-btn').addEventListener('click', () => {
            this.toggleForm('inventory-form-container');
        });

        document.getElementById('inventory-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addBloodUnit();
        });

        document.getElementById('cancel-inventory').addEventListener('click', () => {
            this.toggleForm('inventory-form-container');
            document.getElementById('inventory-form').reset();
        });

        // Appointment form
        document.getElementById('add-appointment-btn').addEventListener('click', () => {
            this.toggleForm('appointment-form-container');
        });

        document.getElementById('appointment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAppointment();
        });

        document.getElementById('cancel-appointment').addEventListener('click', () => {
            this.toggleForm('appointment-form-container');
            document.getElementById('appointment-form').reset();
        });

        // Search and filters
        document.getElementById('donor-search').addEventListener('input', (e) => {
            this.filterDonors();
        });

        document.getElementById('blood-type-filter').addEventListener('change', (e) => {
            this.filterDonors();
        });

        // Calendar navigation
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this.updateCalendar();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.updateCalendar();
        });

        // Recipient form
        document.getElementById('add-recipient-btn').addEventListener('click', () => {
            this.toggleForm('recipient-form-container');
        });

        document.getElementById('recipient-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addRecipient();
        });

        document.getElementById('cancel-recipient').addEventListener('click', () => {
            this.toggleForm('recipient-form-container');
            document.getElementById('recipient-form').reset();
        });

        // Location form
        document.getElementById('add-location-btn').addEventListener('click', () => {
            this.toggleForm('location-form-container');
        });

        document.getElementById('location-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addLocation();
        });

        document.getElementById('cancel-location').addEventListener('click', () => {
            this.toggleForm('location-form-container');
            document.getElementById('location-form').reset();
        });

        // Recipient search and filters
        document.getElementById('recipient-search').addEventListener('input', (e) => {
            this.filterRecipients();
        });

        document.getElementById('recipient-blood-type-filter').addEventListener('change', (e) => {
            this.filterRecipients();
        });

        document.getElementById('recipient-priority-filter').addEventListener('change', (e) => {
            this.filterRecipients();
        });

        document.getElementById('recipient-location-filter').addEventListener('change', (e) => {
            this.filterRecipients();
        });

        // Export buttons
        document.getElementById('export-donors').addEventListener('click', () => {
            this.exportData('donors');
        });

        document.getElementById('export-inventory').addEventListener('click', () => {
            this.exportData('inventory');
        });

        document.getElementById('export-appointments').addEventListener('click', () => {
            this.exportData('appointments');
        });

        document.getElementById('export-recipients').addEventListener('click', () => {
            this.exportData('recipients');
        });

        // Set default dates
        this.setDefaultDates();

        // Quick actions
        const qaRegister = document.getElementById('qa-register-donor');
        if (qaRegister) qaRegister.addEventListener('click', () => {
            this.switchSection('donors');
            const form = document.getElementById('donor-form-container');
            if (form && form.style.display === 'none') this.toggleForm('donor-form-container');
        });
        const qaSchedule = document.getElementById('qa-schedule-appointment');
        if (qaSchedule) qaSchedule.addEventListener('click', () => {
            this.switchSection('appointments');
            const form = document.getElementById('appointment-form-container');
            if (form && form.style.display === 'none') this.toggleForm('appointment-form-container');
        });
        const qaReports = document.getElementById('qa-view-reports');
        if (qaReports) qaReports.addEventListener('click', () => {
            this.switchSection('reports');
        });

        // Dashboard table toggle
        const tableType = document.getElementById('dashboard-table-type');
        if (tableType) tableType.addEventListener('change', () => this.renderDashboardTable());
    }

    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const nextMonthStr = nextMonth.toISOString().split('T')[0];

        document.getElementById('collection-date').value = today;
        document.getElementById('expiry-date').value = nextMonthStr;
        document.getElementById('appointment-date').value = today;
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        // Update content based on section
        if (sectionName === 'dashboard') {
            this.updateDashboard();
        } else if (sectionName === 'donors') {
            this.renderDonors();
        } else if (sectionName === 'inventory') {
            this.renderInventory();
        } else if (sectionName === 'appointments') {
            this.renderAppointments();
            this.updateCalendar();
        } else if (sectionName === 'recipients') {
            this.renderRecipients();
            this.renderLocations();
        } else if (sectionName === 'reports') {
            this.updateCharts();
        }
    }

    toggleForm(formId) {
        const form = document.getElementById(formId);
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }

    showMessage(message, type = 'info') {
        const container = document.getElementById('message-container');
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' :
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        messageEl.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }

    // Donor Management
    addDonor() {
        const form = document.getElementById('donor-form');
        const formData = new FormData(form);
        
        const donor = {
            id: Date.now().toString(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            age: parseInt(formData.get('age')),
            bloodType: formData.get('bloodType'),
            weight: parseInt(formData.get('weight')),
            address: formData.get('address'),
            registrationDate: new Date().toISOString(),
            lastDonation: null,
            totalDonations: 0
        };

        // Validate donor
        if (donor.age < 18 || donor.age > 65) {
            this.showMessage('Donor must be between 18 and 65 years old', 'error');
            return;
        }

        if (donor.weight < 50) {
            this.showMessage('Donor must weigh at least 50kg', 'error');
            return;
        }

        // Check for duplicate email
        if (this.donors.some(d => d.email === donor.email)) {
            this.showMessage('A donor with this email already exists', 'error');
            return;
        }

        this.donors.push(donor);
        this.saveData('donors', this.donors);
        this.showMessage('Donor registered successfully!', 'success');
        
        form.reset();
        this.toggleForm('donor-form-container');
        this.renderDonors();
        this.updateDashboard();
        this.populateDonorSelect();
    }

    renderDonors() {
        const tbody = document.getElementById('donors-tbody');
        const filteredDonors = this.getFilteredDonors();
        
        if (filteredDonors.length === 0) {
            tbody.innerHTML = '<tr class="no-data"><td colspan="7">No donors found</td></tr>';
            return;
        }

        tbody.innerHTML = filteredDonors.map(donor => `
            <tr>
                <td>${donor.name}</td>
                <td>${donor.email}</td>
                <td>${donor.phone}</td>
                <td><span class="blood-type-badge">${donor.bloodType}</span></td>
                <td>${donor.age}</td>
                <td>${donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : 'Never'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="bloodSystem.editDonor('${donor.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="bloodSystem.deleteDonor('${donor.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getFilteredDonors() {
        const searchTerm = document.getElementById('donor-search').value.toLowerCase();
        const bloodTypeFilter = document.getElementById('blood-type-filter').value;
        
        return this.donors.filter(donor => {
            const matchesSearch = !searchTerm || 
                donor.name.toLowerCase().includes(searchTerm) ||
                donor.email.toLowerCase().includes(searchTerm) ||
                donor.bloodType.toLowerCase().includes(searchTerm);
            
            const matchesBloodType = !bloodTypeFilter || donor.bloodType === bloodTypeFilter;
            
            return matchesSearch && matchesBloodType;
        });
    }

    filterDonors() {
        this.renderDonors();
    }

    editDonor(id) {
        const donor = this.donors.find(d => d.id === id);
        if (!donor) return;

        // Populate form with donor data
        Object.keys(donor).forEach(key => {
            const input = document.getElementById(`donor-${key}`);
            if (input) {
                input.value = donor[key];
            }
        });

        this.toggleForm('donor-form-container');
        this.showMessage('Edit donor information and submit to save changes', 'info');
    }

    deleteDonor(id) {
        if (confirm('Are you sure you want to delete this donor?')) {
            this.donors = this.donors.filter(d => d.id !== id);
            this.saveData('donors', this.donors);
            this.showMessage('Donor deleted successfully', 'success');
            this.renderDonors();
            this.updateDashboard();
            this.populateDonorSelect();
        }
    }

    // Inventory Management
    addBloodUnit() {
        const form = document.getElementById('inventory-form');
        const formData = new FormData(form);
        
        const bloodUnit = {
            id: 'BU' + Date.now().toString(),
            bloodType: formData.get('bloodType'),
            donorId: formData.get('donorId') || null,
            collectionDate: formData.get('collectionDate'),
            expiryDate: formData.get('expiryDate'),
            storageLocation: formData.get('storageLocation') || 'Default Storage',
            status: formData.get('status'),
            addedDate: new Date().toISOString()
        };

        // Validate dates
        if (new Date(bloodUnit.expiryDate) <= new Date(bloodUnit.collectionDate)) {
            this.showMessage('Expiry date must be after collection date', 'error');
            return;
        }

        this.inventory.push(bloodUnit);
        this.saveData('inventory', this.inventory);
        this.showMessage('Blood unit added successfully!', 'success');
        
        form.reset();
        this.setDefaultDates();
        this.toggleForm('inventory-form-container');
        this.renderInventory();
        this.updateDashboard();
    }

    renderInventory() {
        const tbody = document.getElementById('inventory-tbody');
        
        if (this.inventory.length === 0) {
            tbody.innerHTML = '<tr class="no-data"><td colspan="7">No blood units in inventory</td></tr>';
            return;
        }

        tbody.innerHTML = this.inventory.map(unit => {
            const isExpired = new Date(unit.expiryDate) < new Date();
            const statusClass = isExpired ? 'expired' : unit.status;
            
            return `
                <tr class="${isExpired ? 'expired-row' : ''}">
                    <td>${unit.id}</td>
                    <td><span class="blood-type-badge">${unit.bloodType}</span></td>
                    <td>${new Date(unit.collectionDate).toLocaleDateString()}</td>
                    <td>${new Date(unit.expiryDate).toLocaleDateString()}</td>
                    <td><span class="status-badge ${statusClass}">${isExpired ? 'Expired' : unit.status}</span></td>
                    <td>${unit.storageLocation}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="bloodSystem.updateBloodUnitStatus('${unit.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="bloodSystem.deleteBloodUnit('${unit.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        this.updateBloodTypeStats();
    }

    updateBloodTypeStats() {
        const statsContainer = document.getElementById('blood-type-stats');
        const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        
        const stats = bloodTypes.map(type => {
            const count = this.inventory.filter(unit => 
                unit.bloodType === type && 
                unit.status === 'available' && 
                new Date(unit.expiryDate) > new Date()
            ).length;
            
            let statusClass = '';
            if (count === 0) statusClass = 'critical';
            else if (count < 5) statusClass = 'low-stock';
            
            return `
                <div class="blood-type-card ${statusClass}">
                    <h4>${type}</h4>
                    <div class="count">${count}</div>
                </div>
            `;
        }).join('');

        statsContainer.innerHTML = stats;
    }

    updateBloodUnitStatus(id) {
        const unit = this.inventory.find(u => u.id === id);
        if (!unit) return;

        const newStatus = prompt('Enter new status (available, reserved, used, expired):', unit.status);
        if (newStatus && ['available', 'reserved', 'used', 'expired'].includes(newStatus)) {
            unit.status = newStatus;
            this.saveData('inventory', this.inventory);
            this.showMessage('Blood unit status updated', 'success');
            this.renderInventory();
            this.updateDashboard();
        }
    }

    deleteBloodUnit(id) {
        if (confirm('Are you sure you want to delete this blood unit?')) {
            this.inventory = this.inventory.filter(u => u.id !== id);
            this.saveData('inventory', this.inventory);
            this.showMessage('Blood unit deleted successfully', 'success');
            this.renderInventory();
            this.updateDashboard();
        }
    }

    // Appointment Management
    addAppointment() {
        const form = document.getElementById('appointment-form');
        const formData = new FormData(form);
        
        const appointment = {
            id: 'APT' + Date.now().toString(),
            donorId: formData.get('donorId'),
            date: formData.get('date'),
            time: formData.get('time'),
            type: formData.get('type'),
            notes: formData.get('notes') || '',
            status: 'scheduled',
            createdDate: new Date().toISOString()
        };

        // Check for conflicts
        const conflict = this.appointments.find(apt => 
            apt.date === appointment.date && 
            apt.time === appointment.time && 
            apt.status === 'scheduled'
        );

        if (conflict) {
            this.showMessage('Time slot is already booked', 'error');
            return;
        }

        this.appointments.push(appointment);
        this.saveData('appointments', this.appointments);
        this.showMessage('Appointment scheduled successfully!', 'success');
        
        form.reset();
        this.setDefaultDates();
        this.toggleForm('appointment-form-container');
        this.renderAppointments();
        this.updateCalendar();
        this.updateDashboard();
    }

    renderAppointments() {
        const tbody = document.getElementById('appointments-tbody');
        
        if (this.appointments.length === 0) {
            tbody.innerHTML = '<tr class="no-data"><td colspan="6">No appointments scheduled</td></tr>';
            return;
        }

        // Sort appointments by date and time
        const sortedAppointments = this.appointments.sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateA - dateB;
        });

        tbody.innerHTML = sortedAppointments.map(appointment => {
            const donor = this.donors.find(d => d.id === appointment.donorId);
            const donorName = donor ? donor.name : 'Unknown Donor';
            
            return `
                <tr>
                    <td>${new Date(appointment.date).toLocaleDateString()}</td>
                    <td>${appointment.time}</td>
                    <td>${donorName}</td>
                    <td>${appointment.type}</td>
                    <td><span class="status-badge ${appointment.status}">${appointment.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-success" onclick="bloodSystem.completeAppointment('${appointment.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="bloodSystem.editAppointment('${appointment.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="bloodSystem.cancelAppointment('${appointment.id}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    completeAppointment(id) {
        const appointment = this.appointments.find(a => a.id === id);
        if (!appointment) return;

        appointment.status = 'completed';
        appointment.completedDate = new Date().toISOString();

        // Update donor's last donation
        const donor = this.donors.find(d => d.id === appointment.donorId);
        if (donor && appointment.type === 'donation') {
            donor.lastDonation = appointment.completedDate;
            donor.totalDonations = (donor.totalDonations || 0) + 1;
            this.saveData('donors', this.donors);
        }

        this.saveData('appointments', this.appointments);
        this.showMessage('Appointment completed successfully', 'success');
        this.renderAppointments();
        this.updateCalendar();
        this.updateDashboard();
    }

    editAppointment(id) {
        const appointment = this.appointments.find(a => a.id === id);
        if (!appointment) return;

        const newDate = prompt('Enter new date (YYYY-MM-DD):', appointment.date);
        const newTime = prompt('Enter new time (HH:MM):', appointment.time);
        
        if (newDate && newTime) {
            appointment.date = newDate;
            appointment.time = newTime;
            this.saveData('appointments', this.appointments);
            this.showMessage('Appointment updated successfully', 'success');
            this.renderAppointments();
            this.updateCalendar();
        }
    }

    cancelAppointment(id) {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            const appointment = this.appointments.find(a => a.id === id);
            if (appointment) {
                appointment.status = 'cancelled';
                this.saveData('appointments', this.appointments);
                this.showMessage('Appointment cancelled', 'success');
                this.renderAppointments();
                this.updateCalendar();
                this.updateDashboard();
            }
        }
    }

    // Calendar Management
    updateCalendar() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        document.getElementById('current-month').textContent = 
            `${monthNames[this.currentMonth]} ${this.currentYear}`;

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const calendarGrid = document.getElementById('calendar-grid');
        calendarGrid.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Add calendar days
        const currentDate = new Date(startDate);
        for (let i = 0; i < 42; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            
            if (currentDate.getMonth() !== this.currentMonth) {
                dayEl.classList.add('other-month');
            }
            
            if (currentDate.toDateString() === new Date().toDateString()) {
                dayEl.classList.add('today');
            }

            dayEl.textContent = currentDate.getDate();

            // Check for appointments
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayAppointments = this.appointments.filter(apt => 
                apt.date === dateStr && apt.status === 'scheduled'
            );

            if (dayAppointments.length > 0) {
                dayEl.classList.add('has-appointment');
                const countEl = document.createElement('div');
                countEl.className = 'appointment-count';
                countEl.textContent = dayAppointments.length;
                dayEl.appendChild(countEl);
            }

            calendarGrid.appendChild(dayEl);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    populateDonorSelect() {
        const select = document.getElementById('appointment-donor');
        select.innerHTML = '<option value="">Select Donor</option>';
        
        this.donors.forEach(donor => {
            const option = document.createElement('option');
            option.value = donor.id;
            option.textContent = `${donor.name} (${donor.bloodType})`;
            select.appendChild(option);
        });
    }

    populateLocationSelects() {
        const recipientLocationSelect = document.getElementById('recipient-location');
        const locationFilterSelect = document.getElementById('recipient-location-filter');
        
        // Clear existing options
        recipientLocationSelect.innerHTML = '<option value="">Select Location</option>';
        locationFilterSelect.innerHTML = '<option value="">All Locations</option>';
        
        this.locations.forEach(location => {
            // Add to recipient form select
            const option1 = document.createElement('option');
            option1.value = location.id;
            option1.textContent = `${location.name} (${location.type})`;
            recipientLocationSelect.appendChild(option1);
            
            // Add to filter select
            const option2 = document.createElement('option');
            option2.value = location.id;
            option2.textContent = location.name;
            locationFilterSelect.appendChild(option2);
        });
    }

    // Dashboard Management
    updateDashboard() {
        // Update statistics
        document.getElementById('total-donors').textContent = this.donors.length;
        document.getElementById('total-units').textContent = this.inventory.length;
        document.getElementById('total-recipients').textContent = this.recipients.length;
        document.getElementById('total-locations').textContent = this.locations.length;
        
        const upcomingAppointments = this.appointments.filter(apt => 
            apt.status === 'scheduled' && 
            new Date(apt.date) >= new Date()
        ).length;
        document.getElementById('upcoming-appointments').textContent = upcomingAppointments;

        // Count low stock blood types
        const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const lowStockCount = bloodTypes.filter(type => {
            const count = this.inventory.filter(unit => 
                unit.bloodType === type && 
                unit.status === 'available' && 
                new Date(unit.expiryDate) > new Date()
            ).length;
            return count < 5;
        }).length;
        document.getElementById('low-stock').textContent = lowStockCount;

        // Update recent activity
        this.updateRecentActivity();

        // Update alerts and dashboard table
        this.updateAlerts();
        this.renderDashboardTable();
    }

    // Alerts for low stock types and overdue inventory
    updateAlerts() {
        const container = document.getElementById('alerts-list');
        if (!container) return;

        const alerts = [];
        const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        bloodTypes.forEach(type => {
            const available = this.inventory.filter(u => u.bloodType === type && u.status === 'available' && new Date(u.expiryDate) > new Date()).length;
            if (available === 0) {
                alerts.push({ type: 'low-stock', icon: 'tint', message: `${type} stock is critical (0 units).` });
            } else if (available < 5) {
                alerts.push({ type: 'low-stock', icon: 'tint', message: `${type} stock is low (${available} units).` });
            }
        });

        const overdue = this.inventory.filter(u => new Date(u.expiryDate) < new Date() && u.status !== 'used');
        if (overdue.length > 0) {
            alerts.push({ type: 'overdue', icon: 'exclamation-triangle', message: `${overdue.length} unit(s) are overdue (expired).` });
        }

        if (alerts.length === 0) {
            container.innerHTML = '<p class="no-data">No alerts. Inventory looks good.</p>';
            return;
        }

        container.innerHTML = alerts.map(a => `
            <div class="alert ${a.type}">
                <div class="alert-icon"><i class="fas fa-${a.icon}"></i></div>
                <div class="alert-text">${a.message}</div>
            </div>
        `).join('');
    }

    // Dashboard table rendering
    renderDashboardTable() {
        const tableType = document.getElementById('dashboard-table-type');
        const type = tableType ? tableType.value : 'donors';
        const thead = document.getElementById('dashboard-table-thead');
        const tbody = document.getElementById('dashboard-table-tbody');
        const title = document.getElementById('dashboard-table-title');
        if (!thead || !tbody || !title) return;

        if (type === 'inventory') {
            title.textContent = 'Recent Blood Units';
            thead.innerHTML = '<tr><th>Unit ID</th><th>Blood Type</th><th>Collection</th><th>Expiry</th><th>Status</th></tr>';
            const recent = [...this.inventory]
                .sort((a,b) => new Date(b.addedDate) - new Date(a.addedDate))
                .slice(0, 8);
            if (recent.length === 0) {
                tbody.innerHTML = '<tr class="no-data"><td colspan="5">No blood units yet</td></tr>';
            } else {
                tbody.innerHTML = recent.map(u => `
                    <tr>
                        <td>${u.id}</td>
                        <td><span class="blood-type-badge">${u.bloodType}</span></td>
                        <td>${new Date(u.collectionDate).toLocaleDateString()}</td>
                        <td>${new Date(u.expiryDate).toLocaleDateString()}</td>
                        <td><span class="status-badge ${new Date(u.expiryDate) < new Date() ? 'expired' : u.status}">${new Date(u.expiryDate) < new Date() ? 'Expired' : u.status}</span></td>
                    </tr>
                `).join('');
            }
        } else {
            title.textContent = 'Recent Donors';
            thead.innerHTML = '<tr><th>Name</th><th>Email</th><th>Phone</th><th>Blood Type</th><th>Registered</th></tr>';
            const recent = [...this.donors]
                .sort((a,b) => new Date(b.registrationDate) - new Date(a.registrationDate))
                .slice(0, 8);
            if (recent.length === 0) {
                tbody.innerHTML = '<tr class="no-data"><td colspan="5">No donors yet</td></tr>';
            } else {
                tbody.innerHTML = recent.map(d => `
                    <tr>
                        <td>${d.name}</td>
                        <td>${d.email}</td>
                        <td>${d.phone}</td>
                        <td><span class="blood-type-badge">${d.bloodType}</span></td>
                        <td>${new Date(d.registrationDate).toLocaleDateString()}</td>
                    </tr>
                `).join('');
            }
        }
    }

    updateRecentActivity() {
        const activityList = document.getElementById('activity-list');
        const activities = [];

        // Add recent donors
        const recentDonors = this.donors
            .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
            .slice(0, 3);
        
        recentDonors.forEach(donor => {
            activities.push({
                type: 'donor',
                message: `New donor registered: ${donor.name}`,
                time: new Date(donor.registrationDate),
                icon: 'user-plus',
                color: '#007bff'
            });
        });

        // Add recent appointments
        const recentAppointments = this.appointments
            .filter(apt => apt.status === 'scheduled')
            .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`))
            .slice(0, 2);

        recentAppointments.forEach(appointment => {
            const donor = this.donors.find(d => d.id === appointment.donorId);
            activities.push({
                type: 'appointment',
                message: `Appointment scheduled: ${donor ? donor.name : 'Unknown'} - ${appointment.type}`,
                time: new Date(`${appointment.date} ${appointment.time}`),
                icon: 'calendar-plus',
                color: '#28a745'
            });
        });

        // Add recent recipients
        const recentRecipients = this.recipients
            .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
            .slice(0, 2);
        
        recentRecipients.forEach(recipient => {
            activities.push({
                type: 'recipient',
                message: `New recipient registered: ${recipient.name} (${recipient.priority} priority)`,
                time: new Date(recipient.registrationDate),
                icon: 'user-injured',
                color: '#dc3545'
            });
        });

        // Sort by time and take latest 5
        activities.sort((a, b) => b.time - a.time);
        const recentActivities = activities.slice(0, 5);

        if (recentActivities.length === 0) {
            activityList.innerHTML = '<p class="no-data">No recent activity</p>';
            return;
        }

        activityList.innerHTML = recentActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon" style="background-color: ${activity.color}">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-info">
                    <h4>${activity.message}</h4>
                    <p>${activity.time.toLocaleString()}</p>
                </div>
            </div>
        `).join('');
    }

    // Charts and Reports
    updateCharts() {
        this.updateDonationChart();
        this.updateBloodTypeChart();
    }

    updateDonationChart() {
        const ctx = document.getElementById('donation-chart');
        if (!ctx) return;

        const last6Months = [];
        const donationData = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
            last6Months.push(monthStr);

            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            
            const donations = this.appointments.filter(apt => {
                const aptDate = new Date(`${apt.date} ${apt.time}`);
                return apt.status === 'completed' && 
                       apt.type === 'donation' &&
                       aptDate >= monthStart && 
                       aptDate <= monthEnd;
            }).length;

            donationData.push(donations);
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last6Months,
                datasets: [{
                    label: 'Donations',
                    data: donationData,
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    updateBloodTypeChart() {
        const ctx = document.getElementById('blood-type-pie-chart');
        if (!ctx) return;

        const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ];

        const data = bloodTypes.map(type => {
            return this.donors.filter(donor => donor.bloodType === type).length;
        });

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: bloodTypes,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    // Recipient Management
    addRecipient() {
        const form = document.getElementById('recipient-form');
        const formData = new FormData(form);
        
        const recipient = {
            id: 'RCP' + Date.now().toString(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            age: parseInt(formData.get('age')),
            bloodType: formData.get('bloodType'),
            gender: formData.get('gender'),
            location: formData.get('location'),
            priority: formData.get('priority'),
            medicalId: formData.get('medicalId') || null,
            doctor: formData.get('doctor') || null,
            address: formData.get('address') || '',
            medicalNotes: formData.get('medicalNotes') || '',
            registrationDate: new Date().toISOString(),
            status: 'active'
        };

        // Validate recipient
        if (recipient.age < 0 || recipient.age > 120) {
            this.showMessage('Please enter a valid age', 'error');
            return;
        }

        // Check for duplicate email
        if (this.recipients.some(r => r.email === recipient.email)) {
            this.showMessage('A recipient with this email already exists', 'error');
            return;
        }

        this.recipients.push(recipient);
        this.saveData('recipients', this.recipients);
        this.showMessage('Recipient registered successfully!', 'success');
        
        form.reset();
        this.toggleForm('recipient-form-container');
        this.renderRecipients();
        this.updateDashboard();
    }

    renderRecipients() {
        const tbody = document.getElementById('recipients-tbody');
        const filteredRecipients = this.getFilteredRecipients();
        
        if (filteredRecipients.length === 0) {
            tbody.innerHTML = '<tr class="no-data"><td colspan="9">No recipients found</td></tr>';
            return;
        }

        tbody.innerHTML = filteredRecipients.map(recipient => {
            const location = this.locations.find(l => l.id === recipient.location);
            const locationName = location ? location.name : 'Unknown Location';
            
            return `
                <tr>
                    <td>${recipient.name}</td>
                    <td>${recipient.email}</td>
                    <td>${recipient.phone}</td>
                    <td><span class="blood-type-badge">${recipient.bloodType}</span></td>
                    <td>${recipient.age}</td>
                    <td>${locationName}</td>
                    <td><span class="priority-badge ${recipient.priority.toLowerCase()}">${recipient.priority}</span></td>
                    <td>${new Date(recipient.registrationDate).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="bloodSystem.editRecipient('${recipient.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="bloodSystem.deleteRecipient('${recipient.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    getFilteredRecipients() {
        const searchTerm = document.getElementById('recipient-search').value.toLowerCase();
        const bloodTypeFilter = document.getElementById('recipient-blood-type-filter').value;
        const priorityFilter = document.getElementById('recipient-priority-filter').value;
        const locationFilter = document.getElementById('recipient-location-filter').value;
        
        return this.recipients.filter(recipient => {
            const matchesSearch = !searchTerm || 
                recipient.name.toLowerCase().includes(searchTerm) ||
                recipient.email.toLowerCase().includes(searchTerm) ||
                recipient.bloodType.toLowerCase().includes(searchTerm);
            
            const matchesBloodType = !bloodTypeFilter || recipient.bloodType === bloodTypeFilter;
            const matchesPriority = !priorityFilter || recipient.priority === priorityFilter;
            const matchesLocation = !locationFilter || recipient.location === locationFilter;
            
            return matchesSearch && matchesBloodType && matchesPriority && matchesLocation;
        });
    }

    filterRecipients() {
        this.renderRecipients();
    }

    editRecipient(id) {
        const recipient = this.recipients.find(r => r.id === id);
        if (!recipient) return;

        // Populate form with recipient data
        Object.keys(recipient).forEach(key => {
            const input = document.getElementById(`recipient-${key}`);
            if (input) {
                input.value = recipient[key];
            }
        });

        this.toggleForm('recipient-form-container');
        this.showMessage('Edit recipient information and submit to save changes', 'info');
    }

    deleteRecipient(id) {
        if (confirm('Are you sure you want to delete this recipient?')) {
            this.recipients = this.recipients.filter(r => r.id !== id);
            this.saveData('recipients', this.recipients);
            this.showMessage('Recipient deleted successfully', 'success');
            this.renderRecipients();
            this.updateDashboard();
        }
    }

    // Location Management
    addLocation() {
        const form = document.getElementById('location-form');
        const formData = new FormData(form);
        
        const location = {
            id: 'LOC' + Date.now().toString(),
            name: formData.get('name'),
            type: formData.get('type'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip: formData.get('zip') || '',
            phone: formData.get('phone') || '',
            capacity: parseInt(formData.get('capacity')) || 0,
            createdDate: new Date().toISOString(),
            status: 'active'
        };

        // Check for duplicate location name
        if (this.locations.some(l => l.name === location.name && l.city === location.city)) {
            this.showMessage('A location with this name already exists in this city', 'error');
            return;
        }

        this.locations.push(location);
        this.saveData('locations', this.locations);
        this.showMessage('Location added successfully!', 'success');
        
        form.reset();
        this.toggleForm('location-form-container');
        this.renderLocations();
        this.populateLocationSelects();
        this.updateDashboard();
    }

    renderLocations() {
        const grid = document.getElementById('locations-grid');
        
        if (this.locations.length === 0) {
            grid.innerHTML = '<p class="no-data">No locations added yet</p>';
            return;
        }

        grid.innerHTML = this.locations.map(location => {
            const locationIcon = this.getLocationIcon(location.type);
            const locationClass = location.type.toLowerCase().replace(' ', '-');
            return `
                <div class="location-card">
                    <div class="location-card-header">
                        <div class="location-logo ${locationClass}">
                            <i class="${locationIcon}"></i>
                        </div>
                        <div class="location-info">
                            <h4>${location.name}</h4>
                            <div class="location-type location-type-badge ${locationClass}">${location.type}</div>
                        </div>
                    </div>
                    <div class="location-details">
                        <div class="location-address">
                            <i class="fas fa-map-marker-alt"></i>
                            ${location.address}, ${location.city}, ${location.state} ${location.zip}
                        </div>
                        ${location.phone ? `<div class="location-phone"><i class="fas fa-phone"></i> ${location.phone}</div>` : ''}
                        ${location.capacity > 0 ? `<div class="location-capacity"><i class="fas fa-boxes"></i> Capacity: ${location.capacity} units</div>` : ''}
                    </div>
                    <div class="location-actions">
                        <button class="btn btn-sm btn-primary" onclick="bloodSystem.editLocation('${location.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="bloodSystem.deleteLocation('${location.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    editLocation(id) {
        const location = this.locations.find(l => l.id === id);
        if (!location) return;

        // Populate form with location data
        Object.keys(location).forEach(key => {
            const input = document.getElementById(`location-${key}`);
            if (input) {
                input.value = location[key];
            }
        });

        this.toggleForm('location-form-container');
        this.showMessage('Edit location information and submit to save changes', 'info');
    }

    deleteLocation(id) {
        if (confirm('Are you sure you want to delete this location?')) {
            // Check if any recipients are using this location
            const recipientsUsingLocation = this.recipients.filter(r => r.location === id);
            if (recipientsUsingLocation.length > 0) {
                this.showMessage(`Cannot delete location. ${recipientsUsingLocation.length} recipient(s) are assigned to this location.`, 'error');
                return;
            }

            this.locations = this.locations.filter(l => l.id !== id);
            this.saveData('locations', this.locations);
            this.showMessage('Location deleted successfully', 'success');
            this.renderLocations();
            this.populateLocationSelects();
            this.updateDashboard();
        }
    }

    getLocationIcon(locationType) {
        const iconMap = {
            'Hospital': 'fas fa-hospital',
            'Clinic': 'fas fa-clinic-medical',
            'Blood Bank': 'fas fa-tint',
            'Emergency Center': 'fas fa-ambulance',
            'Mobile Unit': 'fas fa-truck-medical'
        };
        return iconMap[locationType] || 'fas fa-map-marker-alt';
    }

    // Data Export
    exportData(type) {
        let data, filename;
        
        switch (type) {
            case 'donors':
                data = this.donors;
                filename = 'donors.csv';
                break;
            case 'inventory':
                data = this.inventory;
                filename = 'inventory.csv';
                break;
            case 'appointments':
                data = this.appointments;
                filename = 'appointments.csv';
                break;
            case 'recipients':
                data = this.recipients;
                filename = 'recipients.csv';
                break;
            default:
                return;
        }

        if (data.length === 0) {
            this.showMessage('No data to export', 'warning');
            return;
        }

        const csv = this.convertToCSV(data);
        this.downloadCSV(csv, filename);
        this.showMessage(`${type} data exported successfully`, 'success');
    }

    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') ? 
                    `"${value}"` : value;
            });
            csvRows.push(values.join(','));
        });
        
        return csvRows.join('\n');
    }

    downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Data Persistence
    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
}

// Initialize the system when the page loads
let bloodSystem;
document.addEventListener('DOMContentLoaded', () => {
    bloodSystem = new BloodDonationSystem();
});

// Add some CSS for status badges and blood type badges
const additionalStyles = `
    .blood-type-badge {
        background: #dc3545;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .status-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: capitalize;
    }
    
    .status-badge.available {
        background: #d4edda;
        color: #155724;
    }
    
    .status-badge.reserved {
        background: #fff3cd;
        color: #856404;
    }
    
    .status-badge.used {
        background: #f8d7da;
        color: #721c24;
    }
    
    .status-badge.expired {
        background: #d1ecf1;
        color: #0c5460;
    }
    
    .status-badge.scheduled {
        background: #d1ecf1;
        color: #0c5460;
    }
    
    .status-badge.completed {
        background: #d4edda;
        color: #155724;
    }
    
    .status-badge.cancelled {
        background: #f8d7da;
        color: #721c24;
    }
    
    .expired-row {
        background-color: #f8d7da !important;
        opacity: 0.7;
    }
`;

// Add the additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
