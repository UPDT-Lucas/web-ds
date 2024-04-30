const z = require('zod');

const StudentScheme = z.object({
    firstName: z.string().min(3),
    secondName: z.string().optional(),
    firstSurname: z.string(),
    secondSurname: z.string().optional(),
    email: z.string().email(),
    campus: z.string(),
    cellPhone: z.string().min(8),
    carnet: z.string().min(10)
})

function validateStudent(student){
    return StudentScheme.safeParse(student)
}


module.exports = {
    validateStudent
}


