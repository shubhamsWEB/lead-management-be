/**
 * Utility class to handle filtering, sorting, and pagination for API requests
 */
class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    /**
     * Filter results based on query parameters
     * Excludes pagination, sorting, and search parameters
     */
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'sortOrder'];
      excludedFields.forEach(el => delete queryObj[el]);
  
      // Advanced filtering (gt, gte, lt, lte)
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    /**
     * Search in text indexed fields
     */
    search() {
      if (this.queryString.search) {
        this.query = this.query.find({
          $text: { $search: this.queryString.search }
        });
      }
      return this;
    }
  
    /**
     * Sort results based on sort parameter
     * Default sort is by createdAt descending (newest first)
     */
    sort() {
      if (this.queryString.sort) {
        const sortOrder = this.queryString.sortOrder === 'desc' ? -1 : 1;
        const sortBy = this.queryString.sort;
        
        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        
        this.query = this.query.sort(sortObj);
      } else {
        // Default sort by createdAt descending (newest first)
        this.query = this.query.sort({ createdAt: -1 });
      }
      return this;
    }
  
    /**
     * Limit fields returned in the response
     */
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        // Exclude the MongoDB internal field
        this.query = this.query.select('-__v');
      }
      return this;
    }
  
    /**
     * Paginate results
     */
    paginate() {
      const page = parseInt(this.queryString.page, 10) || 1;
      const limit = parseInt(this.queryString.limit, 10) || 10;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
      
      // Store pagination info for the controller
      this.paginationInfo = {
        page,
        limit
      };
  
      return this;
    }
  }
  
  module.exports = APIFeatures;