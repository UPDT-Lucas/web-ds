const z = require('zod');

const CampusScheme = z.object({
    campusName: z.string(),
})

function validateCampus(campus){
    return CampusScheme.safeParse(campus)
}


module.exports = {
    validateCampus
}
