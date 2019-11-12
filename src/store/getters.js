export const studentCount = state => state.parsedStudents.length

export const firstStudent = state => state.parsedStudents[0];

export const rightURL = state => (state.debugURL != "" ? 
                                  state.debugURL : state.productionURL)

export const password = state => state.isAuthenticated

