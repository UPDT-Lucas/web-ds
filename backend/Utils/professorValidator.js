const z = require('zod');

const ProfessorScheme = z.object({
    firstName: z.string().min(3),
    secondName: z.string().optional(),
    firstSurname: z.string(),
    secondSurname: z.string().optional(),
    email: z.string().email(),
    campus: z.string(),
    password: z.string().min(6),
    cellPhone: z.string().min(8),
    officePhone: z.string().min(8),
    isCordinator: z.boolean(),
})

function validateProfessor(professor){
    return ProfessorScheme.safeParse(professor)
}


module.exports = {
    validateProfessor
}

