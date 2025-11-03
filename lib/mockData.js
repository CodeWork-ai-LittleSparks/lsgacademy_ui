// Mock data for schools
export const schoolsData = [
  {
    id: 1,
    name: "Cedar Grove School",
    location: "Florida",
    contactPerson: "Jennifer White",
    email: "jennifer@cedargrove.edu",
    phone: "+1 234-567-8908",
    programs: 2,
    students: 87,
    status: "Active",
    address: "123 Cedar Grove Ave, Miami, FL 33101",
    establishedYear: 2015,
    principalName: "Jennifer White",
    website: "www.cedargrove.edu"
  },
  {
    id: 2,
    name: "Greenwood Academy",
    location: "Texas",
    contactPerson: "Robert Taylor",
    email: "robert@greenwood.edu",
    phone: "+1 234-567-8907",
    programs: 4,
    students: 201,
    status: "Active",
    address: "456 Greenwood Blvd, Austin, TX 78701",
    establishedYear: 2012,
    principalName: "Robert Taylor",
    website: "www.greenwood.edu"
  },
  {
    id: 3,
    name: "Hillside Institute",
    location: "New York",
    contactPerson: "Thomas Martin",
    email: "thomas@hillside.edu",
    phone: "+1 234-567-8909",
    programs: 5,
    students: 267,
    status: "Inactive",
    address: "789 Hillside Dr, New York, NY 10001",
    establishedYear: 2010,
    principalName: "Thomas Martin",
    website: "www.hillside.edu"
  },
  {
    id: 4,
    name: "Maple Leaf High",
    location: "New York",
    contactPerson: "David Wilson",
    email: "david@mapleleaf.edu",
    phone: "+1 234-567-8905",
    programs: 6,
    students: 312,
    status: "Active",
    address: "321 Maple Leaf St, Brooklyn, NY 11201",
    establishedYear: 2008,
    principalName: "David Wilson",
    website: "www.mapleleaf.edu"
  },
  {
    id: 5,
    name: "Oakwood Institute",
    location: "Texas",
    contactPerson: "Michael Brown",
    email: "michael@oakwood.edu",
    phone: "+1 234-567-8903",
    programs: 4,
    students: 189,
    status: "Active",
    address: "654 Oakwood Rd, Dallas, TX 75201",
    establishedYear: 2014,
    principalName: "Michael Brown",
    website: "www.oakwood.edu"
  },
  {
    id: 6,
    name: "Pine Valley School",
    location: "Florida",
    contactPerson: "Emily Davis",
    email: "emily@pinevalley.edu",
    phone: "+1 234-567-8904",
    programs: 2,
    students: 98,
    status: "Inactive",
    address: "987 Pine Valley Way, Orlando, FL 32801",
    establishedYear: 2016,
    principalName: "Emily Davis",
    website: "www.pinevalley.edu"
  },
  {
    id: 7,
    name: "Riverside Academy",
    location: "California",
    contactPerson: "Sarah Johnson",
    email: "sarah@riverside.edu",
    phone: "+1 234-567-8901",
    programs: 3,
    students: 156,
    status: "Active",
    address: "147 Riverside Dr, Los Angeles, CA 90001",
    establishedYear: 2013,
    principalName: "Sarah Johnson",
    website: "www.riverside.edu"
  },
  {
    id: 8,
    name: "Sunset Elementary",
    location: "Arizona",
    contactPerson: "Mark Anderson",
    email: "mark@sunset.edu",
    phone: "+1 234-567-8902",
    programs: 3,
    students: 134,
    status: "Active",
    address: "258 Sunset Blvd, Phoenix, AZ 85001",
    establishedYear: 2017,
    principalName: "Mark Anderson",
    website: "www.sunset.edu"
  }
];

// Available locations for filtering
export const locations = [
  "All Locations",
  "Florida",
  "Texas", 
  "New York",
  "California",
  "Arizona"
];

// Available status options
export const statusOptions = [
  "All Status",
  "Active",
  "Inactive"
];

// Sort options
export const sortOptions = [
  { value: "name", label: "Name" },
  { value: "location", label: "Location" },
  { value: "students", label: "Students" },
  { value: "programs", label: "Programs" },
  { value: "status", label: "Status" }
];

// Programs data (keeping for backward compatibility)
export const programsData = [
  { id: 1, name: "Abacus", description: "Mental arithmetic using abacus" },
  { id: 2, name: "Phonics", description: "Reading and pronunciation skills" },
  { id: 3, name: "Vedic Maths", description: "Ancient Indian mathematics techniques" },
  { id: 4, name: "Creative Writing", description: "Enhance writing and storytelling skills" },
  { id: 5, name: "Science Lab", description: "Hands-on science experiments" },
  { id: 6, name: "Art & Craft", description: "Creative arts and crafts activities" }
];

// Detailed programs data for card display
export const detailedProgramsData = [
  {
    id: 1,
    name: "Abacus",
    category: "Maths & Logic",
    description: "Mental arithmetic using abacus techniques to enhance calculation speed and accuracy",
    levels: 10,
    levelRange: "Level 0-9",
    schools: 25,
    students: 450,
    status: "Active",
    image: "/images/programs/abacus.svg",
    color: "blue",
    features: ["Mental Math", "Speed Calculation", "Concentration", "Memory Enhancement"],
    ageGroup: "5-12 years",
    duration: "2 years"
  },
  {
    id: 2,
    name: "Phonics",
    category: "Language",
    description: "Reading and pronunciation skills development through systematic phonetic approach",
    levels: 8,
    levelRange: "Level 1-8",
    schools: 32,
    students: 580,
    status: "Active",
    image: "/images/programs/phonics.svg",
    color: "green",
    features: ["Reading Skills", "Pronunciation", "Vocabulary", "Comprehension"],
    ageGroup: "3-8 years",
    duration: "1.5 years"
  },
  {
    id: 3,
    name: "Vedic Maths",
    category: "Maths & Logic",
    description: "Ancient Indian mathematics techniques for faster and easier calculations",
    levels: 12,
    levelRange: "Level 1-12",
    schools: 18,
    students: 320,
    status: "Active",
    image: "/images/programs/vedic-maths.svg",
    color: "purple",
    features: ["Quick Calculations", "Mental Math", "Problem Solving", "Logical Thinking"],
    ageGroup: "8-16 years",
    duration: "3 years"
  },
  {
    id: 4,
    name: "Handwriting",
    category: "Language",
    description: "Improve handwriting skills with proper letter formation and writing techniques",
    levels: 6,
    levelRange: "Level 1-6",
    schools: 28,
    students: 490,
    status: "Active",
    image: "/images/programs/handwriting.svg",
    color: "orange",
    features: ["Letter Formation", "Cursive Writing", "Speed Writing", "Neat Presentation"],
    ageGroup: "4-10 years",
    duration: "1 year"
  },
  {
    id: 5,
    name: "Art & Craft",
    category: "Arts",
    description: "Creative arts and crafts activities to enhance creativity and fine motor skills",
    levels: 8,
    levelRange: "Level 1-8",
    schools: 15,
    students: 280,
    status: "Active",
    image: "/images/programs/art-craft.svg",
    color: "pink",
    features: ["Creativity", "Fine Motor Skills", "Color Theory", "Artistic Expression"],
    ageGroup: "3-12 years",
    duration: "2 years"
  },
  {
    id: 6,
    name: "Chess",
    category: "Strategy & Logic",
    description: "Strategic thinking and problem-solving through the game of chess",
    levels: 10,
    levelRange: "Level 1-10",
    schools: 22,
    students: 380,
    status: "Active",
    image: "/images/programs/chess.svg",
    color: "indigo",
    features: ["Strategic Thinking", "Problem Solving", "Concentration", "Planning"],
    ageGroup: "6-16 years",
    duration: "2.5 years"
  }
];

// Program categories for filtering
export const programCategories = [
  "All Categories",
  "Maths & Logic",
  "Language",
  "Arts",
  "Strategy & Logic"
];

// Program status options
export const programStatusOptions = [
  "All Status",
  "Active",
  "Inactive",
  "Coming Soon"
];

// Curriculum Management Data
export const curriculumData = {
  abacus: {
    id: 1,
    name: "Abacus",
    schools: 25,
    students: 450,
    lastSaved: "2 minutes ago",
    levels: [
      {
        id: 0,
        name: "Graph to Text Connection",
        description: "Teaching children to connect visual representations with numbers...",
        students: 120,
        milestones: 4,
        duration: 4,
        durationUnit: "weeks",
        ageRange: { min: 3, max: 6 },
        learningObjectives: [
          { id: 1, text: "Recognize numbers 1-100", completed: false },
          { id: 2, text: "Match pictures with numbers", completed: false },
          { id: 3, text: "Count objects and write number", completed: false }
        ],
        teachingInstructions: "Step 1: Show 5 apples, write number 5...\n\nStep 2: Have children count objects together...",
        requiredMaterials: [
          "Whiteboard and markers",
          "Counting objects (apples, blocks)",
          "Number flashcards 1-100"
        ],
        milestones: [
          {
            id: 1,
            name: "Count 1-10 objects correctly",
            description: "Child can count physical objects from 1 to 10 accurately",
            evaluation: "Show 10 items (blocks, toys), ask child to count aloud. Observe if counting is correct.",
            completed: true
          },
          {
            id: 2,
            name: "Write numbers 1-20",
            description: "Child can write numbers from 1 to 20 correctly",
            evaluation: "Provide worksheet with dotted numbers, observe writing accuracy",
            completed: false
          },
          {
            id: 3,
            name: "Number sequence understanding",
            description: "Child understands number sequences and can fill missing numbers",
            evaluation: "Present number sequences with gaps, child fills missing numbers",
            completed: false
          },
          {
            id: 4,
            name: "Visual-numerical association",
            description: "Child can associate visual representations with corresponding numbers",
            evaluation: "Show pictures with different quantities, child writes correct numbers",
            completed: false
          }
        ],
        resources: [
          {
            id: 1,
            name: "Counting Worksheet.pdf",
            type: "pdf",
            size: "2.3 MB",
            uploadDate: "Oct 15, 2025",
            downloads: 45
          },
          {
            id: 2,
            name: "Number Recognition Video.mp4",
            type: "video",
            size: "15.2 MB",
            views: 123
          },
          {
            id: 3,
            name: "Flashcards 1-50.pdf",
            type: "pdf",
            size: "5.1 MB",
            downloads: 67
          }
        ],
        statistics: {
          studentsAtLevel: 120,
          averageTime: "3.2 weeks",
          successRate: 87,
          performance: {
            excellent: { count: 45, percentage: 37.5 },
            average: { count: 58, percentage: 48.3 },
            inProcess: { count: 17, percentage: 14.2 }
          }
        }
      },
      {
        id: 1,
        name: "Introduction to Abacus",
        description: "Basic introduction to abacus structure and simple counting",
        students: 98,
        milestones: 3,
        duration: 6,
        durationUnit: "weeks",
        ageRange: { min: 4, max: 7 },
        learningObjectives: [
          { id: 1, text: "Identify abacus parts", completed: false },
          { id: 2, text: "Count using abacus beads", completed: false },
          { id: 3, text: "Represent numbers 1-50 on abacus", completed: false }
        ],
        teachingInstructions: "Step 1: Introduce abacus structure...\n\nStep 2: Practice bead movements...",
        requiredMaterials: [
          "Student abacus (13-rod)",
          "Teacher demonstration abacus",
          "Number charts"
        ],
        milestones: [
          {
            id: 1,
            name: "Abacus familiarity",
            description: "Child can identify all parts of abacus",
            evaluation: "Point to different parts, child names them correctly",
            completed: false
          },
          {
            id: 2,
            name: "Basic counting",
            description: "Count 1-20 using abacus beads",
            evaluation: "Child demonstrates counting using abacus",
            completed: false
          },
          {
            id: 3,
            name: "Number representation",
            description: "Show numbers 1-50 on abacus",
            evaluation: "Given numbers, child sets them on abacus",
            completed: false
          }
        ],
        resources: [],
        statistics: {
          studentsAtLevel: 98,
          averageTime: "4.1 weeks",
          successRate: 82,
          performance: {
            excellent: { count: 32, percentage: 32.7 },
            average: { count: 48, percentage: 49.0 },
            inProcess: { count: 18, percentage: 18.3 }
          }
        }
      },
      {
        id: 2,
        name: "Simple Addition",
        description: "Basic addition operations using abacus",
        students: 85,
        milestones: 3,
        duration: 8,
        durationUnit: "weeks",
        ageRange: { min: 5, max: 8 },
        learningObjectives: [
          { id: 1, text: "Add single digit numbers", completed: false },
          { id: 2, text: "Understand addition concept", completed: false },
          { id: 3, text: "Solve addition problems up to 20", completed: false }
        ],
        teachingInstructions: "Step 1: Demonstrate addition with beads...\n\nStep 2: Practice with simple problems...",
        requiredMaterials: [
          "Student abacus",
          "Addition worksheets",
          "Counting objects"
        ],
        milestones: [],
        resources: [],
        statistics: {
          studentsAtLevel: 85,
          averageTime: "5.8 weeks",
          successRate: 79,
          performance: {
            excellent: { count: 25, percentage: 29.4 },
            average: { count: 42, percentage: 49.4 },
            inProcess: { count: 18, percentage: 21.2 }
          }
        }
      },
      {
        id: 3,
        name: "Addition & Subtraction",
        description: "Combined addition and subtraction operations",
        students: 67,
        milestones: 4,
        duration: 10,
        durationUnit: "weeks",
        ageRange: { min: 6, max: 9 },
        learningObjectives: [],
        teachingInstructions: "",
        requiredMaterials: [],
        milestones: [],
        resources: [],
        statistics: {
          studentsAtLevel: 67,
          averageTime: "7.2 weeks",
          successRate: 75,
          performance: {
            excellent: { count: 18, percentage: 26.9 },
            average: { count: 32, percentage: 47.8 },
            inProcess: { count: 17, percentage: 25.3 }
          }
        }
      },
      {
        id: 4,
        name: "Two-Digit Numbers",
        description: "Working with two-digit numbers on abacus",
        students: 45,
        milestones: 3,
        duration: 12,
        durationUnit: "weeks",
        ageRange: { min: 7, max: 10 },
        learningObjectives: [],
        teachingInstructions: "",
        requiredMaterials: [],
        milestones: [],
        resources: [],
        statistics: {
          studentsAtLevel: 45,
          averageTime: "8.5 weeks",
          successRate: 71,
          performance: {
            excellent: { count: 12, percentage: 26.7 },
            average: { count: 20, percentage: 44.4 },
            inProcess: { count: 13, percentage: 28.9 }
          }
        }
      },
      {
        id: 5,
        name: "Multiplication Basics",
        description: "Introduction to multiplication using abacus",
        students: 23,
        milestones: 3,
        duration: 14,
        durationUnit: "weeks",
        ageRange: { min: 8, max: 11 },
        learningObjectives: [],
        teachingInstructions: "",
        requiredMaterials: [],
        milestones: [],
        resources: [],
        statistics: {
          studentsAtLevel: 23,
          averageTime: "10.1 weeks",
          successRate: 68,
          performance: {
            excellent: { count: 6, percentage: 26.1 },
            average: { count: 10, percentage: 43.5 },
            inProcess: { count: 7, percentage: 30.4 }
          }
        }
      },
      {
        id: 6,
        name: "Division Basics",
        description: "Basic division operations using abacus",
        students: 8,
        milestones: 2,
        duration: 16,
        durationUnit: "weeks",
        ageRange: { min: 9, max: 12 },
        learningObjectives: [],
        teachingInstructions: "",
        requiredMaterials: [],
        milestones: [],
        resources: [],
        statistics: {
          studentsAtLevel: 8,
          averageTime: "12.3 weeks",
          successRate: 62,
          performance: {
            excellent: { count: 2, percentage: 25.0 },
            average: { count: 3, percentage: 37.5 },
            inProcess: { count: 3, percentage: 37.5 }
          }
        }
      },
      {
        id: 7,
        name: "Mixed Operations",
        description: "Combined mathematical operations",
        students: 3,
        milestones: 2,
        duration: 18,
        durationUnit: "weeks",
        ageRange: { min: 10, max: 13 },
        learningObjectives: [],
        teachingInstructions: "",
        requiredMaterials: [],
        milestones: [],
        resources: [],
        statistics: {
          studentsAtLevel: 3,
          averageTime: "14.2 weeks",
          successRate: 58,
          performance: {
            excellent: { count: 1, percentage: 33.3 },
            average: { count: 1, percentage: 33.3 },
            inProcess: { count: 1, percentage: 33.3 }
          }
        }
      },
      {
        id: 8,
        name: "Advanced Calculations",
        description: "Complex mathematical calculations using abacus",
        students: 1,
        milestones: 1,
        duration: 20,
        durationUnit: "weeks",
        ageRange: { min: 11, max: 14 },
        learningObjectives: [],
        teachingInstructions: "",
        requiredMaterials: [],
        milestones: [],
        resources: [],
        statistics: {
          studentsAtLevel: 1,
          averageTime: "16.5 weeks",
          successRate: 55,
          performance: {
            excellent: { count: 0, percentage: 0 },
            average: { count: 1, percentage: 100 },
            inProcess: { count: 0, percentage: 0 }
          }
        }
      }
    ]
  }
};

// Reports Data
export const reportsData = {
  overview: {
    totalStudents: 1200,
    totalEvaluations: 3450,
    evaluationPeriod: 17,
    avgTimePerEvaluation: 2.3,
    dateRange: {
      start: "2025-10-01",
      end: "2025-10-18"
    }
  },
  performanceDistribution: {
    excellent: { count: 420, percentage: 35 },
    average: { count: 540, percentage: 45 },
    inProcess: { count: 240, percentage: 20 }
  },
  programPerformance: [
    {
      id: 1,
      name: "Abacus",
      students: 450,
      excellent: { count: 160, percentage: 36 },
      average: { count: 200, percentage: 44 },
      inProcess: { count: 90, percentage: 20 }
    },
    {
      id: 2,
      name: "Phonics",
      students: 320,
      excellent: { count: 115, percentage: 36 },
      average: { count: 145, percentage: 45 },
      inProcess: { count: 60, percentage: 19 }
    },
    {
      id: 3,
      name: "Vedic Maths",
      students: 280,
      excellent: { count: 95, percentage: 34 },
      average: { count: 130, percentage: 46 },
      inProcess: { count: 55, percentage: 20 }
    },
    {
      id: 4,
      name: "Reading",
      students: 150,
      excellent: { count: 50, percentage: 33 },
      average: { count: 65, percentage: 43 },
      inProcess: { count: 35, percentage: 23 }
    }
  ],
  schoolRankings: [
    {
      rank: 1,
      id: 1,
      name: "Green Valley School",
      location: "Chennai",
      students: 145,
      excellentPercentage: 58,
      averagePercentage: 35,
      inProcessPercentage: 7
    },
    {
      rank: 2,
      id: 2,
      name: "Bright Minds Academy",
      location: "Mumbai",
      students: 132,
      excellentPercentage: 56,
      averagePercentage: 36,
      inProcessPercentage: 8
    },
    {
      rank: 3,
      id: 3,
      name: "Future Leaders School",
      location: "Bangalore",
      students: 128,
      excellentPercentage: 55,
      averagePercentage: 37,
      inProcessPercentage: 8
    },
    {
      rank: 4,
      id: 4,
      name: "Excellence Public School",
      location: "Delhi",
      students: 118,
      excellentPercentage: 52,
      averagePercentage: 40,
      inProcessPercentage: 8
    },
    {
      rank: 5,
      id: 5,
      name: "Rainbow International",
      location: "Hyderabad",
      students: 112,
      excellentPercentage: 50,
      averagePercentage: 42,
      inProcessPercentage: 8
    },
    {
      rank: 6,
      id: 6,
      name: "Smart Kids Academy",
      location: "Pune",
      students: 105,
      excellentPercentage: 48,
      averagePercentage: 43,
      inProcessPercentage: 9
    },
    {
      rank: 7,
      id: 7,
      name: "Knowledge Hub School",
      location: "Kolkata",
      students: 98,
      excellentPercentage: 44,
      averagePercentage: 45,
      inProcessPercentage: 9
    },
    {
      rank: 8,
      id: 8,
      name: "Little Scholars",
      location: "Ahmedabad",
      students: 92,
      excellentPercentage: 41,
      averagePercentage: 44,
      inProcessPercentage: 7
    },
    {
      rank: 9,
      id: 9,
      name: "Premier Academy",
      location: "Jaipur",
      students: 88,
      excellentPercentage: 39,
      averagePercentage: 42,
      inProcessPercentage: 7
    },
    {
      rank: 10,
      id: 10,
      name: "Sunrise School",
      location: "Lucknow",
      students: 82,
      excellentPercentage: 36,
      averagePercentage: 40,
      inProcessPercentage: 6
    }
  ],
  filterOptions: {
    schools: [
      "All Schools",
      "Green Valley School",
      "Bright Minds Academy",
      "Future Leaders School",
      "Excellence Public School",
      "Rainbow International",
      "Smart Kids Academy",
      "Knowledge Hub School",
      "Little Scholars",
      "Premier Academy",
      "Sunrise School"
    ],
    programs: [
      "All Programs",
      "Abacus",
      "Phonics",
      "Vedic Maths",
      "Reading",
      "Handwriting",
      "Art & Craft",
      "Chess"
    ],
    levels: [
      "All Levels",
      "Level 0",
      "Level 1",
      "Level 2",
      "Level 3",
      "Level 4",
      "Level 5",
      "Level 6",
      "Level 7",
      "Level 8",
      "Level 9"
    ],
    categories: [
      "All Categories",
      "Performance Overview",
      "Level Progression",
      "Teacher Activity",
      "Custom Reports"
    ]
  }
};