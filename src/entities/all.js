// Mock data for demonstration purposes
const mockLeads = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1234567890",
    created_date: "2024-01-15",
    status: "New",
    source: "Website",
    interest_area: "Software Development",
    last_contacted: "2024-01-18",
    notes: "Interested in full-stack development course"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1234567891",
    created_date: "2024-01-16",
    status: "Contacted",
    source: "Facebook",
    interest_area: "Data Science",
    last_contacted: "2024-01-19",
    notes: "Looking for data analytics training"
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@email.com",
    phone: "+1234567892",
    created_date: "2024-01-17",
    status: "Qualified",
    source: "Referral",
    interest_area: "UI/UX Design",
    last_contacted: null,
    notes: "Referred by existing client"
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice.brown@email.com",
    phone: "+1234567893",
    created_date: "2024-01-18",
    status: "Needs Follow-Up",
    source: "LinkedIn",
    interest_area: "Project Management",
    last_contacted: "2024-01-20",
    notes: "Interested in PMP certification"
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie.wilson@email.com",
    phone: "+1234567894",
    created_date: "2024-01-19",
    status: "Converted",
    source: "WhatsApp",
    interest_area: "Digital Marketing",
    last_contacted: "2024-01-21",
    notes: "Enrolled in digital marketing course"
  }
];

const mockApplications = [
  {
    id: 1,
    client_name: "John Doe",
    client_email: "john.doe@email.com",
    country: "Canada",
    visa_type: "Express Entry",
    status: "In Progress",
    cv_status: "Uploaded",
    created_date: "2024-01-19",
    updated_date: "2024-01-20",
    case_number: "EE-2024-001",
    completion_percentage: 75,
    assigned_consultant: "Sarah Johnson"
  },
  {
    id: 2,
    client_name: "Jane Smith",
    client_email: "jane.smith@email.com",
    country: "Canada",
    visa_type: "Provincial Nominee Program",
    status: "Processing",
    cv_status: "Needs Update",
    created_date: "2024-01-18",
    updated_date: "2024-01-19",
    case_number: "PNP-2024-002",
    completion_percentage: 60,
    assigned_consultant: "Mike Chen"
  },
  {
    id: 3,
    client_name: "Bob Johnson",
    client_email: "bob.johnson@email.com",
    country: "Australia",
    visa_type: "Work Permit",
    status: "Submitted",
    cv_status: "Approved",
    created_date: "2024-01-17",
    updated_date: "2024-01-18",
    case_number: "WP-2024-003",
    completion_percentage: 90,
    assigned_consultant: "Sarah Johnson"
  },
  {
    id: 4,
    client_name: "Alice Brown",
    client_email: "alice.brown@email.com",
    country: "United Kingdom",
    visa_type: "Study Permit",
    status: "Under Review",
    cv_status: "Uploaded",
    created_date: "2024-01-16",
    updated_date: "2024-01-17",
    case_number: "SP-2024-004",
    completion_percentage: 85,
    assigned_consultant: "David Lee"
  },
  {
    id: 5,
    client_name: "Charlie Wilson",
    client_email: "charlie.wilson@email.com",
    country: "Canada",
    visa_type: "Family Sponsorship",
    status: "Draft",
    cv_status: "Not Uploaded",
    created_date: "2024-01-15",
    updated_date: "2024-01-16",
    case_number: "FS-2024-005",
    completion_percentage: 25,
    assigned_consultant: "Emma Davis"
  },
  {
    id: 6,
    client_name: "Diana Prince",
    client_email: "diana.prince@email.com",
    country: "New Zealand",
    visa_type: "Skilled Worker",
    status: "Approved",
    cv_status: "Approved",
    created_date: "2024-01-14",
    updated_date: "2024-01-15",
    case_number: "SW-2024-006",
    completion_percentage: 100,
    assigned_consultant: "Sarah Johnson"
  }
];

const mockTasks = [
  {
    id: 1,
    title: "Follow up with Express Entry client",
    description: "Contact John Doe regarding missing documents",
    due_date: "2024-01-23",
    status: "Pending",
    type: "Follow-up",
    priority: "High",
    created_date: "2024-01-19",
    client_name: "John Doe",
    assigned_to: "Sarah Johnson"
  },
  {
    id: 2,
    title: "Review LMIA application documents",
    description: "Complete document review for Jane Smith",
    due_date: "2024-01-22",
    status: "Completed",
    type: "Document Review",
    priority: "Medium",
    created_date: "2024-01-18",
    client_name: "Jane Smith",
    assigned_to: "Mike Chen"
  },
  {
    id: 3,
    title: "Schedule consultation call",
    description: "Initial consultation for PNP application",
    due_date: "2024-01-24",
    status: "Pending",
    type: "Call",
    priority: "Medium",
    created_date: "2024-01-17",
    client_name: "Bob Johnson",
    assigned_to: "David Lee"
  },
  {
    id: 4,
    title: "Prepare PNP application",
    description: "Compile all documents for submission",
    due_date: "2024-01-25",
    status: "In Progress",
    type: "Application Review",
    priority: "High",
    created_date: "2024-01-16",
    client_name: "Alice Brown",
    assigned_to: "Sarah Johnson"
  },
  {
    id: 5,
    title: "Submit work permit application",
    description: "Final submission to IRCC",
    due_date: "2024-01-21",
    status: "Pending",
    type: "Application Review",
    priority: "Urgent",
    created_date: "2024-01-15",
    client_name: "Charlie Wilson",
    assigned_to: "Emma Davis"
  },
  {
    id: 6,
    title: "Request updated CV from client",
    description: "CV needs to be updated with recent experience",
    due_date: "2024-01-20",
    status: "Pending",
    type: "CV Update",
    priority: "Low",
    created_date: "2024-01-14",
    client_name: "Diana Prince",
    assigned_to: "Mike Chen"
  },
  {
    id: 7,
    title: "Payment follow-up",
    description: "Outstanding invoice for consultation services",
    due_date: "2024-01-19",
    status: "Pending",
    type: "Payment Follow-up",
    priority: "Medium",
    created_date: "2024-01-13",
    client_name: "Frank Miller",
    assigned_to: "Emma Davis"
  }
];



// Mock API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const Lead = {
  async list(orderBy = 'created_date') {
    await delay(500); // Simulate API call
    let sorted = [...mockLeads];

    if (orderBy.startsWith('-')) {
      const field = orderBy.substring(1);
      sorted.sort((a, b) => new Date(b[field]) - new Date(a[field]));
    } else {
      sorted.sort((a, b) => new Date(a[orderBy]) - new Date(b[orderBy]));
    }

    return sorted;
  },

  async create(leadData) {
    await delay(300);
    const newLead = {
      id: Math.max(...mockLeads.map(l => l.id)) + 1,
      ...leadData,
      created_date: new Date().toISOString().split('T')[0],
      last_contacted: null
    };
    mockLeads.push(newLead);
    return newLead;
  },

  async update(id, updates) {
    await delay(300);
    const index = mockLeads.findIndex(l => l.id === id);
    if (index !== -1) {
      mockLeads[index] = { ...mockLeads[index], ...updates };
      return mockLeads[index];
    }
    throw new Error('Lead not found');
  },

  async delete(id) {
    await delay(300);
    const index = mockLeads.findIndex(l => l.id === id);
    if (index !== -1) {
      mockLeads.splice(index, 1);
      return true;
    }
    throw new Error('Lead not found');
  }
};

export const Application = {
  async list(orderBy = 'created_date', limit = null) {
    await delay(500);
    let sorted = [...mockApplications];

    if (orderBy.startsWith('-')) {
      const field = orderBy.substring(1);
      sorted.sort((a, b) => new Date(b[field]) - new Date(a[field]));
    } else {
      sorted.sort((a, b) => new Date(a[orderBy]) - new Date(b[orderBy]));
    }

    return limit ? sorted.slice(0, limit) : sorted;
  },

  async create(applicationData) {
    await delay(300);
    const newApplication = {
      id: Math.max(...mockApplications.map(a => a.id)) + 1,
      ...applicationData,
      created_date: new Date().toISOString().split('T')[0],
      updated_date: new Date().toISOString().split('T')[0]
    };
    mockApplications.push(newApplication);
    return newApplication;
  }
};

export const Task = {
  async list(orderBy = 'created_date', limit = null) {
    await delay(500);
    let sorted = [...mockTasks];

    if (orderBy.startsWith('-')) {
      const field = orderBy.substring(1);
      sorted.sort((a, b) => new Date(b[field]) - new Date(a[field]));
    } else {
      sorted.sort((a, b) => new Date(a[orderBy]) - new Date(b[orderBy]));
    }

    return limit ? sorted.slice(0, limit) : sorted;
  },

  async create(taskData) {
    await delay(300);
    const newTask = {
      id: Math.max(...mockTasks.map(t => t.id)) + 1,
      ...taskData,
      created_date: new Date().toISOString().split('T')[0],
      assigned_to: taskData.assigned_to || 'Unassigned'
    };
    mockTasks.push(newTask);
    return newTask;
  },

  async update(id, updates) {
    await delay(300);
    const index = mockTasks.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTasks[index] = { ...mockTasks[index], ...updates };
      return mockTasks[index];
    }
    throw new Error('Task not found');
  },

  async delete(id) {
    await delay(300);
    const index = mockTasks.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTasks.splice(index, 1);
      return true;
    }
    throw new Error('Task not found');
  }
};

// Mock Calls Data
const mockCalls = [
  {
    id: 1,
    client_name: "John Doe",
    client_contact: "john.doe@email.com",
    purpose: "Initial Consultation - Express Entry",
    scheduled_date: "2024-01-23T10:00:00",
    duration_minutes: 60,
    status: "Scheduled",
    notes: "Discuss eligibility and documentation requirements",
    consultant: "Sarah Johnson",
    call_type: "Video Call"
  },
  {
    id: 2,
    client_name: "Jane Smith",
    client_contact: "jane.smith@email.com",
    purpose: "Document Review - PNP Application",
    scheduled_date: "2024-01-23T14:30:00",
    duration_minutes: 45,
    status: "Scheduled",
    notes: "Review submitted documents and next steps",
    consultant: "Mike Chen",
    call_type: "Phone Call"
  },
  {
    id: 3,
    client_name: "Bob Johnson",
    client_contact: "bob.johnson@email.com",
    purpose: "Follow-up - Work Permit Status",
    scheduled_date: "2024-01-24T09:00:00",
    duration_minutes: 30,
    status: "Scheduled",
    notes: "Update on application progress",
    consultant: "David Lee",
    call_type: "Video Call"
  },
  {
    id: 4,
    client_name: "Alice Brown",
    client_contact: "alice.brown@email.com",
    purpose: "Study Permit Consultation",
    scheduled_date: "2024-01-22T16:00:00",
    duration_minutes: 60,
    status: "Completed",
    notes: "Discussed program selection and requirements",
    consultant: "Sarah Johnson",
    call_type: "Video Call"
  },
  {
    id: 5,
    client_name: "Charlie Wilson",
    client_contact: "charlie.wilson@email.com",
    purpose: "Family Sponsorship Planning",
    scheduled_date: "2024-01-25T11:00:00",
    duration_minutes: 90,
    status: "Scheduled",
    notes: "Comprehensive family sponsorship strategy",
    consultant: "Emma Davis",
    call_type: "In-Person"
  },
  {
    id: 6,
    client_name: "Diana Prince",
    client_contact: "diana.prince@email.com",
    purpose: "Application Submission Review",
    scheduled_date: "2024-01-21T13:00:00",
    duration_minutes: 45,
    status: "Completed",
    notes: "Final review before submission",
    consultant: "Mike Chen",
    call_type: "Phone Call"
  }
];

export const Call = {
  async list(orderBy = 'scheduled_date', limit = null) {
    await delay(500);
    let sorted = [...mockCalls];

    if (orderBy.startsWith('-')) {
      const field = orderBy.substring(1);
      sorted.sort((a, b) => new Date(b[field]) - new Date(a[field]));
    } else {
      sorted.sort((a, b) => new Date(a[orderBy]) - new Date(b[orderBy]));
    }

    return limit ? sorted.slice(0, limit) : sorted;
  },

  async create(callData) {
    await delay(300);
    const newCall = {
      id: Math.max(...mockCalls.map(c => c.id)) + 1,
      ...callData,
      status: 'Scheduled'
    };
    mockCalls.push(newCall);
    return newCall;
  },

  async update(id, updates) {
    await delay(300);
    const index = mockCalls.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCalls[index] = { ...mockCalls[index], ...updates };
      return mockCalls[index];
    }
    throw new Error('Call not found');
  },

  async delete(id) {
    await delay(300);
    const index = mockCalls.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCalls.splice(index, 1);
      return true;
    }
    throw new Error('Call not found');
  }
};

// Mock Documents Data
const mockDocuments = [
  {
    id: 1,
    application_id: "EE-2024-001",
    client_name: "John Doe",
    document_type: "Passport Copy",
    status: "Received",
    priority: "High",
    date_requested: "2024-01-10",
    date_received: "2024-01-15",
    created_date: "2024-01-10",
    file_size: "2.3 MB",
    file_name: "passport_john_doe.pdf",
    notes: "Clear copy, all pages included"
  },
  {
    id: 2,
    application_id: "PNP-2024-002",
    client_name: "Jane Smith",
    document_type: "Educational Certificates",
    status: "Under Review",
    priority: "Medium",
    date_requested: "2024-01-08",
    date_received: "2024-01-12",
    created_date: "2024-01-08",
    file_size: "4.1 MB",
    file_name: "certificates_jane_smith.pdf",
    notes: "Multiple certificates included"
  },
  {
    id: 3,
    application_id: "WP-2024-003",
    client_name: "Bob Johnson",
    document_type: "CV/Resume",
    status: "Approved",
    priority: "Low",
    date_requested: "2024-01-05",
    date_received: "2024-01-08",
    created_date: "2024-01-05",
    file_size: "1.8 MB",
    file_name: "cv_bob_johnson.pdf",
    notes: "Updated with recent experience"
  },
  {
    id: 4,
    application_id: "SP-2024-004",
    client_name: "Alice Brown",
    document_type: "Bank Statement",
    status: "Required",
    priority: "High",
    date_requested: "2024-01-12",
    date_received: null,
    created_date: "2024-01-12",
    file_size: null,
    file_name: null,
    notes: "6 months bank statements required"
  },
  {
    id: 5,
    application_id: "FS-2024-005",
    client_name: "Charlie Wilson",
    document_type: "Marriage Certificate",
    status: "Requested",
    priority: "Medium",
    date_requested: "2024-01-08",
    date_received: null,
    created_date: "2024-01-08",
    file_size: null,
    file_name: null,
    notes: "Original or certified copy required"
  },
  {
    id: 6,
    application_id: "EE-2024-006",
    client_name: "Diana Prince",
    document_type: "Police Certificate",
    status: "Needs Correction",
    priority: "High",
    date_requested: "2024-01-01",
    date_received: "2024-01-10",
    created_date: "2024-01-01",
    file_size: "1.5 MB",
    file_name: "police_cert_diana_prince.pdf",
    notes: "Expiry date issue, needs renewal"
  },
  {
    id: 7,
    application_id: "WP-2024-007",
    client_name: "Frank Miller",
    document_type: "Medical Exam",
    status: "Verified",
    priority: "Medium",
    date_requested: "2024-01-03",
    date_received: "2024-01-14",
    created_date: "2024-01-03",
    file_size: "3.2 MB",
    file_name: "medical_exam_frank_miller.pdf",
    notes: "All tests completed successfully"
  }
];

export const Document = {
  async list(orderBy = 'created_date', limit = null) {
    await delay(500);
    let sorted = [...mockDocuments];

    if (orderBy.startsWith('-')) {
      const field = orderBy.substring(1);
      sorted.sort((a, b) => new Date(b[field]) - new Date(a[field]));
    } else {
      sorted.sort((a, b) => new Date(a[orderBy]) - new Date(b[orderBy]));
    }

    return limit ? sorted.slice(0, limit) : sorted;
  },

  async create(documentData) {
    await delay(300);
    const newDocument = {
      id: Math.max(...mockDocuments.map(d => d.id)) + 1,
      ...documentData,
      created_date: new Date().toISOString().split('T')[0],
      status: 'Received'
    };
    mockDocuments.push(newDocument);
    return newDocument;
  },

  async update(id, updates) {
    await delay(300);
    const index = mockDocuments.findIndex(d => d.id === id);
    if (index !== -1) {
      mockDocuments[index] = { ...mockDocuments[index], ...updates };
      return mockDocuments[index];
    }
    throw new Error('Document not found');
  },

  async delete(id) {
    await delay(300);
    const index = mockDocuments.findIndex(d => d.id === id);
    if (index !== -1) {
      mockDocuments.splice(index, 1);
      return true;
    }
    throw new Error('Document not found');
  }
};

export { User } from './User.js';
export { KnowledgeBase } from './KnowledgeBase.js';
export { OccupationKnowledge } from './OccupationKnowledge.js';
