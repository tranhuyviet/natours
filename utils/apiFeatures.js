class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // 1.1 Filtering
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];

        excludedFields.forEach(el => delete queryObj[el]);

        // 1.2. Advance filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            match => `$${match}`
        );
        queryStr = JSON.parse(queryStr);

        this.query = this.query.find(queryStr);

        return this;
    }

    sort() {
        // 2. Sorting
        if (this.queryString.sort) {
            const querySort = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(querySort);
        } else {
            // default sort by createdAt
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        // 3. Fields limiting
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
            // query = query.select('name duration price')
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        // 4.Pagination
        // page=3&limit=10: page 1 = 1-10; page 2 = 11-20; page 3 = 21-30
        const page = this.queryString.page * 1 || 1; // convert string to Number and default by 1
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;
