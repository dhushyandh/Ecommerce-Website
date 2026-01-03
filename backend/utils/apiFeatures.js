class APIFeatures {
    constructor(query , queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        let keyword = this.queryStr.keyword ? {
            name: {
                $regex : this.queryStr.keyword,
                $options: "i"
            }
        } : {};

        this.query = this.query.find({...keyword});
        return this;

    }
    filter(){
        const queryCopy = {...this.queryStr};

        // Removing some fields for category
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(field => delete queryCopy[field]);


        const formattedQuery = {};
        const castValue = (v) => (typeof v === 'string' && !isNaN(v) ? Number(v) : v);
        Object.keys(queryCopy).forEach(key => {
            const val = queryCopy[key];
            const bracketMatch = key.match(/(.+)\[(.+)\]/);
            if (bracketMatch) {
                const root = bracketMatch[1];
                const sub = bracketMatch[2];
                if (!formattedQuery[root]) formattedQuery[root] = {};
                formattedQuery[root][sub] = castValue(val);
            } else {
                formattedQuery[key] = castValue(val);
            }
        });

        // Advance filter for price, ratings etc
        let queryStr = JSON.stringify(formattedQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }


    paginate(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;

    }
}

module.exports = APIFeatures;