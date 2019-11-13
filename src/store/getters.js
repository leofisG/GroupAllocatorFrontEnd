export const studentCount = state => {
    return state.parsedStudents.length;
}

export const firstStudent = state => {
    return state.parsedStudents[0];
}

export const rightURL = state => {
    return state.usedURL;
}