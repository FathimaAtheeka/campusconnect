function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function buildPageResult({ data, total, page, limit }) {
  return { data, total, page, totalPages: Math.ceil(total / limit) || 1, limit };
}

module.exports = { parsePagination, buildPageResult };
