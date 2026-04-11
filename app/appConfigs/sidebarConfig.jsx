export const sidebarConfig = [
  // Projects
  {
    type: "submenu",
    label: "Projects",
    icon: "fa fa-folder",
    roles: [],
    items: [
      { label: "Add Project", href: (routes) => `${routes.cms}/projects/profile`, roles: [] },
      { label: "All Projects", href: (routes) => `${routes.cms}/projects/list`, roles: [] },
    ],
  },

  // Tasks
  {
    type: "submenu",
    label: "Tasks",
    icon: "fa fa-tasks",
    roles: [],
    items: [
      { label: "All Tasks", href: (routes) => `${routes.cms}/projectsteps/list`, roles: [] },
      { label: "Add Task", href: (routes) => `${routes.cms}/projectsteps/profile`, roles: [] },
    ],
  },

  // Clients
  {
    type: "submenu",
    label: "Clients",
    icon: "fa fa-users",
    roles: [],
    items: [
      { label: "Client List", href: (routes) => `${routes.cms}/clients/list`, roles: [] },
      { label: "Add Client", href: (routes) => `${routes.cms}/clients/profile`, roles: [] },
    ],
  },

  // Payments
  {
    type: "submenu",
    label: "Payments",
    icon: "fa fa-money",
    roles: [],
    items: [
      { label: "All Payments", href: (routes) => `${routes.cms}/payments/list`, roles: [] },
      { label: "Add Payment", href: (routes) => `${routes.cms}/payments/profile`, roles: [] },
    ],
  },

  // Documents
  {
    type: "submenu",
    label: "Documents",
    icon: "fa fa-file",
    roles: [],
    items: [
      { label: "All Documents", href: (routes) => `${routes.cms}/documents/list`, roles: [] },
      { label: "Upload Document", href: (routes) => `${routes.cms}/documents/profile`, roles: [] },
    ],
  },

  // Settings
  {
    type: "submenu",
    label: "Settings",
    icon: "fa fa-cogs",
    roles: [],
    items: [
      { label: "System users", href: (routes) => `${routes.cms}/sysusers/list`, roles: [] },
    ],
  },
];