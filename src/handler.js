const {nanoid} = require('nanoid')
const notes = require('./notes')

const addNoteHandler = (request, h) => {
    const {title, tags, body} = request.payload
    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const newNote = {
        title, tags, body, id, createdAt, updatedAt
    }

    notes.push(newNote)

    const isSuccess = notes.filter((note)=>note.id === id).length > 0;

    if(isSuccess){
        const response = h.response({
            status:"success",
            message:"Catatan berhasil",
            data:{
                noteId:id
            }
        })
        response.code(201)
        return response
    }

    const response = h.reponse({
        status:"fail",
        message:"Catatan gagal ditambahkan"
    })
    reponse.code(500)
    response.header('Access-Control-Allow-Origin', 'http://ec2-13-212-153-62.ap-southeast-1.compute.amazonaws.com:8000/');
    return response
}

const getAllNotesHandler = (request, h) => ({
    status:'success',
    data:{
        notes,
    }
})

const getNoteByIdHandler = (request, h) => {
    const {id} = request.params;

    const note = notes.filter( (n) => n.id === id)[0];

    if(note !== undefined){
        return {
            status:'success',
            data:{
                note
            }
        }
    }

    const response = h.response({
        status:'fail',
        message:'Catatan tidak ditemukan'
    })

    response.code(404)
    return response
}

const editNoteByIdHandler = (request, h) => {
    const {id} = request.params
    const {body, title, tags} = request.payload
    const updatedAt = new Date().toISOString()

    const index = notes.findIndex( (note) => note.id === id)

    if(index !== -1){
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt
        }

        const response = h.response({
            status:"success",
            message:"Catatan berhasil diperbaharui"
        });

        response.code(200)
        return response
    }

    const response = h.response({
        status:"fail",
        message:"Gagal memperbaharui catatan. Id tidak ditemukan"
    });
    response.code(404);
    return response;
}

const deleteNoteById = (request, h) => {
    const {id} = request.params

    const note = notes.findIndex((n) => n.id === id);
    if(note !== undefined){
        notes.splice(note, 1)
        const response = h.response({
            status:"success",
            message:"Catatan berhasil dihapus"
        })
        response.code(200)
        return response
    }

    const response = h.response({
        status:"fail",
        message:"Note gagal dihapus"
    })
    response.code(404)
    return response
}

module.exports = {addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteById};