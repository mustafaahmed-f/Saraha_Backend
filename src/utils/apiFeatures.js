import { paginationFunction } from "./pagination.js";

export class ApiFeatures {
  constructor(mongooseQuery, queryObj) {
    this.mongooseQuery = mongooseQuery;
    this.queryObj = queryObj;
  }

  sort() {
    //// Only receive new or old in the query:
    if (!this.queryObj?.sort) return this;
    let sortValue;
    if (this.queryObj?.sort === "new") sortValue = "-createdAt";
    else if (this.queryObj?.sort === "old") sortValue = "createdAt";
    else throw new Error("Sort value should be new or old ONLY !!");
    this.mongooseQuery.sort(sortValue);
    return this;
  }

  pagination() {
    const { page } = this.queryObj;
    const { skip, limit } = paginationFunction({ page });
    this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
}
