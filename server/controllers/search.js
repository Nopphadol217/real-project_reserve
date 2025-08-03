const prisma = require("../config/prisma");

// Search places with filters
const searchPlaces = async (req, res) => {
  try {
    const {
      query,
      category,
      minPrice,
      maxPrice,
      location,
      page = 1,
      limit = 12,
    } = req.query;

    const whereConditions = {
      AND: [],
    };

    // Text search in title and description
    if (query) {
      whereConditions.AND.push({
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            address: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      });
    }

    // Category filter
    if (category) {
      whereConditions.AND.push({
        category: {
          equals: category,
        },
      });
    }

    // Location filter
    if (location) {
      whereConditions.AND.push({
        address: {
          contains: location,
          mode: "insensitive",
        },
      });
    }

    // Price range filter
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice);

      whereConditions.AND.push({
        price: priceFilter,
      });
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count for pagination
    const totalCount = await prisma.place.count({
      where: whereConditions.AND.length > 0 ? whereConditions : {},
    });

    // Get places with pagination
    const places = await prisma.place.findMany({
      where: whereConditions.AND.length > 0 ? whereConditions : {},
      include: {
        gallery: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        _count: {
          select: {
            favorites: true,
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: parseInt(limit),
    });

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: {
        places,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
        filters: {
          query,
          category,
          minPrice,
          maxPrice,
          location,
        },
      },
    });
  } catch (error) {
    console.error("Search places error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการค้นหา",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.place.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    const categoryList = categories
      .map((item) => item.category)
      .filter(Boolean);

    res.json({
      success: true,
      data: categoryList,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get popular locations
const getLocations = async (req, res) => {
  try {
    const locations = await prisma.place.groupBy({
      by: ["address"],
      _count: {
        address: true,
      },
      orderBy: {
        _count: {
          address: "desc",
        },
      },
      take: 10,
    });

    const locationList = locations.map((item) => ({
      location: item.address,
      count: item._count.address,
    }));

    res.json({
      success: true,
      data: locationList,
    });
  } catch (error) {
    console.error("Get locations error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลสถานที่",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  searchPlaces,
  getCategories,
  getLocations,
};
