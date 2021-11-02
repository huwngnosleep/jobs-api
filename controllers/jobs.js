const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError, NotFoundError} = require('../errors')

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort('createdAt')
        res.status(StatusCodes.OK).json({jobs})
        
    } catch (error) {
        console.log(error)
        throw BadRequestError('Not find any data')
    }
}

const getJob = async (req, res) => {
    const {
        user: {userId}, 
        params: {id: jobId}
    } = req

    const job = await Job.findOne({
        _id: jobId, createdBy: userId,
    })

    if(!job) {
        throw new NotFoundError('No job with that id')
    }

    res.status(StatusCodes.OK).json({job})
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async (req, res) => {
    const {
        body: {company, position},
        user: { userId },
        params: {id: jobId},
    } = req

    if(company === '' || position === '') {
        throw new BadRequestError('Company or Position can not be empty')
    }

    const job = await Job.findByIdAndUpdate(
        {_id: jobId, createdBy: userId}, 
        req.body, 
        {new: true, runValidators: true}
    )

    res.json({job})
}

const deleteJob = async (req, res) => {
    const {
        user: {userId},
        params: {id: jobId},
    } = req

    const job = await Job.findByIdAndRemove({
        _id: jobId,
        createdBy: userId
    })

    if(!job) {
        throw new NotFoundError(`No job with id ${jobId})`)

    }

    res.status(StatusCodes.OK).send('Success')
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    deleteJob,
    updateJob,
}