/** ルートパス定数。URL をハードコードせず必ずここを参照する */
export const paths = {
  login: "/login",
  dashboard: "/",
  participants: {
    list: "/participants",
    new: "/participants/new",
    detail: (id: string) => `/participants/${id}`,
    edit: (id: string) => `/participants/${id}/edit`,
  },
  companies: {
    list: "/companies",
    new: "/companies/new",
    detail: (id: string) => `/companies/${id}`,
    edit: (id: string) => `/companies/${id}/edit`,
  },
  assignments: {
    list: "/assignments",
    new: "/assignments/new",
    detail: (id: string) => `/assignments/${id}`,
  },
  reports: {
    list: "/reports",
    detail: (id: string) => `/reports/${id}`,
  },
  optimization: {
    list: "/optimization",
    new: "/optimization/new",
    detail: (id: string) => `/optimization/${id}`,
  },
  staff: {
    list: "/staff",
  },
} as const;
