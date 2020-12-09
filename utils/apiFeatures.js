class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    console.log('hello');
    // 1A) FILTERING
    const queryObject = { ...this.queryStr };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObject[el]);
    // 1B) ADVANCE FILTERING
    let queryStr = JSON.stringify(queryObject);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
    //
    // let query = Tour.find(JSON.parse(queryStr));
  }

  sort() {
    // 2) SORTING
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
      console.log('hello sort');
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitsFields() {
    console.log('fields');
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    console.log('hello paginate');
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
