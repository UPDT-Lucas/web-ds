const Student = require('../Models/Student');

class StudentAdapter{
    constructor(email, carnet){
        this.email = email;
        //this.carnet = carnet;
        this.student = null;
    }

    async load() {
        try {
            this.student = await Student.findOne({ email: this.email }).exec();
        } catch (error) {
            console.error('Error al cargar estudiante:', error);
            throw error; 
        }
    }

    get id() {
        return this.student ? this.student._id : null;
    }

    get password() {
        return this.student ? this.student.carnet : null;
    }

    /*get role(){
        return this.student ? this.student.rol : null;
    }*/

    get details() {
        if (!this.student) return null;
        const fullName = `${this.student.firstName} ${this.student.secondName} ${this.student.firstSurname} ${this.student.secondSurname}`;
        return {
            id: this.student._id,
            name: fullName,
            email: this.student.email,
            //role: this.student.rol
        };
    }
}

module.exports = StudentAdapter;