export const studentCount = state => state.parsedStudents.length

export const firstStudent = state => state.parsedStudents[0];

export const password = state => state.isAuthenticated

export const rightURL = state => state.usedURL;
