const Tour = require('./../models/tourModel');

// handle tours
exports.getAllTours = async (req, res) => {
    try {
        console.log(req.query);
        // BUILD THE QUERY
        // 1.1 Filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];

        excludedFields.forEach(el => delete queryObj[el]);

        // 1.2. Advance filtering
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        queryString = JSON.parse(queryString);
        // console.log(queryString);

        let query = Tour.find(queryString);

        // 2. Sorting
        if (req.query.sort) {
            const querySort = req.query.sort.split(',').join(' ');
            // const querySort = req.query.sort.replace(',', ' ');
            console.log(querySort);
            query = query.sort(querySort);
        } else {
            // default sort by createdAt
            query = query.sort('-createdAt');
        }

        // 3. Fields limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            console.log(fields);
            query = query.select(fields);
            // query = query.select('name duration price')
        } else {
            query = query.select('-__v');
        }

        // way 1 to filter:
        // const tours = await Tour.find({
        //     duration: 5,
        //     difficulty: 'easy'
        // });

        // do by way 1:

        // {difficulty: 'easy', duration: { $gte: 5}} // difficulty='easy' and duration >= 5
        // { difficulty: 'easy', duration: { gte: '5' } }

        // way 2:
        // const query = Tour.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy');

        // EXECUTE THE QUERY
        const tours = await query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours: tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: 'Can not get the data!'
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        // const tour = await Tour.findOne({ _id: req.params.id });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
    // const id = req.params.id * 1;
    // // const tour = tours.find(item => item.id === id);
};

exports.createTour = async (req, res) => {
    // normal way: using Promise
    // const newTour = new Tour({});
    // newTour.save().then().catch();

    // another way: using async await
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};
