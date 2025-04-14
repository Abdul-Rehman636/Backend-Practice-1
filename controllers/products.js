const products = require("../data/products");

const getProducts = (req, res) => {
  const {
    sort,
    category,
    minPrice,
    maxPrice,
    minRating,
    page = 1,
    limit = 10,
  } = req.query;

  let result = [...products];

  if (category) {
    result = result.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (minPrice) {
    result = result.filter((product) => product.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    result = result.filter((product) => product.price <= parseFloat(maxPrice));
  }

  if (minRating) {
    result = result.filter(
      (product) => product.rating >= parseFloat(minRating)
    );
  }

  if (sort) {
    const [sortField, sortOrder] = sort.split(":");

    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortOrder === "desc" ? 1 : -1;
      }
      if (a[sortField] > b[sortField]) {
        return sortOrder === "desc" ? -1 : 1;
      }
      return 0;
    });
  }

  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);
  const startIndex = (pageInt - 1) * limitInt;
  const endIndex = pageInt * limitInt;

  const paginatedResult = result.slice(startIndex, endIndex);

  res.json({
    totalItems: result.length,
    totalPages: Math.ceil(result.length / limitInt),
    currentPage: pageInt,
    itemsPerPage: limitInt,
    products: paginatedResult,
  });
};

module.exports = {
  getProducts,
};
